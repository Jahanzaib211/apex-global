# core

**Status: active** · depends on: nothing (everything depends on this)

## Purpose

Identity and access. Who can sign in, what they are allowed to do, what they
did, and where third-party credentials live. Every other module assumes this
one is present and correct.

## Data model

| Entity | Notes |
|---|---|
| `User` | Console operator. Password stored as a bcrypt hash; TOTP secret encrypted at rest. Lockout after 5 failed attempts for 15 minutes. |
| `Role` / `Permission` / `UserRole` / `RolePermission` | RBAC. The permission catalogue is **data**, reconciled from the module registry on boot, so a new module never needs a migration to become authorisable. |
| `Session` | Signed session records. |
| `AuditLog` | Append-only. Nothing updates or deletes rows. |
| `Setting` | Key/value org configuration rendered by the public site (contact details, SEO defaults, leadership). |
| `Integration` | Third-party credentials, AES-256-GCM sealed. Plaintext never returned to a client. |
| `FeatureFlag`, `MediaAsset` | Rollout control and the media library. |

## Permissions

| Key | Who should hold it |
|---|---|
| `core:read` | Everyone with console access |
| `core:admin` | Administrators only — user management and the credentials vault |

## Routes

`/` overview · `/settings` · `/audit`

## Jobs

None yet. Session cleanup and audit-log archival belong here when retention
becomes a concern.

## Design decisions

- **Permissions are read from the database on every request**, not baked into
  the session token. Revoking a role takes effect immediately rather than
  whenever the token happens to expire.
- **Authorisation lives in the mutation.** Middleware verifies the session
  signature only; it cannot reach the database, and a permission check that
  runs in two places drifts. Every server action calls `requirePermission`.
- **Login is deliberately uninformative.** A wrong password and an unknown
  address return the same message, and the unknown-address path still runs a
  bcrypt comparison so response timing does not become an enumeration oracle.

## Open questions

- TOTP enrolment UI is not built; the schema supports it.
- No password reset flow — an administrator re-issues via the seed script.
