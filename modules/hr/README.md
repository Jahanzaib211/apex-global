# hr

**Status: planned** · depends on: `core`

## Purpose

Staff records, attendance, leave and payroll export. Scoped deliberately: this
is a record-keeping module, not a payroll engine.

## Data model (proposed)

`Employee`, `Shift`, `AttendanceRecord`, `LeaveRequest`, `LeaveBalance`,
`PayrollPeriod`.

## Permissions

`hr:read` · `hr:write` · `hr:admin`

## Routes (proposed)

`/people` · `/people/[id]` · `/people/attendance` · `/people/leave`

## Jobs (proposed)

`attendance.daily_close` (scheduled), `leave.accrue` (scheduled),
`payroll.export` (on demand).

## Open questions

- Attendance capture method is undecided — biometric, app check-in, or manual.
  It determines whether the data is trustworthy enough to pay against.
- Employee records are personal data with the strictest retention obligations
  of anything in this system. Access must be narrower than `core:admin`.
- Payroll calculation stays **out of scope**: we export, the accountant runs it.

## Definition of done

Attendance and leave are recorded accurately enough to produce a payroll export
the accountant accepts without a follow-up conversation.
