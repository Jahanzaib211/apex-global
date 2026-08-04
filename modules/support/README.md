# support

**Status: planned** · depends on: `core`, `crm`

## Purpose

Tickets and response targets. The operational surface for clients who have
already bought — and the first module to build after launch, because it is the
one whose absence is felt daily.

## Data model (proposed)

`Ticket`, `TicketMessage`, `TicketQueue`, `ResponseTarget`, `KnowledgeArticle`,
`CallLog`.

## Permissions

`support:read` · `support:write` · `support:admin`

## Routes (proposed)

`/support/tickets` · `/support/tickets/[id]` · `/support/queues`

## Jobs (proposed)

`ticket.notify`, `ticket.target_breach` (scheduled), `ticket.ai_summarise`.

## Open questions

- Response targets need a business-hours calendar, including local holidays.
  A "4 hour response" that counts overnight is a promise we would break.
- Email ingestion (reply-to-ticket) requires an inbound mail route.
- Do clients see tickets through `client-portal`, or by email only at first?

## Definition of done

A ticket can be raised, queued, assigned, responded to and resolved against a
stated response target, with breaches visible before a client notices.
