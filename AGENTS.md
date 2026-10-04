# MAHAURJA – Plant Operational Management System

## Project Overview

Mahaurja is an **Awwwards-level**, production-grade plant operational management system for **Bharat Industrial & Renewables LLP**. It manages the full lifecycle of biomass pellet manufacturing — from raw material arrival to customer delivery and payment.

The system must be **fully traceable**: every raw material → batch → production run → finished goods batch → dispatch must remain digitally linked and traceable in both directions (Supplier → Customer and Customer → Supplier).

---

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| **Framework**    | Next.js (App Router)                |
| **Language**     | TypeScript                          |
| **Styling**      | Tailwind CSS v4 (CSS-first config)  |
| **Animations**   | Motion (motion.dev) + Lenis         |
| **State**        | React Server Components + hooks     |
| **Icons**        | Lucide React                        |
| **Fonts**        | Switzer (local WOFF2, 400/500/600)  |
| **Charts**       | Recharts or similar lightweight lib |

---

## Color Palette

The color system is inspired by high-end minimalist industrial design: **80% Grays & Neutrals**, **15% Crisp Studio White**, and **5% Surgical Bio-Emerald Green** used strictly for selected items, active bays, and key focal points.

```css
@theme {
  /* Brand & Focal Accents (Surgical - Used only in selected places / active focal items) */
  --color-primary: #059669;           /* Bio-Emerald (Selected Bay, Primary Action Badge) */
  --color-primary-hover: #047857;     /* Deep Emerald Hover */
  --color-accent: #10B981;            /* Vibrant Bio-Green Highlight */
  --color-accent-subtle: #ECFDF5;     /* Soft Mint Tint for Selected Container Bgs */

  /* Neutral & Dark Foundations (80% Grays) */
  --color-canvas: #F4F5F7;            /* Mist / Cool Off-White Canvas Background */
  --color-surface: #FFFFFF;           /* Crisp White Card Containers & Tooltips */
  --color-surface-subtle: #F8F9FA;    /* Inactive Bays, Inset Panels & Table Headers */
  --color-surface-muted: #ECEFF2;     /* Unselected Loaded Compartments & Chips */
  --color-border: #E2E8F0;            /* 1px Hairline Dividers & Grid Outlines */
  --color-charcoal: #18181B;          /* Pitch Charcoal for Active Nav Pills, Chassis, Heavy Badges */

  /* Typography */
  --color-text-primary: #0F172A;      /* Deep Slate for Headings, Metrics & Primary Values */
  --color-text-secondary: #64748B;    /* Cool Slate Muted for Sub-labels, Headers, Metadata */

  /* Status Workflows */
  --color-success: #16A34A;           /* Complete / Approved */
  --color-warning: #F59E0B;           /* In Transit / Testing / Pending */
  --color-error: #DC2626;             /* Rejected / Downtime Alert */
  --color-info: #059669;              /* Active Process */
}
```

### Color Distribution Rule:
- **80% Grays & Neutrals:** Canvas (`#F4F5F7`), borders (`#E2E8F0`), unselected compartments (`#ECEFF2`), text (`#0F172A` / `#64748B`), and charcoal elements (`#18181B`).
- **15% Pure White Surfaces:** Cards, elevated modals, tooltips, and data tables.
- **5% Selected Bio-Green:** Surgical focal points only (the active truck cargo bay, the `+ Add` badge, active selection pills). Never over-saturated.

---

## Design Philosophy

- **Awwwards-level UI** — Every screen must feel premium, polished, state-of-the-art, and visually stunning. No generic, basic, or stripped-down interfaces.
- **Rich Industrial Operations & Control Workbenches** — Retain the rich, immersive industrial operational design currently in place: live vehicle flow tracking, interactive weighbridge console with scale stabilization telemetry, QC testing workbenches, production line flow monitors, location-wise warehouse maps, and executive management KPIs.
- **Large, Bold Typography** — Command-level page headers (`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900`). Bold uppercase section labels with letter-spacing (`text-xs font-bold uppercase tracking-wider text-neutral-800`). No subtitle clutter, decorative chips, or redundant paragraphs in page headers.
- **Section Spacing & Visual Hierarchy** — Always provide generous vertical breathing room between major form sections (`mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-200`). Never cram fields or subsections directly against preceding inputs without clear margin.
- **Minimal Cards & Zero-Scroll Desktop Experience** — Eliminate decorative, superfluous KPI card grids on primary data entry and control screens (Gate Entry, Weighbridge Capture, QC Testing). On desktop, organize operational forms using balanced multi-column grids (2 or 3 columns) so the entire workbench fits in a standard 1080p/900p viewport with **zero vertical scrolling** (< 650px height).
- **Clean Mobile Architecture** — On mobile (≤ 640px), eliminate thick nested white card containers with heavy borders; use transparent container backgrounds (`bg-transparent border-0 p-0 sm:border sm:border-neutral-300 sm:p-5 sm:bg-white`) so fields sit directly on the `#F4F5F7` canvas and maximize usable width.
- **Plain English UI (Easy Words)** — Ban academic, legalistic, or overly complex industrial jargon. Always use simple, intuitive, plain English terms that plant operators and drivers understand immediately.
- **Mobile-first & Responsive** — Every page must be fully responsive and adapt smoothly across mobile devices (375px+), tablets, and wide industrial desktop consoles.
- **Micro-animations everywhere** — Use Motion for page transitions, staggered reveals, layout animations, and tab transitions. Use Tailwind transitions for hover states, focus rings, and subtle interactive feedback.
- **Smooth scrolling** — Lenis for buttery scroll experience across all pages.
- **Status-driven design** — Use color-coded badges, progress indicators, and status pills throughout. Every entity moves through a defined status workflow, not just static forms.
- **Glassmorphism, gradients, and depth** — Use modern design patterns: subtle glass effects, layered cards with shadows, vibrant gradients, and visual depth.
- **Dark mode ready** — Design with dark mode as a first-class citizen.
- **Typography matters** — Use premium typography (Switzer), proper hierarchy (size, weight, spacing), and never rely on browser defaults.

---

## 📐 Core UI Standards (Spacing, Typography & Layout)

### 1. Section Spacing & Breathing Room
- **Major Form Sections:** Must use `mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-200 space-y-3`. This creates a crisp hairline separator and deliberate vertical space.
- **Sub-section Headers:** Display an icon + uppercase label: `<div className="flex items-center gap-2"><Icon className="w-4 h-4 text-[#059669] shrink-0" /><label className="text-xs font-bold uppercase tracking-wider text-neutral-800">Section Name</label></div>`.
- **Action Preset Chips / Pills:** Must have comfortable padding and gaps: `px-3 py-1.5 text-xs font-medium border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 shadow-2xs` with `gap-2.5 sm:gap-3 py-1` flex-wrap layout. Never use tiny cramped tags (`py-0.5` or `gap-1`).
- **Remarks & Notes Textarea:** Multi-line inputs must have ample height and comfortable padding: `min-h-[56px] sm:min-h-[48px] p-3 text-xs leading-relaxed resize-none`.
- **Form Action Footer:** Must have a dedicated top margin and divider: `mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3`.

### 2. Typography Standard
- **Page Titles:** `<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">`
- **Section Headers:** `<label className="text-xs font-bold uppercase tracking-wider text-neutral-800">`
- **Field Labels:** `<label className="text-[11px] font-semibold text-neutral-700 block mb-1">`
- **Inputs & Selects:** `h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#059669]`
- **Numeric Telemetry & Live Weights:** Monospace tabular numbers: `font-mono font-black text-2xl` up to `text-7xl`.

### 3. Minimal Cards & Container Rules
- **No Decorative KPI Grids on Data Entry Pages:** Never clutter primary transaction forms (Gate Entry, Gross/Tare Weighment, Sampling) with 4-card metric grids. Keep operational forms clean and focused.
- **Desktop Zero-Scroll:** Keep form height below 650px total on desktop viewports by utilizing 3-column field grids (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`).
- **Mobile Container Transparent:** On mobile viewports (≤ 640px), the outer container MUST be `bg-transparent border-0 p-0 sm:border sm:border-neutral-300 sm:p-5 sm:bg-white` to prevent cramped nested boxes.

### 4. Plain English UI Vocabulary (Easy Words)
Always replace complex or bureaucratic jargon with direct, easy-to-read terms:

| ❌ Hard / Jargon Word | ✅ Plain English Term (Use in UI) | Context |
| -------------------- | --------------------------------- | ------- |
| Consignor | **Supplier** | Raw Material Source |
| Consignee | **Customer** | Finished Goods Destination |
| Commodity | **Material** | Raw Material / Finished Goods |
| Statutory / Compliance | **Required** | Form validation / Required fields |
| Weighment Reconciliation | **Weight Record / Weight History** | Weighbridge ledger & slips |
| Dwell Time / Detention | **Time Inside** | Total duration vehicle stayed in plant |
| Turnaround Time | **Visit Time** | Total vehicle arrival-to-exit time |
| Consignment Manifest | **Gate Pass** | Gate pass & entry slip |
| Movement Identifier | **Pass Number (e.g., RM-GATE-...)** | Tracking reference ID |
| Annotations / Observations | **Remarks / Notes** | Inspection & driver notes |
| Purge Buffer / Reset Cache | **Clear** | Form reset button |
| Execute Authorization | **Issue Pass / Confirm** | Primary submission action |
| Tare Quantification | **Empty Weight (Tare)** | Weighbridge tare capture |
| Gross Metrology | **Loaded Weight (Gross)** | Weighbridge gross capture |

### 5. Mandatory Desktop Dual View (Cards & Table with Icons)
Every operational queue, fleet roster, or history ledger must provide a desktop segmented view switcher (`[ Cards ] [ Table ]`):
- **Switcher Container:** `<div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">`
- **Cards Button:** `<button className="..."><LayoutGrid className="w-3.5 h-3.5" /><span>Cards</span></button>`
- **Table Button:** `<button className="..."><TableIcon className="w-3.5 h-3.5" /><span>Table</span></button>`
- **Ordering:** Strictly `[ Cards ] [ Table ]` left-to-right.
- **Active Pill:** `bg-[#18181B] text-white font-semibold flex items-center gap-1.5`
- **Inactive Pill:** `bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200 flex items-center gap-1.5`
- **Mobile Rule:** On mobile devices (≤ 640px), the view MUST always render responsive cards (`grid-cols-1 sm:hidden gap-3`), never forcing horizontal table scrolling on small touchscreens.

### 6. Strict Ban on Table White Backgrounds (Transparent Industrial Tables)
Tables must NEVER have `bg-white` on the wrapper, table, or body:
- **Container:** `border border-neutral-300 overflow-x-auto bg-transparent`
- **Thead:** `border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]`
- **Tbody:** `divide-y divide-neutral-300`
- **Rows (Tr):** `hover:bg-neutral-200/40 cursor-pointer transition-colors`
- **Numeric & Plates:** Monospace tabular numbers `font-mono tabular-nums` and bordered plate chips `px-2 py-0.5 font-mono font-bold text-xs bg-neutral-50 border border-neutral-300 text-neutral-900`.

### 7. Translucent Queue Cards & Direction Indicators
- **Translucent Card Surface:** Cards in queues and workbenches must use `bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all` rather than stark opaque white, blending harmoniously with the `#F4F5F7` mist canvas.
- **Direction Badging Standard:**
  - **Inbound Biomass RM:** `border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5`
  - **Outbound Dispatch FG:** `border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5`

### 8. Precision Industrial Navigation System (IndustrialNav & Type-Safe Bindings)
- **Central Navigation Component:** Located at `src/components/layout/industrial-nav.tsx`. Provides a center-aligned horizontal tab bar on desktop, razor-sharp borders, and high-contrast pitch charcoal active tabs (`bg-[#18181B] text-white border-[#18181B]`).
- **Type-Safe Layout Role Binding Rule:** Layout files MUST NEVER use fragile numeric array indexing (e.g. `USER_ROLES[1]`). Layouts MUST import and bind strongly typed named exports:
  - `ROLE_GATE_SECURITY` (`gate-security`)
  - `ROLE_WEIGHBRIDGE` (`weighbridge`)
  - `ROLE_SALES_DISPATCH` (`sales-dispatch`)
  - `ROLE_QC_LAB` (`qc-lab`)
  - `ROLE_PRODUCTION` (`production`)
  - `ROLE_WAREHOUSE` (`warehouse`)
  - `ROLE_ADMIN` (`admin`)
  - `ROLE_MANAGEMENT` (`management`)
  or use `getRoleById(roleId)`.
- **Top-Right Quick Role Switcher:** Allows plant managers or testing engineers to quickly switch profiles and desks on the fly.
- **Streamlined Physical-to-Digital Principle (PDF Sec 38):** Standalone virtual software desks that lack physical station counterparts are strictly prohibited. Gate document verification is integrated directly into Gate Entry and Vehicle Exit clearance; Gross and Tare weighments are integrated directly into the live Scale Terminal.

---

## 🎨 CRITICAL DESIGN RULE

**When the user provides design images (screenshots, mockups, Figma exports), replicate them EXACTLY as given.** Do not improvise, do not simplify, do not skip details. Match:
- Layout and spacing pixel-perfectly
- Colors, gradients, and shadows exactly
- Font sizes, weights, and line heights
- Border radius, padding, margins
- Icon placement and sizing
- Component hierarchy and ordering

If something is ambiguous in the design image, ask for clarification rather than guessing.

---

## Development Rules

### DO:
- Write clean, modular, reusable components
- Use TypeScript strictly — no `any` types unless absolutely unavoidable
- Use server components by default; add `"use client"` only when needed (interactivity, hooks, motion)
- Co-locate components with their pages when page-specific; put shared components in `/components`
- Use semantic HTML (`<main>`, `<nav>`, `<section>`, `<article>`, etc.)
- Use Tailwind CSS v4 theme tokens for all colors, spacing, and typography — no hardcoded values
- Implement proper loading states (skeleton loaders with `animate-pulse`)
- Add proper `aria-` attributes and keyboard navigation for accessibility
- Keep bundle size minimal — lazy load heavy components with `next/dynamic`
- Maintain rich, highly functional industrial consoles that empower operators with immediate context, quick actions, and clear status visibility
- Register newly refined or reusable component patterns in `ui-registry.md`

### DON'T:
- ❌ Do NOT run lint checks, build checks, or type checks after every step. Only run checks when explicitly asked or at the end of a complete feature.
- ❌ Do NOT commit or push to Git after every step. Only commit and push when a full feature or milestone is completed, or when explicitly requested by the user.
- ❌ Do NOT use placeholder images — generate real assets using the image generation tool when needed
- ❌ Do NOT create basic/minimal UIs or dumbed-down kiosk tile grids — every screen and component must look premium and operational
- ❌ Do NOT clutter primary data entry forms with decorative KPI cards that cause unnecessary vertical scrolling
- ❌ Do NOT hardcode data — use proper TypeScript types/interfaces even for mock data
- ❌ Do NOT skip animations — every page transition, list render, and interactive element should have motion
- ❌ Do NOT ignore mobile — test every layout mentally for 375px (mobile), 768px (tablet), and 1440px (desktop)
- ❌ Do NOT use complex, legalistic, or academic jargon in the UI — always use plain English easy words

---

## User Roles (8 Total)

Each role has its own comprehensive operational workbench and dedicated screens, bound directly to `IndustrialNav` using type-safe constants. Role-based access control restricts visibility.

### 1. Gate / Security Operator (`ROLE_GATE_SECURITY`)
- **Operator Profile:** Ramesh Pawar · Department: Inbound / Outbound Gate
- **PDF Sections:** 3 (Vehicle Arrival & Gate Entry), 27 (Dispatch Vehicle Arrival), 31 (Vehicle Exit)
- **Operational Desks & Tabs:**
  - **Gate Dashboard (`/gate`):** Real-time digital clock, shift pulse KPIs, expected inbound arrivals queue with 1-click prefill, live security event log.
  - **Vehicle Tracker (`/gate/tracker`):** Interactive multi-compartment vehicle visualizer (Cab + Bays 1-4) with 3D axles, plant stage pipeline, driver biometric preview.
  - **Gate Entry (`/gate/entry`):** Dedicated zero-scroll entry console (< 650px height), Inbound RM / Outbound FG toggle, auto-generated `RM-GATE-YYMMDD-seq` pass, tactile inspection chips.
  - **Vehicle Exit (`/gate/exit`):** Exit clearance queue, 4-step physical security checklist (WB slip, cargo bed, breathalyzer, pass), barrier cycle automation, printable outward clearance pass `EXT-YYMMDD-seq`. Document verification is integrated directly here (Sec 31 & 38).
- **Status Flow:** ARRIVED → GATE ENTRY CREATED → WAITING FOR WEIGHMENT → ... → VEHICLE EXIT COMPLETED

### 2. Weighbridge Operator (`ROLE_WEIGHBRIDGE`)
- **Operator Profile:** Sunil Shinde · Department: Weighment Station
- **PDF Sections:** 4 (Gross Weighment), 7 (Tare Weighment), 29 (Dispatch Weighment), 30 (Weighbridge Slip)
- **Operational Desks & Tabs:**
  - **Scale Terminal (`/weighbridge`):** Live dual-platform console (WB-01 Inbound, WB-02 Outbound), 3-zone industrial cockpit (Telemetry, Active Truck, Official Weighment), load cell stability indicator, automated Net Weight calculation (`Net = |Gross - Tare|`, non-editable).
  - **Weight Records (`/weighbridge/weighments`):** Searchable metrology ledger, direction filters, instant official slip viewing, reprint, and PDF export. Standalone duplicate gross/tare/slip routes eliminated per PDF Sec 38.
- **Key Metrology Rule:** Net = Gross − Tare strictly calculated by software; never manual.

### 3. Sales / Dispatch Manager (`ROLE_SALES_DISPATCH`)
- **Operator Profile:** Vikram Malhotra · Department: Logistics & Outbound
- **PDF Sections:** 25 (Sales Order), 26 (Dispatch Planning), 27 (Dispatch Vehicle), 28 (Loading), 29 (Dispatch Weighment), 30 (Invoice & Docs), 32 (Customer Delivery), 33 (Payment)
- **Operational Desks & Tabs:**
  - **Sales Orders (`/sales/orders`):** Customer order booking, order status workflow, rate (₹/MT), target specs. ID: `SO-YYMMDD-seq`.
  - **Dispatch Planning (`/sales/dispatch`):** Stock verification against orders, allocation of approved FG batches to vehicles with customer-to-batch traceability. ID: `DIS-YYMMDD-seq`.
  - **Invoices & Docs (`/sales/invoices`):** Automated generation of Sales Invoice, Delivery Challan, E-Way Bill, Weighbridge Slip, LR, and COA suite (Sec 30).
  - **Delivery & POD (`/sales/delivery`):** In-transit tracking, delivery confirmation, Proof of Delivery (POD) upload, feedback logging (Sec 32).
  - **Payments (`/sales/payments`):** Accounts receivable ledger, payment reconciliation, partial/full payment tracking (Sec 33).
- **Status Flows:**
  - Sales: NEW → CONFIRMED → PARTIALLY DISPATCHED → FULLY DISPATCHED → CLOSED
  - Dispatch: DISPATCHED → IN TRANSIT → DELIVERED → POD RECEIVED
  - Payment: INVOICE GENERATED → OUTSTANDING → PART PAYMENT → FULLY PAID → CLOSED

### 4. QC / Lab Technician (`ROLE_QC_LAB`)
- **Operator Profile:** Dr. Ananya Deshmukh · Department: Quality Assurance Lab
- **PDF Sections:** 6 (Sampling & QC), 22 (Final QC for FG), 30 (COA Generation)
- **Operational Desks & Tabs:**
  - **Lab Overview (`/quality`):** Shift testing pulse, pending sampling queue, awaiting QC KPIs, rapid test launchpad.
  - **RM Quality Testing (`/quality/rm-testing`):** Inbound sampling queue, 6-parameter tolerance workbench (Moisture%, Ash%, GCV, Foreign Matter%, Bulk Density, Grade), instant tolerance validation, Approve / Hold / Reject decisions. ID: `QC-YYMMDD-seq`.
  - **FG Quality Testing (`/quality/fg-testing`):** Finished pellet batch testing (8mm diameter, GCV, Moisture%, Ash%, Bulk Density, Fines%), batch dispatch authorization. ID: `FG-QC-YYMMDD-seq`.
  - **COA Reports (`/quality/reports`):** Certificate of Analysis generation, customer spec vs actual matrix, lab digital signatures, and historical test audit ledger.
- **Status Flow:** PENDING → TESTING → APPROVED / HOLD / REJECTED
- **Key Operational Rules:**
  - Rejected raw material MUST NOT become available inventory.
  - HOLD material remains quarantined until authorized release.
  - Only approved FG batches become dispatchable inventory.

### 5. Production Supervisor (`ROLE_PRODUCTION`)
- **Operator Profile:** Mahesh Kadam · Department: Pelletising Plant Line 1 & 2
- **PDF Sections:** 12 (Production Planning), 13 (Material Issue), 14–20 (7 Processing Stages), 21 (FG Batch)
- **Operational Desks & Tabs:**
  - **Production Plans (`/production/plans`):** Shift targets (MT), product specs (8mm), blend formulas. ID: `PRD-YYMMDD-seq`.
  - **Material Issue (`/production/material-issue`):** RM lot deduction and allocation with complete lot-level traceability. ID: `ISS-YYMMDD-seq`.
  - **7-Stage Processing (`/production/processing`):** Stage-wise console covering Cleaning (14), Grinding (15), Drying (16), Blending (17), Pelletisation (18), Cooling (19), Screening (20). Generates `PB-YYMMDD-seq` and `FG-BATCH-YYMMDD-seq`.
  - **Batch History (`/production/batches`):** Historical batch performance, yield analysis, shift downtime logs.
- **Status Flow:** PLANNED → MATERIAL ISSUED → PROCESSING → PELLETISATION → COOLING → SCREENING → PRODUCED → QC PENDING → APPROVED/HOLD/REJECTED → STORED

### 6. Warehouse / Inventory Manager (`ROLE_WAREHOUSE`)
- **Operator Profile:** Nitin Joshi · Department: Raw Yards & Finished Sheds
- **PDF Sections:** 9 (RM Lot Creation), 10 (RM Inventory), 11 (RM Storage), 23 (Packaging), 24 (FG Storage)
- **Operational Desks & Tabs:**
  - **Raw Material Yards (`/inventory/raw-materials`):** Location-wise stock map (Yard A, Warehouse 1, Sheds) with capacity/occupancy telemetry (Sec 11).
  - **Finished Goods Stock (`/inventory/finished-goods`):** Batch-wise FG inventory categorized by Produced → QC Pending → QC Approved → Dispatchable (Sec 24).
  - **Packaging & Bagging (`/inventory/packaging`):** Bagged (25/40/50 kg) or bulk vehicle dispatch logging (Sec 23).
  - **Lot Traceability (`/inventory/lots`):** Complete RM lot ledger (`RMLOT-material-YYMMDD-seq`) linking material, supplier, vehicle, rate, QC report, and location.

### 7. Admin / Super Admin (`ROLE_ADMIN`)
- **Operator Profile:** Adarsh Sharma · Department: System Operations
- **PDF Sections:** 2 (Supplier/Farmer Master), 11 (Storage Locations), 12 (Formulas/Blends), 25 (Customer Master)
- **Operational Desks & Tabs:**
  - **Suppliers Master (`/admin/masters/suppliers`):** Farmer, Trader, Aggregator master directory, purchase & payment history (Sec 2).
  - **Customer Master (`/admin/masters/customers`):** Customer directory, credit terms, delivery locations (Sec 25).
  - **Materials & Storage (`/admin/masters/materials`):** Raw biomass types, FG specs, storage locations & yard bins (Sec 11).
  - **Blend Formulas (`/admin/masters/formulas`):** Raw biomass recipe ratios for pellet blending (Sec 12).
  - **User Access & Roles (`/admin/users`):** Operator roles, access permissions, department assignments.

### 8. Management / Plant Director (`ROLE_MANAGEMENT`)
- **Operator Profile:** Pravin Singhania · Department: Executive Directorate
- **PDF Sections:** 34 (Traceability), 37 (Dashboard KPIs)
- **Operational Desks & Tabs:**
  - **Live Plant KPIs (`/management/dashboard`):** Real-time operational pulse displaying all 11 core KPIs from PDF Sec 37.
  - **Bi-Directional Trace (`/management/traceability`):** Forward (Supplier → RM Lot → Production → FG → Customer) and Reverse (Customer → Dispatch → FG → Production → RM Lot → Supplier) digital explorer (Sec 34).
  - **Cost & Yield (`/management/reports/cost-yield`):** Raw material average cost (₹/MT), production conversion cost, yield and fines analysis.
  - **Plant Reports (`/management/reports`):** Daily executive production, inventory valuation, and dispatch summaries.

---

## Build Order

| Priority | Role                      | Reason                                              |
| -------- | ------------------------- | --------------------------------------------------- |
| 1st      | Admin / Super Admin       | Design system + master data foundation              |
| 2nd      | Gate / Security Operator  | Entry point of operational flow, simple forms        |
| 3rd      | Weighbridge Operator      | Tightly coupled with Gate, small scope              |
| 4th      | QC / Lab Technician       | Unlocks RM → Inventory flow                         |
| 5th      | Warehouse / Inventory Mgr | Central hub, connects inbound & outbound            |
| 6th      | Production Supervisor     | Most complex — benefits from established patterns   |
| 7th      | Sales / Dispatch Manager  | Builds on FG inventory                              |
| 8th      | Management Dashboard      | Last — aggregates data from all modules             |

---

## Folder Structure (Next.js App Router)

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, providers, Lenis)
│   ├── page.tsx                      # Login / Landing
│   ├── gate/                         # Gate / Security Operator (ROLE_GATE_SECURITY)
│   │   ├── layout.tsx                # Shell bound to ROLE_GATE_SECURITY & GateProvider
│   │   ├── page.tsx                  # Gate Dashboard & Operations Hub (/gate)
│   │   ├── tracker/page.tsx          # Live Vehicle Tracker (/gate/tracker)
│   │   ├── entry/page.tsx            # Gate Entry Console (/gate/entry)
│   │   └── exit/page.tsx             # Vehicle Exit Clearance Desk (/gate/exit)
│   ├── weighbridge/                  # Weighbridge Operator (ROLE_WEIGHBRIDGE)
│   │   ├── layout.tsx                # Shell bound to ROLE_WEIGHBRIDGE & WeighbridgeProvider
│   │   ├── page.tsx                  # Live Scale Terminal & Cockpit (/weighbridge)
│   │   └── weighments/page.tsx       # Weight Records History & Slips Ledger (/weighbridge/weighments)
│   ├── quality/                      # QC / Lab Technician (ROLE_QC_LAB)
│   │   ├── layout.tsx                # Shell bound to ROLE_QC_LAB & QualityProvider
│   │   ├── page.tsx                  # Lab Overview & Active Queues (/quality)
│   │   ├── rm-testing/page.tsx       # Raw Material Testing Workbench (/quality/rm-testing)
│   │   ├── fg-testing/page.tsx       # Finished Goods Testing Workbench (/quality/fg-testing)
│   │   └── reports/page.tsx          # COA Console & Test Audit Ledger (/quality/reports)
│   ├── production/                   # Production Supervisor (ROLE_PRODUCTION)
│   │   ├── layout.tsx                # Shell bound to ROLE_PRODUCTION
│   │   ├── plans/page.tsx            # Production Plans (/production/plans)
│   │   ├── material-issue/page.tsx   # Material Issue Request & Lot Allocation (/production/material-issue)
│   │   ├── processing/page.tsx       # 7-Stage Sequential Processing Console (/production/processing)
│   │   └── batches/page.tsx          # Batch History & Shift Downtime (/production/batches)
│   ├── inventory/                    # Warehouse / Inventory Manager (ROLE_WAREHOUSE)
│   │   ├── layout.tsx                # Shell bound to ROLE_WAREHOUSE
│   │   ├── raw-materials/page.tsx    # Raw Material Yards & Location Map (/inventory/raw-materials)
│   │   ├── finished-goods/page.tsx   # Finished Goods Stock Ledger (/inventory/finished-goods)
│   │   ├── packaging/page.tsx        # Packaging & Bagging Console (/inventory/packaging)
│   │   └── lots/page.tsx             # RM Lot Traceability Ledger (/inventory/lots)
│   ├── sales/                        # Sales / Dispatch Manager (ROLE_SALES_DISPATCH)
│   │   ├── layout.tsx                # Shell bound to ROLE_SALES_DISPATCH
│   │   ├── orders/page.tsx           # Sales Orders Workbench (/sales/orders)
│   │   ├── dispatch/page.tsx         # Dispatch Planning & Allocation (/sales/dispatch)
│   │   ├── invoices/page.tsx         # Invoices & Dispatch Documents (/sales/invoices)
│   │   ├── delivery/page.tsx         # Customer Delivery & POD Tracking (/sales/delivery)
│   │   └── payments/page.tsx         # Receivables & Payment Ledger (/sales/payments)
│   ├── admin/                        # Admin / Super Admin (ROLE_ADMIN)
│   │   ├── layout.tsx                # Shell bound to ROLE_ADMIN
│   │   ├── masters/
│   │   │   ├── suppliers/page.tsx    # Supplier / Farmer Master (/admin/masters/suppliers)
│   │   │   ├── customers/page.tsx    # Customer Master (/admin/masters/customers)
│   │   │   ├── materials/page.tsx    # Materials & Storage Locations (/admin/masters/materials)
│   │   │   └── formulas/page.tsx     # Blend Formulas Master (/admin/masters/formulas)
│   │   └── users/page.tsx            # User Access & Roles (/admin/users)
│   └── management/                   # Management / Plant Director (ROLE_MANAGEMENT)
│       ├── layout.tsx                # Shell bound to ROLE_MANAGEMENT
│       ├── dashboard/page.tsx        # 11 Core Plant KPIs Dashboard (/management/dashboard)
│       ├── traceability/page.tsx     # Bi-Directional Digital Traceability Explorer (/management/traceability)
│       └── reports/page.tsx          # Plant Operations & Financial Reports (/management/reports)
├── components/
│   ├── layout/                       # Layout components
│   │   ├── industrial-nav.tsx        # Center-aligned industrial navbar with role switcher
│   │   ├── sidebar.tsx               # Collapsible side drawer for tablet/mobile
│   │   └── smooth-scroll.tsx         # Lenis smooth scrolling wrapper
│   ├── gate/                         # Gate & security operator components
│   ├── weighbridge/                  # Weighbridge operator components & scale indicator
│   ├── quality/                      # QC testing workbenches & COA document generator
│   ├── ui/                           # Primitives (button, input, select, table, badge, modal)
│   └── shared/                       # Cross-functional business components
├── lib/
│   ├── types/                        # Strongly typed TypeScript interfaces
│   ├── context/                      # React Context providers (gate, weighbridge, quality)
│   └── utils/                        # Utility functions
└── styles/
    └── globals.css                   # Tailwind v4 theme + global styles
```

---

## ID Format Reference

All system-generated IDs follow these patterns (from the operational flow document):

| Entity              | Format Example         | Pattern                         |
| ------------------- | ---------------------- | ------------------------------- |
| Supplier            | SUP-000145             | SUP-{sequential}                |
| RM Gate Entry       | RM-GATE-261002-001     | RM-GATE-{YYMMDD}-{seq}         |
| QC Report (RM)      | QC-261002-001          | QC-{YYMMDD}-{seq}              |
| RM Receipt          | RM-261002-001          | RM-{YYMMDD}-{seq}              |
| RM Lot              | RMLOT-GS-261002-001    | RMLOT-{material}-{YYMMDD}-{seq}|
| Production Plan     | PRD-261002-001         | PRD-{YYMMDD}-{seq}             |
| Material Issue      | ISS-261002-001         | ISS-{YYMMDD}-{seq}             |
| Production Batch    | PB-261002-001          | PB-{YYMMDD}-{seq}              |
| FG Batch            | FG-BATCH-261002-001    | FG-BATCH-{YYMMDD}-{seq}        |
| FG QC Report        | FG-QC-261002-001       | FG-QC-{YYMMDD}-{seq}           |
| Sales Order         | SO-261002-015          | SO-{YYMMDD}-{seq}              |
| Dispatch            | DIS-261002-001         | DIS-{YYMMDD}-{seq}             |

---

## Status Workflows Reference

### Raw Material
```
Expected → Arrived → Gross Weighed → Unloaded → QC Pending →
Approved/Hold/Rejected → Tare Weighed → Received → Stored → Issued → Consumed
```

### Production
```
Planned → Material Issued → Processing → Pelletisation → Cooling →
Screening → Produced → QC Pending → Approved/Hold/Rejected → Stored
```

### Finished Goods
```
Produced → QC Pending → Approved → Available → Reserved → Loading →
Dispatched → Delivered
```

### Sales Order
```
Enquiry → Quotation → Order Received → Confirmed → Production/Stock Reserved →
Partially Dispatched → Fully Dispatched → Closed
```

### Payment
```
Invoice Generated → Outstanding → Part Payment → Fully Paid → Closed
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
