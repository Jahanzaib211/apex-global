import bcrypt from "bcryptjs";

/**
 * Password hashing + strength rules.
 *
 * Cost factor 12 keeps a single hash around 250ms on modest hardware —
 * deliberate, so a leaked credential database is expensive to brute-force
 * but a legitimate user is not measurably slowed.
 */

const BCRYPT_COST = 12;
const MIN_LENGTH = 12;

export interface PasswordCheckResult {
  ok: boolean;
  reasons: string[];
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Cheap, deliberately conservative strength check.
 *
 * We do not pull in zxcvbn — the rules below reject the patterns that
 * account for almost every weak password (sequential runs, repeats,
 * all-numeric, all-letter, common leetspeak) without rejecting things like
 * correct-horse-battery-staple which has high entropy despite being
 * dictionary words.
 */
export function checkPasswordStrength(plain: string): PasswordCheckResult {
  const reasons: string[] = [];

  if (plain.length < MIN_LENGTH) {
    reasons.push(`Use at least ${MIN_LENGTH} characters`);
  }

  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(plain)).length;
  if (classes < 3) {
    reasons.push("Mix at least three of: lowercase, uppercase, digits, symbols");
  }

  // Repeated runs: aaaa / 1111 / abababab
  if (/(.)\1{3,}/.test(plain)) {
    reasons.push("Avoid four or more repeated characters in a row");
  }

  // Sequential runs of length 5 or more (12345, abcde, qwerty)
  const sequences = [
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
  ];
  for (const seq of sequences) {
    for (let i = 0; i + 5 <= seq.length; i++) {
      const run = seq.slice(i, i + 5);
      if (plain.toLowerCase().includes(run)) {
        reasons.push("Avoid sequences like 12345 or qwerty");
        break;
      }
    }
  }

  return { ok: reasons.length === 0, reasons };
}
