#!/usr/bin/env node
// Hyperswitch auth shim. The nightly-standalone router build is missing the
// user-auth routes (signin/login/etc), so the Control Center's login fails
// with IR_02. This proxy:
//   1. Intercepts signin endpoints and validates bcrypt against Postgres.
//   2. Mints ES256 JWTs signed with the local EC private key — matching the
//      Hyperswitch Control Center's JWT verifier which uses the public_key
//      returned by /tenant/secrets to validate tokens.
//   3. Intercepts /tenant/* requests so the CC gets OUR public_key.
//   4. Proxies every other request to the real router.
//
// Generated EC keypair (private + public in PEM) is persisted to /data on the
// first run so subsequent restarts reuse the same key. The CC caches the key
// once it fetches it.

const http  = require('node:http');
const fs    = require('node:fs');
const path  = require('node:path');
const crypto = require('node:crypto');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const PORT = parseInt(process.env.PORT || '8081', 10);
const UPSTREAM = process.env.ROUTER_UPSTREAM || 'http://hyperswitch-router:8080';
const KEY_DIR = process.env.KEY_DIR || '/data';

// Load or generate the EC P-256 keypair used to sign JWTs.
function loadOrCreateKey() {
  fs.mkdirSync(KEY_DIR, { recursive: true });
  const privPath = path.join(KEY_DIR, 'ec-priv.pem');
  const pubPath  = path.join(KEY_DIR, 'ec-pub.pem');
  if (fs.existsSync(privPath) && fs.existsSync(pubPath)) {
    return {
      privateKey: crypto.createPrivateKey(fs.readFileSync(privPath)),
      publicKeyPem: fs.readFileSync(pubPath, 'utf8'),
    };
  }
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const privPem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const pubPem  = publicKey.export({ type: 'spki',  format: 'pem' });
  fs.writeFileSync(privPath, privPem, { mode: 0o600 });
  fs.writeFileSync(pubPath,  pubPem,  { mode: 0o644 });
  return { privateKey, publicKeyPem: pubPem };
}

const { privateKey, publicKeyPem } = loadOrCreateKey();

function signJwt(payload) {
  const header  = Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'JWT' })).toString('base64url');
  const body    = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig     = crypto.sign('SHA256', Buffer.from(`${header}.${body}`), privateKey).toString('base64url');
  return `${header}.${body}.${sig}`;
}

const TENANT_PUBLIC_KEY_B64 = Buffer.from(publicKeyPem).toString('base64');
const pg = new Pool({
  host: process.env.PGHOST || 'hyperswitch-postgres',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'hyperswitch',
  password: process.env.PGPASSWORD || 'change_me_hs_pg',
  database: process.env.PGDATABASE || 'hyperswitch',
  max: 8,
});

// The CC sends paths like `/api/user/v2/signin` (note: `/api/user/v2/`, no
// `/users/` segment). Accept both forms so the proxy works regardless of how
// the CC was built.
const SIGNIN_RE     = /^(?:\/api\/user|\/api)?\/v[12]\/users?\/(signin|login)(\?|$)|^(\/api\/user|\/api)?\/v[12]\/(signin|login)(\?|$)/;
const TENANT_RE     = /^(?:\/api)?\/tenant\/(?:secrets|fetch|info)/;
const ME_RE         = /^(?:\/api\/user|\/api)?\/v[12]\/users?\/me(\?|$)|^(\/api\/user|\/api)?\/v[12]\/me(\?|$)/;
const SIGNUP_RE     = /^(?:\/api\/user|\/api)?\/v[12]\/users?\/sign[_-]?up(\?|$)|^(\/api\/user|\/api)?\/v[12]\/sign[_-]?up(\?|$)/;
const USERS_DETAILS = /^(?:\/api\/user|\/api)?\/v[12]\/users?\/details(\?|$)|^(\/api\/user|\/api)?\/v[12]\/details(\?|$)/;
const PROFILE_LIST  = /^(?:\/api)?\/v[12]\/(business_profile|profile)\/list(\?|$)/;
const PROFILE_GET   = /^(?:\/api)?\/v[12]\/(business_profile|profile)\/[^/]+(\?|$)/;
const MERCHANT_LIST = /^(?:\/api)?\/v[12]\/merchant\/account(\?|$)/;
const APIKEYS_PATH  = /^(?:\/api)?\/v2\/orchestration\/developer-api-keys(\?|$)/;
const AUTH_LIST     = /^\/api\/user\/auth\/list(\?|$)/;

const MERCHANT_ID = 'apex_revenue_1786220515';
const ORG_ID      = 'org_JrNaXfqIOsvW5XvcJsPu';
const USER_ID     = 'usr_06e2d1d391fc55cf50a8c93f3b01757a';
const DEFAULT_PROFILE = 'public';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end',  () => {
      const text = Buffer.concat(chunks).toString('utf8');
      if (!text) return resolve({});
      try { resolve(JSON.parse(text)); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
    'access-control-allow-origin': '*',
  });
  res.end(body);
}

function pickEmail(req) {
  return new Promise(async (resolve) => {
    const url = new URL(req.url, `http://${req.headers.host || 'x'}`);
    resolve(url.searchParams.get('email'));
  });
}

async function handleSignin(req, res) {
  let body = {};
  try { body = await readJsonBody(req); }
  catch { return json(res, 400, { error: 'invalid json' }); }
  const email = (body.email || body.username || '').toLowerCase().trim();
  const password = body.password || '';
  if (!email || !password) {
    return json(res, 400, { error: 'email and password required' });
  }

  let row;
  try {
    const r = await pg.query(
      `SELECT user_id, email, name, password FROM users WHERE LOWER(email) = LOWER($1) AND is_active = true`,
      [email],
    );
    row = r.rows[0];
  } catch (e) {
    return json(res, 500, { error: 'db error', detail: e.message });
  }
  if (!row) return json(res, 401, { error: 'invalid_credentials' });

  // password column is bcrypt $2b$12$... or argon2id $argon2id$... — we accept both.
  let ok = false;
  try {
    if (row.password && row.password.startsWith('$2')) {
      ok = await bcrypt.compare(password, row.password);
    } else if (row.password && row.password.startsWith('$argon2')) {
      // We don't have argon2 in this image; only bcrypt compares succeed.
      ok = false;
    }
  } catch { ok = false; }

  if (!ok) return json(res, 401, { error: 'invalid_credentials' });

  // Mint an ES256 JWT signed with our EC private key. The CC verifies with
  // the public_key returned from /tenant/secrets — which we also intercept
  // to return our matching public key. Result: tokens verify cleanly.
  const token = signJwt({
    sub: row.user_id,
    email: row.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 30,
    merchant_id: MERCHANT_ID,
    org_id: ORG_ID,
    role_id: 'admin',
    profile_id: DEFAULT_PROFILE,
  });

  // Build the AuthorizeResponse shape Hyperswitch expects:
  //   { token, token_type: "Bearer", user_id, email, name, merchant_id, role_id, ... }
  json(res, 200, {
    token,
    token_type: 'Bearer',
    user_id: row.user_id,
    email: row.email,
    name: row.name,
    merchant_id: 'apex_revenue_1786220515',
    role_id: 'admin',
    profile_id: 'public',
    org_id: 'org_JrNaXfqIOsvW5XvcJsPu',
  });
}

async function handleMe(req, res) {
  // Minimal /v1/users/me response for the shim's token.
  return handleUsersDetails(req, res);
}

function handleUsersDetails(req, res) {
  // /v1/users/details and /v1/users/me — Hyperswitch CC uses these to load the
  // current user record. Return the seeded admin user.
  json(res, 200, {
    user_id: USER_ID,
    email: 'alilabsx@gmail.com',
    name: 'Apex Global Admin',
    merchant_id: MERCHANT_ID,
    role_id: 'admin',
    profile_id: DEFAULT_PROFILE,
    org_id: ORG_ID,
    preferred_merchants: [MERCHANT_ID],
    totp_status: 'not_set',
    is_active: true,
  });
}

function handleAuthList(req, res) {
  // /api/user/auth/list?auth_id= — returns the auth methods enabled for the
  // user. The CC uses this to decide whether to ask for a TOTP second factor.
  // The seeded user has totp_status='not_set' so we report password-only.
  json(res, 200, [{
    auth_id: 'auth_' + USER_ID,
    auth_type: 'password',
    auth_name: 'Email Password',
    auth_methods: ['password'],
    is_active: true,
    is_default: true,
  }]);
}

function handleTenantSecrets(req, res) {
  // /tenant/secrets — returns the tenant's public_key (used by CC for JWT verify)
  // and master_key (used for card vault encryption). The real router fetches
  // these from the card-vault service; we serve our own to match our JWT signer.
  json(res, 200, {
    public_key: TENANT_PUBLIC_KEY_B64,
    master_key: '0ffe26311d7964072fe003eaa6a31488af4dc9b4f449d6f980891c571b4b274f',
    schema: 'public',
    redis_key_prefix: 'public',
  });
}

async function handleProfileList(req, res) {
  try {
    const r = await pg.query(
      `SELECT profile_id, merchant_id, profile_name, return_url FROM business_profile WHERE merchant_id = $1 LIMIT 50`,
      [MERCHANT_ID],
    );
    json(res, 200, r.rows.length > 0 ? r.rows : [{ profile_id: DEFAULT_PROFILE, merchant_id: MERCHANT_ID, profile_name: 'default', return_url: null }]);
  } catch (e) {
    json(res, 200, [{ profile_id: DEFAULT_PROFILE, merchant_id: MERCHANT_ID, profile_name: 'default', return_url: null }]);
  }
}

async function handleMerchantList(req, res) {
  try {
    const r = await pg.query(
      `SELECT merchant_id, merchant_name::text AS merchant_name, organization_id FROM merchant_account ORDER BY created_at LIMIT 50`,
    );
    // merchant_name is bytea in this build — decode as UTF-8 (best-effort).
    const rows = r.rows.map(m => ({
      ...m,
      merchant_name: m.merchant_name ? Buffer.from(m.merchant_name).toString('utf8').replace(/[^\x20-\x7e]/g, '').slice(0, 60) || 'Apex Global' : 'Apex Global',
    }));
    json(res, 200, rows);
  } catch (e) {
    json(res, 500, { error: 'db error', detail: e.message });
  }
}

async function handleApiKeys(req, res) {
  const url = req.url || '/';
  const m = url.match(/keyId=([^&]+)/);
  const isList = req.method === 'GET' && !m;
  const isGet  = req.method === 'GET' && !!m;
  const isDel  = req.method === 'DELETE';
  const isPost = req.method === 'POST';

  try {
    if (isList) {
      const r = await pg.query(
        `SELECT key_id, merchant_id, name, description, prefix, created_at::text AS created_at, expires_at::text AS expires_at
         FROM api_keys WHERE merchant_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [MERCHANT_ID],
      );
      return json(res, 200, r.rows);
    }

    if (isGet || isDel) {
      const keyId = decodeURIComponent(m[1]);
      if (isDel) {
        await pg.query(`DELETE FROM api_keys WHERE key_id = $1 AND merchant_id = $2`, [keyId, MERCHANT_ID]);
        return json(res, 200, { ok: true, key_id: keyId });
      }
      const r = await pg.query(
        `SELECT key_id, merchant_id, name, description, prefix, created_at::text AS created_at, expires_at::text AS expires_at
         FROM api_keys WHERE key_id = $1 AND merchant_id = $2`,
        [keyId, MERCHANT_ID],
      );
      return json(res, 200, r.rows[0] || null);
    }

    if (isPost) {
      const body = await readJsonBody(req);
      const name = (body.name || 'kangro-default').toString().slice(0, 64);
      const description = (body.description || 'Created via hsproxy').toString().slice(0, 256);

      // Generate a Hyperswitch-shaped API key: prefix + body + suffix. The
      // prefix is `test_` for test mode. We store the SHA-256 of the secret in
      // hashed_api_key (matches Hyperswitch's column), and surface the secret
      // plaintext exactly once in the response (matches what the real router does).
      const secret = 'test_' + require('node:crypto').randomBytes(36).toString('base64')
        .replace(/[+/=]/g, '').slice(0, 48);
      const keyId  = 'key_' + require('node:crypto').randomBytes(12).toString('hex');
      const prefix = secret.slice(0, 12);
      const hashed = require('node:crypto').createHash('sha256').update(secret).digest('hex');

      await pg.query(
        `INSERT INTO api_keys (key_id, merchant_id, name, description, hashed_api_key, prefix, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, NULL)`,
        [keyId, MERCHANT_ID, name, description, hashed, prefix],
      );

      return json(res, 200, {
        key_id: keyId,
        merchant_id: MERCHANT_ID,
        name,
        description,
        prefix,
        api_key: secret,
        created_at: new Date().toISOString(),
      });
    }

    json(res, 405, { error: 'method not allowed' });
  } catch (e) {
    json(res, 500, { error: 'api_keys error', detail: e.message });
  }
}

function proxyTo(req, res, body) {
  const u = new URL(req.url, UPSTREAM);
  const opts = {
    method: req.method,
    headers: { ...req.headers, host: new URL(UPSTREAM).host },
  };
  const upstream = http.request(u, opts, (ur) => {
    res.writeHead(ur.statusCode || 502, ur.headers);
    ur.pipe(res);
  });
  upstream.on('error', (e) => {
    if (!res.headersSent) json(res, 502, { error: 'upstream error', detail: e.message });
  });
  if (body && body.length) upstream.write(body);
  upstream.end();
}

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': '*',
        'access-control-allow-headers': '*',
      });
      return res.end();
    }
    if (SIGNIN_RE.test(req.url || '/'))     return handleSignin(req, res);
    if (TENANT_RE.test(req.url || '/'))     return handleTenantSecrets(req, res);
    if (ME_RE.test(req.url || '/'))         return handleMe(req, res);
    if (USERS_DETAILS.test(req.url || '/')) return handleUsersDetails(req, res);
    if (AUTH_LIST.test(req.url || '/'))     return handleAuthList(req, res);
    if (PROFILE_LIST.test(req.url || '/'))  return handleProfileList(req, res);
    if (PROFILE_GET.test(req.url || '/'))   return handleProfileList(req, res);
    if (MERCHANT_LIST.test(req.url || '/')) return handleMerchantList(req, res);
    if (APIKEYS_PATH.test(req.url || '/'))  return handleApiKeys(req, res);
    if (SIGNUP_RE.test(req.url || '/')) {
      return json(res, 501, { error: 'signup is not supported by this proxy — log in with an existing account' });
    }
    const raw = await readRawBody(req);
    proxyTo(req, res, raw);
  } catch (e) {
    if (!res.headersSent) json(res, 500, { error: e.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[hsproxy] listening on :${PORT}, upstream ${UPSTREAM}`);
});

process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT',  () => { server.close(() => process.exit(0)); });