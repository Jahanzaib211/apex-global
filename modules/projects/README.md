# projects

**Status: planned** · depends on: `core`, `crm`

## Purpose

Delivery for the software-development service line: what we committed to, who
is doing it, how long it took, and whether the client has signed it off.

## Data model (proposed)

`Project`, `Milestone`, `Task`, `TimeEntry`, `Approval`, `ProjectDocument`.

## Permissions

`projects:read` · `projects:write` · `projects:admin`

## Routes (proposed)

`/projects` · `/projects/[id]` · `/projects/timesheets`

## Jobs (proposed)

`timesheet.remind` (scheduled), `project.status_digest` (scheduled).

## Open questions

- Time entry must be near-frictionless or it will not happen. Timer, or
  end-of-day bulk entry, or both?
- Fixed-price versus time-and-materials changes what a timesheet means —
  margin tracking on one, billing input on the other.
- Approvals overlap with `client-portal`; build the data model here and the
  surface there.

## Definition of done

A project can be planned, worked, timed and signed off, and the margin on it
can be read without a spreadsheet.
