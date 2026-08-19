import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Transactional email.
 *
 * Single transport backed by SMTP. In dev (no SMTP_HOST), the transport
 * falls back to a console logger so magic links and password resets can
 * be exercised end-to-end without external credentials.
 *
 * The portal never composes emails itself — it passes `subject` and
 * `text`/`html` and lets this module own the headers, From address, and
 * delivery failures.
 */

interface Mailer {
  send(input: SendInput): Promise<void>;
}

export interface SendInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /** Optional Reply-To. */
  replyTo?: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  user?: string;
  password?: string;
  from: string;
  /** Optional default Reply-To applied to every outbound message. */
  replyTo?: string;
}

function loadSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const from =
    process.env.SMTP_FROM ?? "Apex Global Tech Solution <no-reply@apexgroupcompanies.com>";
  if (!host) return null;
  return {
    host,
    port,
    user: process.env.SMTP_USER || undefined,
    password: process.env.SMTP_PASSWORD || undefined,
    from,
    replyTo: process.env.SMTP_REPLY_TO || undefined,
  };
}

class SmtpMailer implements Mailer {
  constructor(
    private readonly transporter: Transporter,
    private readonly from: string,
    private readonly replyTo?: string,
  ) {}

  async send(input: SendInput): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html ?? input.text,
      replyTo: input.replyTo ?? this.replyTo,
    });
  }
}

class ConsoleMailer implements Mailer {
  async send(input: SendInput): Promise<void> {
    // The dev fallback prints a single line per message so it shows up in
    // pm2 logs and tests can grep it. Production deployments must set
    // SMTP_HOST or no one gets their magic link.
    // eslint-disable-next-line no-console
    console.info(
      `[email] to=${input.to} subject="${input.subject}"\n${input.text.slice(0, 400)}${
        input.text.length > 400 ? "…" : ""
      }`,
    );
  }
}

/**
 * Build a mailer for the given config. The transport is rebuilt per call (email
 * volume is low and this avoids stale cached config when the operator edits SMTP
 * settings). `null` falls back to the console printer. A cached mailer (set by
 * tests) takes precedence so the DB/env resolution can be skipped.
 */
let cached: Mailer | null = null;

function getMailer(cfg: SmtpConfig | null): Mailer {
  if (cached) return cached;
  if (!cfg) return new ConsoleMailer();
  // The self-hosted Mailcow serves a self-signed cert for STARTTLS, which
  // Node's default trust store rejects. Allow relaxed verification for
  // loopback relays only; remote relays still require a valid cert unless
  // SMTP_TLS_INSECURE=1 is set explicitly.
  const loopback = cfg.host === "127.0.0.1" || cfg.host === "localhost" || cfg.host === "::1";
  const insecure = process.env.SMTP_TLS_INSECURE === "1" || loopback;
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: cfg.user ? { user: cfg.user, pass: cfg.password ?? "" } : undefined,
    // Scoped, not blanket: `insecure` is true only for a loopback relay — a
    // connection that never leaves the host, where there is no network path
    // for a man in the middle to sit on — or when an operator sets
    // SMTP_TLS_INSECURE=1 deliberately. Any remote relay still requires a
    // certificate the system trust store accepts.
    // nosemgrep: problem-based-packs.insecure-transport.js-node.bypass-tls-verification.bypass-tls-verification
    tls: insecure ? { rejectUnauthorized: false } : undefined,
  });
  return new SmtpMailer(transporter, cfg.from, cfg.replyTo);
}

export async function sendEmail(input: SendInput): Promise<void> {
  const mailer = getMailer(await resolveSmtpConfig());
  await mailer.send(input);
}

/**
 * Resolve SMTP configuration, preferring a console-managed `core.Integration`
 * (provider "smtp", sealed password) and falling back to env vars. The DB read
 * is wrapped so a missing integration or a DB hiccup degrades to env-only rather
 * than throwing — email must never crash the caller.
 */
async function resolveSmtpConfig(): Promise<SmtpConfig | null> {
  const env = loadSmtpConfig();
  // A loopback relay (127.0.0.1/localhost/::1) is always an explicit
  // override — Mailcow on the test host — so it beats any console-managed
  // integration. Remote env relays do not: the operator controls the real
  // relay from the console, and .env is the fallback, not the source of truth.
  if (env && (env.host === "127.0.0.1" || env.host === "localhost" || env.host === "::1")) {
    return env;
  }
  try {
    const db = await readSmtpConfigFromDb();
    if (db) return db;
  } catch {
    // fall through to env
  }
  return env;
}

async function readSmtpConfigFromDb(): Promise<SmtpConfig | null> {
  const { prisma } = await import("@apex/db");
  const { createDecipheriv } = await import("node:crypto");
  const row = await prisma.integration.findUnique({ where: { provider: "smtp" } });
  if (!row || !row.isEnabled) return null;
  const cfg = (row.config ?? {}) as {
    host?: string;
    port?: number | string;
    user?: string;
    from?: string;
    replyTo?: string;
  };
  if (!cfg.host) return null;
  let password: string | undefined;
  if (row.secretCiphertext && row.secretIv && row.secretTag) {
    try {
      const decipher = createDecipheriv(
        "aes-256-gcm",
        Buffer.from(process.env.ENCRYPTION_KEY!, "hex"),
        Buffer.from(row.secretIv, "base64"),
      );
      decipher.setAuthTag(Buffer.from(row.secretTag, "base64"));
      password = Buffer.concat([
        decipher.update(Buffer.from(row.secretCiphertext, "base64")),
        decipher.final(),
      ]).toString("utf8");
    } catch {
      password = undefined;
    }
  }
  return {
    host: cfg.host,
    port: Number(cfg.port ?? 587),
    user: cfg.user || undefined,
    password,
    from:
      cfg.from ||
      process.env.SMTP_FROM ||
      "Apex Global Tech Solution <no-reply@apexgroupcompanies.com>",
    replyTo: cfg.replyTo || process.env.SMTP_REPLY_TO || undefined,
  };
}

// ── Templated messages ──────────────────────────────────────────────────────
// Plain-text first so the dev console is readable; html mirrors it.

export async function sendMagicLink(input: {
  to: string;
  url: string;
  ttlHours: number;
}): Promise<void> {
  await sendEmail({
    to: input.to,
    subject: "Sign in to your Apex client portal",
    text: [
      `Click the link below to sign in. It is valid for ${input.ttlHours} hour(s) and can be used once.`,
      "",
      input.url,
      "",
      "If you did not request this, you can ignore the email — your account is not affected.",
    ].join("\n"),
  });
}

export async function sendPasswordReset(input: {
  to: string;
  url: string;
  ttlMinutes: number;
}): Promise<void> {
  await sendEmail({
    to: input.to,
    subject: "Reset your Apex client portal password",
    text: [
      `Click the link below to set a new password. It is valid for ${input.ttlMinutes} minute(s) and can be used once.`,
      "",
      input.url,
      "",
      "If you did not request this, you can ignore the email — your password is unchanged.",
    ].join("\n"),
  });
}

export async function sendEmailVerification(input: {
  to: string;
  url: string;
  ttlHours: number;
}): Promise<void> {
  await sendEmail({
    to: input.to,
    subject: "Verify your email for the Apex client portal",
    text: [
      `Click the link below to verify this email address. It is valid for ${input.ttlHours} hour(s) and can be used once.`,
      "",
      input.url,
    ].join("\n"),
  });
}

export async function sendInvitation(input: {
  to: string;
  inviterName: string;
  organisation: string;
  url: string;
  ttlDays: number;
}): Promise<void> {
  await sendEmail({
    to: input.to,
    subject: `${input.inviterName} invited you to the ${input.organisation} portal`,
    text: [
      `${input.inviterName} invited you to the ${input.organisation} portal on Apex.`,
      "",
      "Click the link below to accept and create your account. It is valid for " +
        `${input.ttlDays} day(s) and can be used once.`,
      "",
      input.url,
    ].join("\n"),
  });
}

/**
 * Notify the ops/lead-routing address when a new lead is captured.
 *
 * The recipient is resolved in three steps, most specific first:
 *   1. the console-managed `notify.lead_to` Setting (edited on /integrations),
 *   2. the `LEAD_NOTIFY_TO` env var,
 *   3. the hard-coded sales inbox as a last resort.
 *
 * The brand goes in the subject line. Five Apex sites now feed one inbox, and
 * the first routing decision — which team picks this up — is answerable from
 * the notification list without opening anything.
 */
export async function notifyNewLead(input: {
  name: string;
  email: string;
  companyName?: string | null;
  message?: string | null;
  source?: string | null;
  siteLabel?: string | null;
  phone?: string | null;
  interest?: string | null;
  consoleUrl?: string | null;
}): Promise<void> {
  let to = process.env.LEAD_NOTIFY_TO ?? "sales@apexgroupcompanies.com";
  if (!process.env.LEAD_NOTIFY_TO) {
    try {
      const { prisma } = await import("@apex/db");
      const setting = await prisma.setting.findUnique({ where: { key: "notify.lead_to" } });
      if (setting && typeof setting.value === "string" && setting.value.trim()) {
        to = setting.value.trim();
      }
    } catch {
      // DB unavailable — the env/fallback value already set above stands.
    }
  }
  const who = input.companyName ? `${input.name} (${input.companyName})` : input.name;
  const brand = input.siteLabel ? `[${input.siteLabel}] ` : "";
  await sendEmail({
    to,
    subject: `${brand}New lead: ${who}`,
    text: [
      `A new lead came in${input.siteLabel ? ` on ${input.siteLabel}` : ""}${
        input.source ? ` via ${input.source}` : ""
      }.`,
      "",
      `Name:  ${input.name}`,
      `Email: ${input.email}`,
      input.phone ? `Phone: ${input.phone}` : null,
      input.companyName ? `Company: ${input.companyName}` : null,
      input.interest ? `Interest: ${input.interest}` : null,
      input.message ? `Message:\n${input.message}` : null,
      input.consoleUrl ? `\nOpen in the console: ${input.consoleUrl}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

/** Test-only helper to swap the mailer (used by the auth test suite). */
export function __setMailerForTests(m: Mailer | null): void {
  cached = m;
}
