# Hyperswitch Control Center shim (retired 2026-08-17)

`cc-host.js` and `hsproxy.js` were a stand-in for the Hyperswitch Control
Center and router, written while the real ones were thought to be broken.

**They are no longer used.** The real cause of the login failure was a bcrypt
password hash where the router expects argon2id, plus a malformed `user_roles`
row — both fixed in the database on 2026-08-17. The stock
`juspaydotin/hyperswitch-control-center` image now serves :9090 against the
real router on :8084. See the Hyperswitch section of `../../MASTER-CREDENTIALS.md`.

Kept only for reference. Note that both files contain live credentials for this
stack, so they stay here with the other credential-bearing docs — they must not
be copied into any application repository or shipped anywhere.

They originally lived in the Kangro Flights project's `scripts/` directory,
which is why that project's smoke test for the Control Center login is now at
`../hyperswitch-cc-login-smoke.cjs`.
