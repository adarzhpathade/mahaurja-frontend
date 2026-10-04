# 📊 MAHAURJA – Project Progress Tracker

> **Last Updated:** 04 Oct 2026, 01:05 IST
> **Status:** 🟢 Gate & Weighbridge Modules Complete · UI Standards & Registry Codified · QC Lab Next

---

## Overall Progress

| Phase | Status | Progress |
|---|---|---|
| Project Setup (Next.js, Tailwind v4, Motion, Lenis) | 🟢 Complete | 100% |
| Design System & Shared Components (Registry & Standards) | 🟢 Complete | 85% |
| Auth (Login / Forgot Password) | 🔴 Not Started | 0% |
| Role 1 — Admin / Super Admin | 🔴 Not Started | 0% |
| Role 2 — Gate / Security Operator | 🟢 Complete | 100% |
| Role 3 — Weighbridge Operator | 🟢 Complete | 100% |
| Role 4 — QC / Lab Technician | 🟡 Next Up | 0% |
| Role 5 — Production Supervisor | 🔴 Not Started | 0% |
| Role 6 — Warehouse / Inventory Manager | 🔴 Not Started | 0% |
| Role 7 — Sales / Dispatch Manager | 🔴 Not Started | 0% |
| Role 8 — Management / Plant Director | 🔴 Not Started | 0% |

**Legend:** 🔴 Not Started · 🟡 In Progress / Next Up · 🟢 Complete · 🔵 Under Review

---

## Phase 0 — Project Setup

- [x] Initialize Next.js app (App Router, TypeScript)
- [x] Configure Tailwind CSS v4 (CSS-first theme tokens)
- [x] Install & configure Motion (motion.dev)
- [x] Install & configure Lenis (smooth scroll)
- [x] Install Lucide React icons
- [x] Set up local Switzer font typography
- [x] Set up folder structure (`src/app`, `components`, `lib`, `styles`)
- [x] Configure color palette tokens (80% Grays, 15% White, 5% Surgical Bio-Emerald)
- [x] Set up dark mode infrastructure

---

## Phase 1 — Design System & Shared Components

### UI Primitives (`components/ui/`)
- [ ] Button (variants: primary, secondary, ghost, danger, outline)
- [ ] Input (text, number, date, search)
- [ ] Select / Dropdown
- [ ] Textarea
- [ ] Checkbox & Radio
- [ ] Toggle / Switch
- [ ] Badge (status colors)
- [ ] Card (glass effect, elevated, flat)
- [ ] Table (sortable, paginated, responsive)
- [ ] Modal / Dialog
- [ ] Drawer (mobile slide-in panel)
- [ ] Toast / Notification
- [ ] Skeleton loader
- [ ] Tooltip
- [ ] Tabs
- [ ] Breadcrumb
- [ ] Pagination
- [ ] File Upload / Dropzone
- [ ] Date Picker
- [ ] Search with filters

### Layout Components (`components/layout/`)
- [ ] Sidebar (collapsible, role-based nav, mobile responsive)
- [ ] Topbar (search, notifications, profile, dark mode toggle)
- [ ] Mobile Bottom Nav
- [ ] Page Header (title, breadcrumb, actions)
- [ ] Dashboard Shell (sidebar + topbar wrapper)

### Shared Business Components (`components/shared/`)
- [ ] Status Badge (color-coded workflow states)
- [ ] KPI Card (animated counters, trend indicators)
- [ ] Traceability Chain (visual linkage component)
- [ ] Empty State (illustration + CTA)
- [ ] Data Table with actions (view, edit, delete)
- [ ] Filter Bar (date range, status, search)
- [ ] Timeline / Activity Log

---

## Phase 2 — Auth

- [ ] Login page (premium design, responsive)
- [ ] Forgot Password page
- [ ] Role-based redirect after login
- [ ] Auth layout (separate from dashboard)

---

## Phase 3 — Role 1: Admin / Super Admin

### Dashboard
- [ ] Admin overview dashboard (system stats, recent activity)

### User Management (`admin/users/`)
- [ ] User list (table with search, filter by role, status)
- [ ] Add / Edit user form (name, email, role, permissions)
- [ ] User detail view
- [ ] Activate / Deactivate user

### Role & Permission Settings (`admin/settings/`)
- [ ] Role list & permission matrix
- [ ] System configuration page

### Masters — Supplier / Farmer (`admin/masters/suppliers/`)
- [ ] Supplier list (table with search, filter by type/status)
- [ ] Add / Edit supplier form (ID, name, village, material, bank, GST)
- [ ] Supplier detail view (purchase history, payment history)
- [ ] Supplier type filter (Farmer, Trader, Aggregator, Company)

### Masters — Materials (`admin/masters/materials/`)
- [ ] Material list
- [ ] Add / Edit material form (name, category, QC parameters)
- [ ] Material detail view

### Masters — Storage Locations (`admin/masters/storage-locations/`)
- [ ] Storage location list (Yard A, Warehouse 1, Shed 2, etc.)
- [ ] Add / Edit storage location form
- [ ] Location capacity & current stock view

### Masters — Formulas / Blends (`admin/masters/formulas/`)
- [ ] Formula list
- [ ] Add / Edit formula (material mix ratios, target output)
- [ ] Formula detail view

---

## Phase 4 — Role 2: Gate / Security Operator

### Gate Dashboard & Operations Hub (`gate/dashboard/` & `gate/gate-home.tsx`)
- [x] Operations Hub with real-time digital master clock & rapid hotbar
- [x] Shift 01 telemetry, on-duty guard badge, barricade health & weighbridge sync
- [x] Shift pulse KPIs (Movements today, Biomass inflow, Turnaround, Safety record)
- [x] Tactical guard rapid workflow launchpad (Pass creation, check-in, barrier override)
- [x] Expected Inbound Biomass Consignments Queue with 1-click fast check-in
- [x] Live perimeter camera feed status & manual barrier override controls
- [x] Interactive guard shift log & physical security checklists with timestamps
- [x] Real-time gate event & vehicle movement audit feed with category filters
- [x] Shift Handover Sign-Off protocol with relief guard validation

### Live Vehicle Tracker (`gate/live-tracker/` & `gate/live-vehicle-tracker.tsx`)
- [x] Interactive multi-compartment vehicle visualizer (Cab + Bay 1-4) with 3D SVG axles
- [x] Stage progression pipeline (Gate In -> Weighment -> Unloading -> QC Lab -> Exit)
- [x] Smooth card open/collapse animations with Motion (`motion/react`)
- [x] Status filter chips, search filtering, and driver biometric modal view
- [x] Switzer typography with tabular numbers
- [x] Direct navigation link to Outward Exit Desk for ready-to-clear vehicles

### Gate Entries (`gate/entries/`, `/gate/entry` & `gate/gate-entry.tsx`)
- [x] Dedicated Vehicle Gate Entry Console (`/gate/entry`) with bold industrial typography
- [x] Zero-scroll desktop experience (< 650px total height, 3-column field grid)
- [x] Native transparent background on mobile viewports (≤ 640px)
- [x] Responsive direction switcher (`Inbound RM` vs `Outbound FG`)
- [x] RM Gate Entry form (vehicle, driver, supplier, material, PO, expected weight)
- [x] Dispatch Gate Entry form (vehicle, driver, customer, SO)
- [x] Fast-track prefill support from expected arrivals queue
- [x] Auto-generated Gate Entry No (`RM-GATE-261003-XXX`) following spec pattern
- [x] Tactile Security Inspection & Remarks preset chips with generous touch padding
- [x] Plain English UI vocabulary (replaced jargon across forms)
- [x] Reactive state integration: newly created passes automatically enter live fleet queue

### Vehicle Exit Desk (`gate/exits/` & `gate/gate-exit.tsx`)
- [x] Exit clearance queue with direction pills, dwell time, and WB slip reconciliation
- [x] Shift Telemetry KPIs (Exit Queue, Departed Today, Avg Dwell, Security Compliance)
- [x] 4-Step Physical Security Clearance modal (WB slip, cargo bed, breathalyzer, gate pass)
- [x] "Select All 4 Checks" helper for rapid processing
- [x] Guard remarks & officer sign-off logging
- [x] Barrier 02 Cycle automation (Raise -> Pass -> Lower alert sequence)
- [x] Printable official Outward Clearance Pass (`EXT-261003-00X`) with QR and letterhead
- [x] Departed Today Audit Trail with search and pass reprint functionality
- [x] Manual Barrier Override modal with 20s auto-lower safety timer
- [x] Clean `@media print` layout for thermal and A4 printers

### Document Verification Desk (`gate/docs/` & `gate/gate-doc-verification.tsx`)
- [x] Statutory compliance header with GST NIC gateway status (32ms latency) & Rule 138 alert
- [x] Optical QR / Barcode Scanner simulator for e-Way bills and physical challans
- [x] Consignment audit table with HSN, GSTIN, transporter, and validity tracking
- [x] Multi-field search and 5 status filter chips (All, Pending, Verified, Expired, Flagged)
- [x] Split-screen Document Audit modal with interactive 4-point verification checklist
- [x] One-click "Verify All Checks" helper
- [x] Discrepancy flagging: Plate Mismatch, Expired e-Way Bill, Tax Invoice Missing
- [x] Printable Statutory Clearance Certificate with officer verification stamp
- [x] Clean `@media print` layout for legal documentation

### Vehicle Details Drawer (`gate/vehicle-details-drawer.tsx`)
- [x] Slide-over inspection drawer for granular vehicle, driver, and consignment diagnostics
- [x] 5-stage visual timeline progression with step advance actions
- [x] Gate pass slip generation and print action

### Plant Intercom (`gate/intercom-modal.tsx`)
- [x] Tactical intercom directory linking Gate to WB-01, QC Lab, Yard, and Admin
- [x] Live line status, push-to-talk simulation, and emergency broadcast toggle

### Shared State Architecture (`src/app/page.tsx` & `src/lib/types/gate.ts`)
- [x] Lifted `vehicles[]` reactive state to root `page.tsx`
- [x] Two-way synchronization across Home, Tracker, Entry Modal, Exit Desk, and Doc Verification
- [x] Status progression transitions synced in real-time across all views

---

## Phase 5 — Role 3: Weighbridge Operator

### Weighbridge Home & Operations Console (`weighbridge/weighbridge-home.tsx`)
- [x] Dual-platform live monitoring console: WB-01 (Inbound RM Gross/Tare) and WB-02 (Outbound FG Tare/Gross)
- [x] Live digital scale indicator telemetry with Rice Lake / Avery high-contrast CRT styling
- [x] Real-time stability beacon (`STABLE` in bio-emerald vs `IN_MOTION` in amber pulsing)
- [x] Dynamic axle load distribution graphic with individual load cell readouts
- [x] Tare zeroing and calibration override controls
- [x] Platform occupancy cards with live vehicle assignment and pass tracking
- [x] Quick-action hotbar: Capture Gross, Capture Tare, Manual Calibration, Print Slip

### Weighment Capture Modal (`weighbridge/weighment-capture-modal.tsx`)
- [x] Gross weighment entry with digital scale sync and camera snapshot
- [x] Tare weighment entry with automated gross-tare reconciliation
- [x] Strictly automated non-editable Net Weight calculation (`Net = |Gross - Tare|`)
- [x] Tolerance limit check against expected PO/SO quantity (warning on > 5% variance)
- [x] Automatic vehicle state progression (Inbound: Gate -> Gross Weighed -> QC Pending; Outbound: Tare Weighed -> Loading -> Gross Weighed -> Cleared)

### Official Weighbridge Slips (`weighbridge/weighbridge-slip-modal.tsx`)
- [x] Printable legal metrology weight certificate with Bharat Industrial & Renewables LLP header
- [x] Dual-stage weighment audit matrix (Gross, Tare, Net weights with exact operator timestamps)
- [x] Barcode identifier strip and QR tracking tag
- [x] Metrology legal declaration and weighbridge operator digital signature block
- [x] Clean print stylesheets (`@media print`) for thermal receipt and laser A4 printers

### Weighment Records & History
- [x] Real-time searchable and filterable weighment log
- [x] Filter by Direction (Inbound RM / Outbound FG), Platform (WB-01 / WB-02), and Status
- [x] 1-Click slip reprint and vehicle inspection drawer linkage

---

## Phase 6 — Role 4: QC / Lab Technician

### RM Testing (`quality/rm-testing/`)
- [ ] Pending samples list (awaiting QC)
- [ ] QC test entry form (Moisture%, Ash%, GCV, Bulk Density, Foreign Matter%)
- [ ] Approve / Hold / Reject workflow with remarks
- [ ] QC report detail view

### FG Testing (`quality/fg-testing/`)
- [ ] FG pending samples list
- [ ] FG QC test entry form (GCV, Moisture, Ash, diameter, fines%)
- [ ] FG Approve / Hold / Reject workflow
- [ ] FG QC report detail view

### Reports (`quality/reports/`)
- [ ] QC reports list (filterable by date, material, status)
- [ ] COA (Certificate of Analysis) generation
- [ ] QC analytics (pass/fail trends)

---

## Phase 7 — Role 5: Production Supervisor / Operator

### Production Plans (`production/plans/`)
- [ ] Production plan list (date, shift, target, status)
- [ ] Create production plan form (date, shift, target, product, formula, material mix)
- [ ] Production plan detail view

### Material Issue (`production/material-issue/`)
- [ ] Material issue request form (RM lots selection, quantities)
- [ ] Material issue list
- [ ] Auto inventory deduction display

### Processing Stages (`production/processing/`)
- [ ] Stage-wise logging UI:
  - [ ] Cleaning (input, output, rejected, loss)
  - [ ] Size Reduction / Grinding (machine, time, operator)
  - [ ] Drying / Moisture Control (moisture before/after, dryer)
  - [ ] Blending / Mixing (formula, lots, actual vs target)
  - [ ] Pelletisation (batch, machine, shift, diameter)
  - [ ] Cooling (batch, input, output, loss)
  - [ ] Screening (good production, fines, rejected/recycle)

### Batches (`production/batches/`)
- [ ] Production batch list
- [ ] Production batch detail (linked RM lots, formula, operator, machine)
- [ ] FG Batch creation

### Downtime (`production/downtime/`)
- [ ] Downtime log entry (machine, start, end, reason)
- [ ] Downtime history & analytics

---

## Phase 8 — Role 6: Warehouse / Inventory Manager

### Raw Materials (`inventory/raw-materials/`)
- [ ] RM inventory dashboard (material-wise stock, location-wise view)
- [ ] RM stock movement log (received, issued, consumed)
- [ ] RM inventory detail by material

### Finished Goods (`inventory/finished-goods/`)
- [ ] FG inventory dashboard (batch-wise, status: QC Pending / Approved / Dispatched)
- [ ] FG stock movement log
- [ ] FG inventory detail by batch

### Lots (`inventory/lots/`)
- [ ] RM Lot list (lot ID, material, supplier, QC status, quantity)
- [ ] Lot detail view (full traceability: supplier → vehicle → QC → storage)
- [ ] Lot traceability chain visualization

### Packaging (`inventory/packaging/`)
- [ ] Packaging entry form (batch, type: bagged/bulk, bag size, quantity)
- [ ] Packaging history list

---

## Phase 9 — Role 7: Sales / Dispatch Manager

### Customers (`sales/customers/`)
- [ ] Customer list
- [ ] Add / Edit customer form
- [ ] Customer detail (order history, payment history)

### Orders (`sales/orders/`)
- [ ] Sales order list (status workflow tracking)
- [ ] Create sales order form (customer, product, quantity, rate, delivery, terms)
- [ ] Sales order detail view
- [ ] Order status progression (Enquiry → Quotation → Confirmed → Dispatched → Closed)

### Dispatch (`sales/dispatch/`)
- [ ] Dispatch planning screen (available FG vs order requirements)
- [ ] Loading transaction form (link: customer → SO → FG batch → vehicle)
- [ ] Dispatch list & detail view

### Invoices (`sales/invoices/`)
- [ ] Invoice generation (auto from dispatch)
- [ ] Invoice list
- [ ] Document generation: Delivery Challan, E-way Bill, Weighbridge Slip, LR, COA

### Delivery (`sales/delivery/`)
- [ ] Delivery tracking (Dispatched → In Transit → Delivered → POD Received)
- [ ] POD upload & customer acknowledgement
- [ ] Delivery history

### Payments (`sales/payments/`)
- [ ] Payment receivable dashboard (outstanding, overdue, received)
- [ ] Payment entry form (amount, date, mode, reference)
- [ ] Invoice vs payment reconciliation
- [ ] Payment status tracking (Outstanding → Part Payment → Fully Paid → Closed)

---

## Phase 10 — Role 8: Management / Plant Director

### Dashboard (`management/dashboard/`)
- [ ] Live KPI dashboard:
  - [ ] Vehicles inside plant
  - [ ] RM awaiting QC
  - [ ] RM available stock (MT)
  - [ ] Production today vs target
  - [ ] FG awaiting QC
  - [ ] FG stock (MT)
  - [ ] Orders pending (MT)
  - [ ] Today's dispatches (count + MT)
  - [ ] Outstanding receivables (₹)
  - [ ] Average RM cost (₹/MT)
  - [ ] Production cost (₹/MT)
- [ ] Charts: production trends, inventory trends, revenue trends

### Traceability (`management/traceability/`)
- [ ] Forward trace: Supplier → RM Lot → Production → FG → Customer
- [ ] Reverse trace: Customer → Dispatch → FG Batch → Production → RM Lot → Supplier
- [ ] Visual chain/flow diagram

### Reports (`management/reports/`)
- [ ] Daily production report
- [ ] Inventory summary report
- [ ] Sales & dispatch report
- [ ] QC summary report
- [ ] Financial summary (receivables, costs)
- [ ] Export to PDF / Excel

---

## 🎯 Milestones

| Milestone | Target Date | Status |
|---|---|---|
| Project setup & design system complete | 03 Oct 2026 | 🟢 Complete |
| Gate + Weighbridge complete | 04 Oct 2026 | 🟢 Complete |
| QC + Inventory complete | TBD | 🟡 Next Up |
| Production module complete | TBD | 🔴 Planned |
| Sales & Dispatch complete | TBD | 🔴 Planned |
| Management Dashboard complete | TBD | 🔴 Planned |
| Auth + Admin panel complete | TBD | 🔴 Planned |
| Full integration & polish | TBD | 🔴 Planned |
| **🚀 Launch Ready** | TBD | 🔴 Planned |

---

> **Note:** This tracker will be updated as each screen/component is completed. Check off items as they are built and change status emojis accordingly.
