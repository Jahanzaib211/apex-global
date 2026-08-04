# client-portal

**Status: planned** · depends on: `core`, `billing`, `support`, `projects`

## Purpose

A place clients sign in to see their own tickets, invoices, documents and
project status. Clients who can self-serve stay longer and call less.

Deliberately last: it is a **surface over three other modules**, and building
it before they exist would mean building it twice.

## Data model (proposed)

`PortalAccount`, `PortalUser`, `PortalInvitation`, `ClientDocument`.

Portal users are a **separate identity space** from console users. Sharing the
`User` table would put customer credentials one bad query away from operator
permissions.

## Permissions

`portal:read` · `portal:admin` (console-side management)

Portal users get scoped access to their own account's data, enforced at the
query layer — never by hiding a link.

## Routes (proposed)

`apps/portal`: `/`, `/tickets`, `/invoices`, `/documents`, `/projects`

## Jobs (proposed)

`portal.invite`, `portal.digest` (scheduled).

## Open questions

- One portal account per company, with several users? Almost certainly, but
  it changes the invitation and permission model significantly.
- Document sharing needs virus scanning on upload if clients can upload.
- Should the portal be a separate app or a route group? Separate app, so it
  can be deployed and scaled independently of the console.

## Definition of done

A client signs in, sees only their own data, and can answer "what do I owe and
what is the status of my project" without emailing anyone.
