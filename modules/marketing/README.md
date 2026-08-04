# marketing

**Status: planned** · depends on: `core`, `crm`, `cms`

## Purpose

Close the loop between spend and outcome. `crm` already captures where a lead
came from; this module makes that answerable as a number per campaign.

## Data model (proposed)

`Campaign`, `AdSpendSync`, `ContentCalendarEntry`, `SocialPost`,
`AttributionReport`.

Reuses `crm.CampaignSpend` rather than duplicating it.

## Permissions

`marketing:read` · `marketing:write`

## Routes (proposed)

`/marketing/campaigns` · `/marketing/calendar` · `/marketing/attribution`

## Jobs (proposed)

`adspend.sync` (scheduled, per platform), `attribution.rebuild` (scheduled).

## Open questions

- First-touch or last-touch attribution? First-touch is already captured;
  multi-touch would need a visit-level event store, which is a bigger build.
- Ad platform APIs need OAuth and token refresh — that is vault work.
- Offline conversions (a lead that closes months later) need a way to push
  revenue back to the ad platform.

## Definition of done

"We spent X on this campaign, it produced Y enquiries, Z became customers,
worth W" is a page, not a spreadsheet exercise.
