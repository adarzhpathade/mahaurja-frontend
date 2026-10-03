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
- **No Kiosk / No Tile Grid** — Do NOT reduce screens to 4–6 button kiosk tile grids or push all operations exclusively into popup modals. Preserve the multi-panel, high-productivity industrial layout matching the current codebase (e.g., `gate-home.tsx`, `weighbridge-home.tsx`).
- **Mobile-first & Responsive** — Every page must be fully responsive and adapt smoothly across mobile devices (375px+), tablets, and wide industrial desktop consoles.
- **Micro-animations everywhere** — Use Motion for page transitions, staggered reveals, layout animations, and tab transitions. Use Tailwind transitions for hover states, focus rings, and subtle interactive feedback.
- **Smooth scrolling** — Lenis for buttery scroll experience across all pages.
- **Status-driven design** — Use color-coded badges, progress indicators, and status pills throughout. Every entity moves through a defined status workflow, not just static forms.
- **Glassmorphism, gradients, and depth** — Use modern design patterns: subtle glass effects, layered cards with shadows, vibrant gradients, and visual depth.
- **Dark mode ready** — Design with dark mode as a first-class citizen.
- **Typography matters** — Use premium typography (Switzer), proper hierarchy (size, weight, spacing), and never rely on browser defaults.

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

### DON'T:
- ❌ Do NOT run lint checks, build checks, or type checks after every step. Only run checks when explicitly asked or at the end of a complete feature.
- ❌ Do NOT use placeholder images — generate real assets using the image generation tool when needed
- ❌ Do NOT create basic/minimal UIs or dumbed-down kiosk tile grids — every screen and component must look premium and operational
- ❌ Do NOT hardcode data — use proper TypeScript types/interfaces even for mock data
- ❌ Do NOT skip animations — every page transition, list render, and interactive element should have motion
- ❌ Do NOT ignore mobile — test every layout mentally for 375px (mobile), 768px (tablet), and 1440px (desktop)

---

## User Roles (8 Total)

Each role has its own comprehensive operational workbench and dedicated screens. Role-based access control restricts visibility.

### 1. Admin / Super Admin
- **Purpose:** System configuration, user management, master data setup
- **PDF Sections:** 2 (Supplier/Farmer Master), 11 (Storage Locations), 12 (Formulas/Blends), 25 (Customer Master)
- **Screens:** User management, role/permission settings, system config, material masters, storage location masters, formula/blend masters, supplier/farmer master
- **Priority:** 🥇 Build first — establishes design system and core UI patterns

### 2. Gate / Security Operator
- **Purpose:** Records vehicle arrivals and exits for both RM and dispatch
- **PDF Sections:** 3 (Vehicle Arrival & Gate Entry), 27 (Dispatch Vehicle Arrival), 31 (Vehicle Exit)
- **Screens:**
  - **Gate Entry Console:** Date, Time, Vehicle No, Driver Name & Mobile, Supplier (dropdown), Material (dropdown), Purpose, PO Reference, Expected Quantity, Security Remarks, Direction (Inbound RM / Outbound FG). Auto-generates ID: `RM-GATE-YYMMDD-seq`
  - **Live Gate Dashboard & Vehicle Tracker:** Visual plant tracking, arrival monitoring, dwell time counters, approaching/delayed alerts
  - **Vehicle Exit Verification:** Exit clearance checklist (verify weighbridge slip for RM exit; verify Vehicle, Quantity, Invoice, Dispatch docs, Customer, and Authorization for FG exit)
  - **Gate Operations Ledger:** Real-time log of today's gate entries and exits with status badges
- **Status Flow:** ARRIVED → GATE ENTRY CREATED → WAITING FOR WEIGHMENT → ... → VEHICLE EXIT COMPLETED

### 3. Weighbridge Operator
- **Purpose:** Records gross/tare/net weighments for incoming RM and outgoing dispatch
- **PDF Sections:** 4 (Gross Weighment), 7 (Tare Weighment), 29 (Dispatch Weighment), 30 (Weighbridge Slip)
- **Screens:**
  - **Weighment Capture Workbench:** Dual platform support, digital scale indicator with live stability & motion status, axle load distribution, gross & tare capture
  - **Auto Net-Weight Calculation:** Net = Gross − Tare auto-calculated by system (strictly non-editable by operator)
  - **Weighbridge Slip Generation:** Printable official WB slips with company header, vehicle details, gross/tare/net timestamps, and operator signature fields
  - **Weighment Records & History:** Searchable, filterable archive of all completed weighments
- **Key Rule:** System auto-calculates Net = Gross − Tare. Never manual.

### 4. QC / Lab Technician
- **Purpose:** Sampling, testing, and approval of both raw materials and finished goods
- **PDF Sections:** 6 (Sampling & QC), 22 (Final QC for FG), 30 (COA Generation)
- **Screens:**
  - **RM Testing Workbench:** Moisture%, Ash%, GCV, Foreign Matter%, Bulk Density, Material Grade testing form with instant tolerance validation; Approve / Hold / Reject decisions. ID: `QC-YYMMDD-seq`
  - **FG Testing Workbench:** GCV, Moisture%, Ash%, Bulk Density, Pellet Diameter, Fines%, customer-specific specs. ID: `FG-QC-YYMMDD-seq`
  - **QC Reports & COA Console:** Searchable test repository and Certificate of Analysis (COA) generator for approved FG batches
  - **Sample Audit History:** Historical logs with lab technician signatures and status tracking
- **Status Flow:** PENDING → TESTING → APPROVED / HOLD / REJECTED
- **Key Rules:**
  - Rejected material must NOT become available inventory
  - HOLD material must remain blocked until authorised release
  - Only approved FG should become dispatchable inventory

### 5. Production Supervisor / Operator
- **Purpose:** Manages entire production lifecycle across all 7 processing stages
- **PDF Sections:** 12 (Production Planning), 13 (Material Issue), 14–20 (7 Processing Stages), 21 (FG Batch)
- **Screens:**
  - **Production Planning:** Shift, target quantity (MT), product specification (e.g., 8mm pellet), formula/blend selection. ID: `PRD-YYMMDD-seq`
  - **Material Issue Request & Lot Allocation:** Allocation of RM lots to active plan, deducting inventory with full lot-level traceability. ID: `ISS-YYMMDD-seq`
  - **Stage-Wise Production Console (7 Sequential Stages):**
    - Stage 1 — Cleaning *(Sec 14)*: Input qty, Output qty, Rejected qty, Loss
    - Stage 2 — Grinding *(Sec 15)*: Machine, Start/End time, Input, Output, Operator, Shift, Downtime
    - Stage 3 — Drying *(Sec 16)*: Input, Output, Moisture before/after, Dryer used, Loss
    - Stage 4 — Blending *(Sec 17)*: Formula ID, RM lots, Actual quantities, Target quantities, Operator
    - Stage 5 — Pelletisation *(Sec 18)*: Batch, Machine, Shift, Start/End, Input, Output, Pellet diameter, Operator, Downtime
    - Stage 6 — Cooling *(Sec 19)*: Batch, Input, Output, Start/End, Machine, Operator, Loss
    - Stage 7 — Screening *(Sec 20)*: Good production qty, Fines qty, Rejected/Recycle qty
    Creates Production Batch `PB-YYMMDD-seq` and FG Batch `FG-BATCH-YYMMDD-seq`
  - **Active Batch Monitor & Shift Downtime Tracker:** Live batch progress, machine uptime, operator assignment
  - **Production Batch History & Lot Traceability:** Historical batch performance, yield analysis, formula compliance
- **Status Flow:** PLANNED → MATERIAL ISSUED → PROCESSING → PELLETISATION → COOLING → SCREENING → PRODUCED → QC PENDING → APPROVED/HOLD/REJECTED → STORED

### 6. Warehouse / Inventory Manager
- **Purpose:** Manages RM inventory, FG inventory, storage locations, packaging, stock tracking
- **PDF Sections:** 9 (RM Lot Creation), 10 (RM Inventory), 11 (RM Storage), 23 (Packaging), 24 (FG Storage)
- **Screens:**
  - **Location-Wise RM Inventory Dashboard:** Visual layout of Yard A, Warehouse 1, Sheds, with capacity & occupancy metrics (Sec 11)
  - **RM Lot Traceability Ledger:** Material, Supplier, Vehicle, Date, Quantity, Rate, QC Report, QC parameters, Storage location, Status (Sec 9)
  - **FG Inventory Console:** Grouped by FG Batch, product diameter, QC status (Produced → QC Pending → QC Approved → Dispatchable) (Sec 24)
  - **Packaging & Bagging Workbench:** Bagged (25/40/50 kg), Bulk, or custom packaging entry, bag counting, date tagging (Sec 23)
  - **Stock Movement Ledger:** Complete real-time audit trail of Receipts, Issues, and Dispatches

### 7. Sales / Dispatch Manager
- **Purpose:** Manages customer orders, dispatch planning, loading, invoicing, delivery, payments
- **PDF Sections:** 25 (Sales Order), 26 (Dispatch Planning), 27 (Dispatch Vehicle), 28 (Loading), 29 (Dispatch Weighment), 30 (Invoice & Docs), 32 (Customer Delivery), 33 (Payment)
- **Screens:**
  - **Sales Order Workbench:** Customer selection, order status, required date, rate (₹/MT), quantity, specs. ID: `SO-YYMMDD-seq`
  - **Dispatch Planning & Allocation:** Check approved FG stock against orders, allocate FG batches to transport vehicles with full customer-to-batch linkage (Sec 28). ID: `DIS-YYMMDD-seq`
  - **Loading & Inspection Console:** Vehicle loading verification, tare/gross dispatch weighment coordination
  - **Invoice & Dispatch Document Suite:** Automated generation and archival of Sales Invoice, Delivery Challan, e-Way Bill, Weighbridge Slip, LR/Transport document, COA (Sec 30)
  - **Customer Delivery & POD Tracking:** In-transit tracking, delivery confirmation, Proof of Delivery (POD) upload, feedback logging (Sec 32)
  - **Receivables & Payment Ledger:** Invoice payment tracking (Invoice Generated → Outstanding → Part Payment → Fully Paid → Closed) (Sec 33)
- **Status Flows:**
  - Sales: NEW → CONFIRMED → PARTIALLY DISPATCHED → FULLY DISPATCHED → CLOSED
  - Dispatch: DISPATCHED → IN TRANSIT → DELIVERED → POD RECEIVED
  - Payment: INVOICE GENERATED → OUTSTANDING → PART PAYMENT → FULLY PAID → CLOSED

### 8. Management / Plant Director
- **Purpose:** High-level operational visibility, end-to-end traceability, financial analytics
- **PDF Sections:** 34 (Traceability), 37 (Dashboard KPIs)
- **Screens:**
  - **Executive Operational Dashboard:** Exact 11 core KPIs from PDF Sec 37:
    - Vehicles Inside Plant
    - Raw Material Awaiting QC
    - Raw Material Available (MT)
    - Production Today vs Production Target
    - FG Awaiting QC (MT)
    - Finished Goods Stock (MT)
    - Orders Pending (MT)
    - Dispatches Today (count + MT)
    - Outstanding Receivables (₹)
    - Raw Material Average Cost (₹/MT)
    - Production Cost (₹/MT)
  - **Bi-Directional Digital Traceability Explorer (PDF Sec 34):**
    - Forward Trace: Supplier → RM Lot → Production Batch → FG Batch → Dispatch → Customer
    - Reverse Trace: Customer → Dispatch → FG Batch → Production Batch → RM Lot → Supplier
  - **Plant Operational & Financial Reports:** Daily production, inventory valuation, sales fulfillment, yield & loss analysis, export tools

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
│   ├── (auth)/
│   │   ├── login/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Dashboard shell (sidebar + topbar)
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   ├── masters/
│   │   │   │   ├── suppliers/
│   │   │   │   ├── materials/
│   │   │   │   ├── storage-locations/
│   │   │   │   └── formulas/
│   │   │   └── settings/
│   │   ├── gate/
│   │   │   ├── entries/
│   │   │   ├── exits/
│   │   │   └── dashboard/
│   │   ├── weighbridge/
│   │   │   ├── weighments/
│   │   │   └── slips/
│   │   ├── quality/
│   │   │   ├── rm-testing/
│   │   │   ├── fg-testing/
│   │   │   └── reports/
│   │   ├── production/
│   │   │   ├── plans/
│   │   │   ├── material-issue/
│   │   │   ├── processing/
│   │   │   ├── batches/
│   │   │   └── downtime/
│   │   ├── inventory/
│   │   │   ├── raw-materials/
│   │   │   ├── finished-goods/
│   │   │   ├── lots/
│   │   │   └── packaging/
│   │   ├── sales/
│   │   │   ├── customers/
│   │   │   ├── orders/
│   │   │   ├── dispatch/
│   │   │   ├── invoices/
│   │   │   ├── delivery/
│   │   │   └── payments/
│   │   └── management/
│   │       ├── dashboard/
│   │       ├── traceability/
│   │       └── reports/
├── components/
│   ├── ui/                           # Shared UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── modal.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── layout/                       # Layout components
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── mobile-nav.tsx
│   │   └── page-header.tsx
│   └── shared/                       # Shared business components
│       ├── status-badge.tsx
│       ├── traceability-chain.tsx
│       ├── kpi-card.tsx
│       └── ...
├── lib/
│   ├── types/                        # TypeScript interfaces
│   ├── utils/                        # Utility functions
│   ├── constants/                    # App constants, status enums
│   └── hooks/                        # Custom React hooks
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
