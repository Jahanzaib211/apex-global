#!/usr/bin/env node
/**
 * Prove outbound mail actually leaves the building.
 *
 * The platform's own sending path is nodemailer over SMTP_* (see
 * `packages/auth/src/email.ts`), so this drives the same settings rather than a
 * separate client — a check that passes here is a check the invitation flow
 * will pass too.
 *
 * Why this exists: this host is on a residential connection, so mail handed to
 * the local mailcow is accepted, queued, and then never delivered to Gmail or
 * any other large provider. Nothing bounces; messages simply age in the queue.
 * That failure is invisible from the application's point of view, which is
 * exactly why it needs an explicit check.
 *
 * Usage:
 *   node scripts/check-mail.mjs someone@example.com
 */
import nodemailer from "nodemailer";

const to = process.argv[2];
if (!to) {
  console.error("usage: node scripts/check-mail.mjs <recipient>");
  process.exit(1);
}

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER || undefined;
const pass = process.env.SMTP_PASSWORD || undefined;
const from = process.env.SMTP_FROM ?? "Apex Global Tech Solution <no-reply@example.com>";

if (!host) {
  console.error("SMTP_HOST is not set — nothing to test.");
  process.exit(1);
}

const loopback = host === "127.0.0.1" || host === "localhost" || host === "::1";
if (loopback) {
  console.warn(
    "WARNING: SMTP_HOST is loopback. Mail will be accepted by the local relay and\n" +
      "         may still never reach an external provider from this IP. A pass here\n" +
      "         proves the handoff, not delivery.\n",
  );
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: user ? { user, pass: pass ?? "" } : undefined,
  tls: loopback ? { rejectUnauthorized: false } : undefined,
});

console.log(`relay:  ${host}:${port}`);
console.log(`from:   ${from}`);
console.log(`to:     ${to}`);

try {
  await transporter.verify();
  console.log("handshake + auth: OK");
} catch (err) {
  console.error("handshake + auth FAILED:", err.message);
  process.exit(1);
}

try {
  const info = await transporter.sendMail({
    from,
    to,
    subject: "Apex Global — mail delivery check",
    text: [
      "This is a delivery check from the Apex Global platform.",
      "",
      `Relay: ${host}:${port}`,
      `Sent:  ${new Date().toISOString()}`,
      "",
      "If you are reading this in an inbox rather than a queue, outbound mail works.",
    ].join("\n"),
  });
  console.log("accepted by relay:", info.accepted.join(", ") || "(none)");
  if (info.rejected?.length) console.log("rejected:", info.rejected.join(", "));
  console.log("message id:", info.messageId);
  console.log("\nAccepted is not delivered. Confirm it lands in the inbox before");
  console.log("trusting it for customer invitations.");
} catch (err) {
  console.error("send FAILED:", err.message);
  process.exit(1);
}
