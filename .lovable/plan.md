## Goal
Restructure the app to match the pasted HTML mockup: a two-portal layout (Customer Portal / Employee Dashboard) where each portal is a single scrollable page with the sections shown in the mockup, replacing today's multi-route navigation. Existing warm cafe theme, tokens, and cafe-store state stay.

## New layout

### Header (replaces current Navbar)
- Left: coffee logo + "Lift Coffee Roasters" / "Seating Management System"
- Right: two pill tabs — **Customer Portal** and **Employee Dashboard** (drives `view` in `cafe-store`)
- Keep open/closed status pill + simulated hour

### Closed banner
- Full-width card shown above everything when `!isOpen` ("The Café is Currently Closed — 7 AM to 5 PM"). Replaces per-page `ClosedOverlay` usage.

### Customer Portal (`/` when view = student)
Single page containing:
1. **Stat row** (3 cards): Live Availability `X / 20`, Occupancy Rate `%`, Customer Sentiment `75% Positive`
2. **Filter Seating by Workspace Needs** — 3 chips: Reliable Wi-Fi / Nearby Outlets / Large Table Size (reuses `SeatMap` highlight logic)
3. **Interactive Cafe Layout Map** card with "Live Feed" badge + `SeatMap`
4. **Predictive Demand Modeling** card: hour dropdown + probability readout + simple bar/line (reuses forecast logic from `src/routes/forecast.tsx`)
5. **Sentiment strip** (compact version of `src/routes/sentiment.tsx`)

### Employee Dashboard (`/` when view = employee)
Single page containing:
1. Same 3-stat row
2. **Floor Operations Matrix** — table listing every seat: Seat ID, Attributes (feature tags), Status, Actions (status override buttons) — replaces the click-a-seat dialog on `SeatMap`
3. **Hourly Headcount Registry** card:
   - Number input + "Log Hourly Metric" button
   - Inline **Pending Entry Data Verification** panel that appears after entry: "Are you ready to commit N occupants…" with Confirm / Re-enter (absorbs `/employee/verify` flow)
4. **Adjust Floor Infrastructure Scale** card — slider 1–40 to change max seat count (new action in store: `SET_CAPACITY`)
5. **Predictive Demand Modeling** (same component as customer view)
6. **Raw Systems Ledger & Logging Feed** — the raw data table inline (absorbs `/employee/raw-data`)

## Route changes
- `src/routes/index.tsx` becomes a shell that renders `<CustomerPortal />` or `<EmployeeDashboard />` based on `view`
- Delete routes: `real-time`, `find-seating`, `forecast`, `sentiment`, `employee`, `employee.raw-data`, `employee.verify` (their content moves into the two portal components)
- Update `__root.tsx` head metadata to reflect single-page structure
- Remove obsolete Navbar nav links (only portal toggle remains)

## New / edited files
- `src/routes/index.tsx` — portal switcher
- `src/components/CustomerPortal.tsx` — new, composes sections 1–5 above
- `src/components/EmployeeDashboard.tsx` — new, composes sections 1–6 above
- `src/components/StatRow.tsx` — new, 3 stat cards
- `src/components/FloorOpsMatrix.tsx` — new seat table with inline overrides
- `src/components/HeadcountRegistry.tsx` — new, log + inline verify
- `src/components/CapacitySlider.tsx` — new
- `src/components/ForecastPanel.tsx` — new, extracted from current forecast route
- `src/components/SentimentStrip.tsx` — new, compact sentiment
- `src/components/RawDataLedger.tsx` — new, extracted table
- `src/components/Navbar.tsx` — simplified to logo + portal tabs + status pill
- `src/lib/cafe-store.tsx` — add `SET_CAPACITY` action and `capacity` field; add a "pending log" concept if needed (or keep verification local component state)
- Delete: `src/routes/real-time.tsx`, `find-seating.tsx`, `forecast.tsx`, `sentiment.tsx`, `employee.tsx`, `employee.raw-data.tsx`, `employee.verify.tsx`, `src/components/ClosedOverlay.tsx` (replaced by inline banner)

## Out of scope
- No backend / Lovable Cloud
- No new theme tokens or font changes — reuse existing cream/espresso/latte/copper palette
- No auth
- Keep mock data seeding as-is (aside from the earlier hydration-safe fix)

## Confirmation
This is a fairly large refactor that removes the current multi-route structure. Confirm and I'll implement; if you'd rather keep the existing routes and only re-skin `/` to look like the mockup, say so and I'll cut scope.
