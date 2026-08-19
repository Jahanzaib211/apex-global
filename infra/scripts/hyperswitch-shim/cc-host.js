#!/usr/bin/env node
// cc-host: drop-in replacement for Hyperswitch Control Center's serve-handler.
// Serves the CC's static bundle + handles every API path the CC frontend calls
// directly against Postgres. Bypasses the broken nightly-standalone router
// build (which doesn't ship user / merchant / api_key endpoints).
//
// Port: 9090 (same as the upstream CC image).
// Mount: /usr/src/app/dist/hyperswitch (the CC's compiled bundle) read-only.
// DB:   hyperswitch-postgres on the apex-hyperswitch_default network.

const http    = require('node:http');
const fs      = require('node:fs');
const path    = require('node:path');
const crypto  = require('node:crypto');
const { Pool } = require('pg');
const bcrypt  = require('bcrypt');

const PORT        = parseInt(process.env.PORT || '9090', 10);
const CC_DIST     = process.env.CC_DIST     || '/usr/src/app/dist/hyperswitch';
const DATA_DIR    = process.env.DATA_DIR    || '/data';
const PG_HOST     = process.env.PGHOST     || 'hyperswitch-postgres';
const PG_USER     = process.env.PGUSER     || 'hyperswitch';
const PG_PASS     = process.env.PGPASSWORD || 'change_me_hs_pg';
const PG_DB       = process.env.PGDATABASE || 'hyperswitch';

const pg = new Pool({ host: PG_HOST, port: 5432, user: PG_USER, password: PG_PASS, database: PG_DB, max: 8 });

function loadOrCreateKey() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const privPath = path.join(DATA_DIR, 'ec-priv.pem');
  const pubPath  = path.join(DATA_DIR, 'ec-pub.pem');
  if (fs.existsSync(privPath) && fs.existsSync(pubPath)) {
    return {
      privateKey: crypto.createPrivateKey(fs.readFileSync(privPath)),
      publicKeyPem: fs.readFileSync(pubPath, 'utf8'),
    };
  }
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' });
  fs.writeFileSync(privPath, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
  fs.writeFileSync(pubPath,  publicKey.export({ type: 'spki',  format: 'pem' }), { mode: 0o644 });
  return { privateKey, publicKeyPem: pubKey };
}
const { privateKey, publicKeyPem } = loadOrCreateKey();
const TENANT_PUBLIC_KEY_B64 = Buffer.from(publicKeyPem).toString('base64');

function signJwt(payload) {
  const h = Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'JWT' })).toString('base64url');
  const p = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const s = crypto.sign('SHA256', Buffer.from(`${h}.${p}`), privateKey).toString('base64url');
  return `${h}.${p}.${s}`;
}

const USER_ID     = 'usr_06e2d1d391fc55cf50a8c93f3b01757a';
const MERCHANT_ID = 'apex_revenue_1786220515';
const ORG_ID      = 'org_JrNaXfqIOsvW5XvcJsPu';
const PROFILE_ID  = 'public';
const USER_EMAIL  = 'alilabsx@gmail.com';
const USER_NAME   = 'Apex Global Admin';

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', ...headers });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8');
      try { resolve(text ? JSON.parse(text) : {}); }
      catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.wasm': 'application/wasm',
  '.map':  'application/json',
  '.txt':  'text/plain; charset=utf-8',
};

function serveStatic(req, res, pathname) {
  let rel = pathname === '/' ? '/index.html' : pathname;
  rel = rel.split('?')[0].split('#')[0];
  const full = path.join(CC_DIST, rel);
  if (!full.startsWith(CC_DIST)) return false;

  fs.stat(full, (err, st) => {
    if (err || !st.isFile()) {
      // SPA fallback for unknown paths.
      fs.readFile(path.join(CC_DIST, 'index.html'), (err2, buf) => {
        if (err2) return send(res, 404, 'Not Found');
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        res.end(buf);
      });
      return;
    }
    const ext = path.extname(full).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': 'public, max-age=300',
    });
    fs.createReadStream(full).pipe(res);
  });
  return true;
}

async function handleSignin(req, res) {
  const body = await readJsonBody(req);
  const email = (body.email || '').toString().toLowerCase().trim();
  const password = (body.password || '').toString();
  if (!email || !password) return send(res, 400, { error: 'email and password required' });

  let row;
  try {
    const r = await pg.query(
      `SELECT user_id, email, name, password FROM users WHERE LOWER(email) = $1 AND is_active = true`,
      [email],
    );
    row = r.rows[0];
  } catch (e) { return send(res, 500, { error: e.message }); }

  if (!row) return send(res, 401, { error: 'invalid_credentials' });
  if (!row.password || !row.password.startsWith('$2')) return send(res, 401, { error: 'unsupported hash' });

  let ok = false;
  try { ok = await bcrypt.compare(password, row.password); }
  catch { ok = false; }
  if (!ok) return send(res, 401, { error: 'invalid_credentials' });

  const token = signJwt({
    sub: row.user_id,
    email: row.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 30,
    merchant_id: MERCHANT_ID,
    org_id: ORG_ID,
    role_id: 'admin',
    profile_id: PROFILE_ID,
    entity_type: 'MERCHANT',
  });
  send(res, 200, {
    token, token_type: 'Bearer',
    user_id: row.user_id, email: row.email, name: row.name,
    merchant_id: MERCHANT_ID, role_id: 'admin', profile_id: PROFILE_ID,
    org_id: ORG_ID, is_two_factor_auth_setup: false, version: 'v2',
  });
}

function handleAuthList(req, res) {
  send(res, 200, [{
    auth_id: 'auth_' + USER_ID,
    auth_type: 'password',
    auth_name: 'Email Password',
    auth_methods: ['password'],
    is_active: true,
    is_default: true,
  }]);
}

function handleUsersDetails(req, res) {
  send(res, 200, {
    user_id: USER_ID, email: USER_EMAIL, name: USER_NAME,
    merchant_id: MERCHANT_ID, role_id: 'admin', profile_id: PROFILE_ID,
    org_id: ORG_ID,
    preferred_merchants: [MERCHANT_ID],
    totp_status: 'not_set', is_active: true,
    recovery_codes_left: 0,
    is_two_factor_auth_setup: false,
    theme_id: 'default', version: 'v2',
    entity_type: 'MERCHANT', verification_days_left: 365,
  });
}

function handleTenantSecrets(req, res) {
  send(res, 200, {
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
    if (r.rows.length === 0) return send(res, 200, [{ profile_id: PROFILE_ID, merchant_id: MERCHANT_ID, profile_name: 'default', return_url: null }]);
    return send(res, 200, r.rows);
  } catch { return send(res, 200, [{ profile_id: PROFILE_ID, merchant_id: MERCHANT_ID, profile_name: 'default', return_url: null }]); }
}

async function handleMerchantList(req, res) {
  try {
    const r = await pg.query(
      `SELECT merchant_id, encode(merchant_name, 'escape') AS merchant_name, organization_id FROM merchant_account ORDER BY created_at LIMIT 50`,
    );
    const rows = r.rows.map(m => ({
      merchant_id: m.merchant_id,
      merchant_name: (m.merchant_name || '').replace(/[^\x20-\x7e]/g, '').slice(0, 60) || 'Apex Global',
      organization_id: m.organization_id,
    }));
    return send(res, 200, rows);
  } catch (e) { return send(res, 500, { error: e.message }); }
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
        `SELECT key_id, merchant_id, name, description, prefix,
                to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at,
                to_char(expires_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS expires_at
         FROM api_keys WHERE merchant_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [MERCHANT_ID],
      );
      return send(res, 200, r.rows);
    }
    if (isGet || isDel) {
      const keyId = decodeURIComponent(m[1]);
      if (isDel) {
        await pg.query(`DELETE FROM api_keys WHERE key_id = $1 AND merchant_id = $2`, [keyId, MERCHANT_ID]);
        return send(res, 200, { ok: true, key_id: keyId });
      }
      const r = await pg.query(
        `SELECT key_id, merchant_id, name, description, prefix,
                to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at,
                to_char(expires_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS expires_at
         FROM api_keys WHERE key_id = $1 AND merchant_id = $2`,
        [keyId, MERCHANT_ID],
      );
      return send(res, 200, r.rows[0] || null);
    }
    if (isPost) {
      const body = await readJsonBody(req);
      const name = (body.name || 'kangro-default').toString().slice(0, 64);
      const description = (body.description || 'Created via cc-host').toString().slice(0, 256);
      const secret = 'test_' + crypto.randomBytes(36).toString('base64').replace(/[+/=]/g, '').slice(0, 48);
      const keyId  = 'key_' + crypto.randomBytes(12).toString('hex');
      const prefix = secret.slice(0, 12);
      const hashed = crypto.createHash('sha256').update(secret).digest('hex');
      await pg.query(
        `INSERT INTO api_keys (key_id, merchant_id, name, description, hashed_api_key, prefix, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, NULL)`,
        [keyId, MERCHANT_ID, name, description, hashed, prefix],
      );
      return send(res, 200, {
        key_id: keyId, merchant_id: MERCHANT_ID, name, description, prefix,
        api_key: secret, created_at: new Date().toISOString(),
      });
    }
    return send(res, 405, { error: 'method not allowed' });
  } catch (e) { return send(res, 500, { error: e.message }); }
}

function handleDashboardConfigFeature(req, res) {
  send(res, 200, {
    endpoints: {
      api_url: '', sdk_url: 'http://localhost:9050/HyperLoader.js',
      apple_pay_certificate_url: '', dss_certificate_url: '',
      logo_url: '', favicon_url: '', recon_iframe_url: '',
      hypersense_url: '', mixpanel_token: '', agreement_url: '',
      agreement_version: '', clarity_base_url: '',
      dynamo_simulation_template_url: '',
    },
    features: {
      branding: false, mixpanel: false, test_live_toggle: false,
      is_live_mode: false, feedback: false, x_feature_route: false,
      compliance_certificate: false, force_cookies: false,
      audit_trail: true, granularity: false, maintenance_alert: '',
      down_time: false, email: false, totp: true, quick_start: false,
      essentials_enabled: true, is_merchant_enabled: true,
      new_flow_enabled: true, frm_enabled: true, is_payment_link_enabled: true,
      order_metric_enabled: true, is_recon_enabled: true,
      is_routing_algorithm_enabled: true, is_v2_features_enabled: true,
      is_connector_health_enabled: true, is_system_alert_enabled: true,
      is_payment_methods_enabled: true, is_cost_observability_enabled: true,
      dynamic_routing_enabled: true, is_intelligent_routing_enabled: true,
    },
  });
}

function handleDashboardConfigTheme(req, res) {
  send(res, 200, {
    primary_color: '#006DF9', secondary_color: '#FFAB1D',
    background_color: '#FFFFFF', text_color: '#1A2014',
    logo_url: '/assets/Dark/hyperswitchLogoIconWithText.svg',
    favicon_url: '/HyperswitchFavicon.png',
  });
}

const URL_RE = {
  signin:        /(?:^\/v[12]\/(?:users?|user)\/(?:signin|login)(?:\?|$))|(?:^[^?]*\/v[12]\/(?:signin|login)(?:\?|$))|(?:^[^?]*?\/user\/v[12]\/(?:signin|login)(?:\?|$))/,
  me:            /(?:^[^?]*\/v[12]\/users?\/me(?:\?|$))|(?:^[^?]*?\/user\/v[12]\/me(?:\?|$))/,
  signup:        /(?:^[^?]*\/v[12]\/users?\/sign[_-]?up(?:\?|$))|(?:^[^?]*?\/user\/v[12]\/sign[_-]?up(?:\?|$))/,
  details:       /(?:^[^?]*\/v[12]\/users?\/details(?:\?|$))|(?:^[^?]*?\/user\/v[12]\/details(?:\?|$))/,
  authlist:      /\/user\/auth\/list(?:\?|$)/,
  profiles:      /\/v[12]\/(?:business_profile|profile)\/list(?:\?|$)/,
  merchant:      /\/v[12]\/merchant\/account(?:\?|$)/,
  apikeys:       /\/v2\/orchestration\/developer-api-keys(?:\?|$)/,
  tenant:        /\/tenant\/(?:secrets|fetch|info)/,
  configFeature: /\/dashboard\/config\/feature(?:\?|$)/,
  configTheme:   /\/dashboard\/config\/theme(?:\?|$)/,
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'content-type,authorization,x-tenant-id,x-admin-api-key',
      });
      return res.end();
    }
    const pathname = req.url || '/';
    if (URL_RE.signin.test(pathname))         return handleSignin(req, res);
    if (URL_RE.tenant.test(pathname))         return handleTenantSecrets(req, res);
    if (URL_RE.me.test(pathname))             return handleUsersDetails(req, res);
    if (URL_RE.signup.test(pathname))         return send(res, 501, { error: 'signup not supported by cc-host' });
    if (URL_RE.details.test(pathname))        return handleUsersDetails(req, res);
    if (URL_RE.authlist.test(pathname))       return handleAuthList(req, res);
    if (URL_RE.profiles.test(pathname))       return handleProfileList(req, res);
    if (URL_RE.merchant.test(pathname))       return handleMerchantList(req, res);
    if (URL_RE.apikeys.test(pathname))        return handleApiKeys(req, res);
    if (URL_RE.configFeature.test(pathname))   return handleDashboardConfigFeature(req, res);
    if (URL_RE.configTheme.test(pathname))     return handleDashboardConfigTheme(req, res);
    if (serveStatic(req, res, pathname))      return;
    send(res, 404, 'Not Found');
  } catch (e) {
    console.error('handler error:', e);
    if (!res.headersSent) send(res, 500, { error: e.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`cc-host listening on :${PORT}`);
  console.log(`  serving static files from ${CC_DIST}`);
  console.log(`  postgres: ${PG_USER}@${PG_HOST}/${PG_DB}`);
  console.log(`  ec public key: ${TENANT_PUBLIC_KEY_B64.slice(0, 60)}...`);
});

process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT',  () => { server.close(() => process.exit(0)); });