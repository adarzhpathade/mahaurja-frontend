# Memory — Gate & Weighbridge Operational Workbenches, Navigation Streamlining & UI Standards

Last updated: 04 Oct 2026, 10:35 IST

## What was built

1. **Streamlined Navigation & Page Architecture (`Mahaurja Operational Flow.pdf` Section 38 Alignment):**
   - Audited the entire navigation architecture against the 38 sections of `Mahaurja Operational Flow.pdf`.
   - Deleted 4 redundant, disconnected pages that violated the physical-to-digital plant operational rule:
     - `src/app/gate/verification/`: Deleted. Document verification is physically performed during Gate Entry (checking PO/Challan) and Vehicle Exit (checking Weighbridge Slip/Invoice per Sec 31), not at an artificial separate desk.
     - `src/app/weighbridge/gross/`: Deleted. Duplicated the live dual-deck scale indicator.
     - `src/app/weighbridge/tare/`: Deleted. Duplicated the live dual-deck scale indicator.
     - `src/app/weighbridge/slips/`: Deleted. Slips are generated upon weighment and reprinted directly from the Weight Records ledger.
   - Fixed navigation layout binding bug: Replaced fragile numeric array index access (`USER_ROLES[1]`, `USER_ROLES[2]`) with strongly typed named exports (`ROLE_GATE_SECURITY`, `ROLE_WEIGHBRIDGE`, etc.) so `/gate` and `/weighbridge` always render their respective operator profiles and operational tabs.
   - Aligned all 8 roles in `industrial-nav.tsx` and `sidebar.tsx` with true plant operations (eliminated generic mock terms like "Transportations", "Load Planning", and "Shipping").

2. **Weighbridge Live Scale Cockpit Alignment (`scale-indicator.tsx` & `weighbridge-home.tsx`):**
   - Solved the layout misalignment where Column 1 (Telemetry text), Column 2 (nested bordered Truck box), and Column 3 (Capture button) floated at mismatched vertical coordinates.
   - Built a balanced 3-zone industrial cockpit divided by 1px hairline separators (`grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200`):
     - **Zone 1 (4 cols — Telemetry):** Top header `LIVE SCALE TELEMETRY` + deck chip; middle tabular weight `38.64 MT` (vertically centered); bottom deck identifier.
     - **Zone 2 (5 cols — Active Truck on Deck):** Top header `TRUCK ON DECK` + `Clear Deck` button (aligned to Zone 1 Y-coordinate); middle license plate `MH 12 RN 4821` + gate pass chip + material & supplier info; bottom deck capacity & status.
     - **Zone 3 (3 cols — Official Weighment):** Top header `OFFICIAL WEIGHMENT` + status chip (`READY` / `MOTION`) (aligned to Zones 1 & 2 Y-coordinate); middle full-width `Capture Official Weight ->` button (`h-12 sm:h-13`); bottom digital load cell stabilization telemetry.
   - Centralized this layout in `ScaleIndicator` and reused it across `weighbridge-home.tsx` to eliminate code duplication.

3. **Gate UI Reference Harmonization across Weighbridge & Gate:**
   - **Standard 5 (Mandatory Desktop Dual View):** Every operational queue features an `h-10` desktop segmented switcher (`[ Cards ] [ Table ]`) with pitch charcoal active pill (`bg-[#18181B] text-white`). Mobile viewports (≤ 640px) strictly default to responsive cards (`grid-cols-1`). Added to `gate-exit.tsx`.
   - **Standard 6 (Strict Ban on Table White Backgrounds):** Tables use transparent containers (`bg-transparent border border-neutral-300`), mist headers (`bg-neutral-200/50 text-neutral-600 font-bold uppercase text-[10px]`), and hairline row dividers (`divide-neutral-300`).
   - **Standard 7 (Translucent Queue Cards & Direction Indicators):** Queue cards use translucent mist surfaces (`bg-white/40 border border-neutral-300 hover:border-neutral-900`). Inbound RM is marked with Bio-Emerald badges (`border-emerald-300 bg-emerald-50 text-[#047857]`), and Outbound FG with Pitch Charcoal badges (`border-neutral-300 bg-[#18181B] text-white`).

4. **Standards Codified in Project Documentation:**
   - Updated `AGENTS.md` with Standards 5, 6, and 7.
   - Registered patterns in `ui-registry.md` with complete implementation code snippets.

## Decisions made

1. **Strict Adherence to PDF Section 38:** "What happened physically, and what corresponding digital transaction should happen?" Never invent standalone software desks that have no physical counterpart in the plant.
2. **Single Physical Desk = Single Primary Screen:** The weighbridge operator sits at one scale terminal. Gross weighment, tare weighment, net weight calculation, and slip generation all happen at this terminal or are reviewed in the historical record ledger.
3. **Type-Safe Layout Role Binding:** Never use array indexes like `USER_ROLES[1]` in layouts. Always use direct named exports (`ROLE_GATE_SECURITY`, `ROLE_WEIGHBRIDGE`) or `getRoleById(roleId)` to prevent route-role mismatches.
4. **Desktop Zero-Scroll & Minimal Cards:** Keep operational forms under 650px total height with zero vertical scrolling on 1080p desktop displays.

## Problems solved

- **Gate layout showing Weighbridge tabs:** Fixed `USER_ROLES[1]` index shift by creating direct named role exports and binding `ROLE_GATE_SECURITY` in `gate/layout.tsx` and `ROLE_WEIGHBRIDGE` in `weighbridge/layout.tsx`.
- **Cockpit misalignment:** Eliminated the nested card in Column 2 and floating button in Column 3 by creating an aligned 3-zone grid with matching top headers, centered middle content, and matching bottom baselines.
- **Next.js stale validator build cache:** Deleted stale `.next` type declarations following the deletion of `gross/`, `tare/`, `slips/`, and `verification/` routes.
- **Jargon in navigation:** Replaced generic logistics template terms ("Transportations", "Load Planning", "Shipping") with authentic PDF operational stages ("Sales Orders", "Dispatch Planning", "Invoices & Docs", "Customer Delivery & POD", "Payments").

## Current state

- **Role 2 — Gate / Security Operator:** 100% complete, fully tested, and cleanly integrated.
  - `/gate` (Gate Dashboard & Operations Ledger)
  - `/gate/tracker` (Live Plant Vehicle Tracker & Dwell Time)
  - `/gate/entry` (Gate Pass Creation)
  - `/gate/exit` (Vehicle Exit Clearance Checklist)
- **Role 3 — Weighbridge Operator:** 100% complete, fully tested, and cleanly integrated.
  - `/weighbridge` (Live Dual-Deck Scale Cockpit + Waiting Queue)
  - `/weighbridge/weighments` (Weight Records History & Slips Ledger)
- **Navigation:** All 8 roles streamlined and faithful to `Mahaurja Operational Flow.pdf`.
- **TypeScript:** `npx tsc --noEmit` passes with 0 errors.
- **Dev Server:** Running cleanly on `http://localhost:3000`.

## Next session starts with

- **Role 4 — QC / Lab Technician (`src/components/quality/` & `/quality/`):**
  - **RM Testing Workbench (`quality/rm-testing/`):**
    - Vehicle sampling queue linked to Inbound RM arrivals.
    - Testing form: Moisture%, Ash%, GCV, Foreign Matter%, Bulk Density, Visual Grade.
    - Automated tolerance check and decision: Approve / Hold / Reject (PDF Sec 6).
  - **FG Testing Workbench (`quality/fg-testing/`):**
    - Production batch testing: Pellet diameter (8mm), Moisture%, Ash%, GCV, Fines%, Bulk Density (PDF Sec 22).
  - **QC Reports & COA Console (`quality/reports/`):**
    - Certificate of Analysis (COA) generation and export for approved FG batches (PDF Sec 30).
    - Historical test ledger with lab technician digital sign-off.

## Open questions

- None. Milestone 2 (Gate + Weighbridge + Navigation Streamlining) is 100% complete and verified.
