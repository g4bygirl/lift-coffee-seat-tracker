## Goal

Make the Raw Data Feed and Verification features easy to discover from the main Employee Dashboard by adding two prominent feature cards, while keeping the existing `/employee/raw-data` and `/employee/verify` routes intact.

## Changes

### 1. Employee Dashboard (`src/routes/employee.tsx`)
Add a new "Data Operations" section above (or beside) the seat map with two large cards:

- **Raw Data Feed card**
  - Icon: `Database` (lucide)
  - Title + short description ("Timestamped log of every staff-updated headcount")
  - Live stat: total entries logged today + most recent hour/count pulled from `state.logs`
  - Primary button → `Link to="/employee/raw-data"` ("View feed")

- **Verify & Cleanse card**
  - Icon: `ShieldCheck` (lucide)
  - Title + short description ("Two-step confirmation before an entry hits the data feed")
  - Small inline "3-step" indicator (Enter → Confirm → Submitted)
  - Primary button → `Link to="/employee/verify"` ("Start verification")

Cards use existing tokens (`bg-card`, `border-border`, espresso/cream accents) to stay on-theme, arranged in a responsive `grid gap-4 md:grid-cols-2` block placed directly under the page header.

### 2. Quiet fix: hydration mismatch
`seedLogs()` in `src/lib/cafe-store.tsx` uses `Math.random()` at reducer init, producing different `customers` values on server vs client. Replace with a deterministic offset (e.g. `(i % 3)`) so SSR and client render identical text.

## Out of scope
- No changes to Raw Data or Verify page internals
- No new business logic, no data model changes
- Navbar links remain unchanged