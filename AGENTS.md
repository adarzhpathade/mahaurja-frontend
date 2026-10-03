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

- **Awwwards-level UI** — Every screen must feel premium, polished, and visually stunning. No generic or basic-looking interfaces.
- **Mobile-first** — Every page must be fully responsive and optimized for mobile devices.
- **Micro-animations everywhere** — Use Motion for page transitions, staggered reveals, layout animations. Use Tailwind transitions for hover states, focus rings, and subtle interactive feedback.
- **Smooth scrolling** — Lenis for buttery scroll experience across all pages.
- **Status-driven design** — Use color-coded badges, progress indicators, and status pills throughout. Every entity moves through a status workflow, not just static forms.
- **Glassmorphism, gradients, and depth** — Use modern design patterns: subtle glass effects, layered cards with shadows, vibrant gradients, and visual depth.
- **Dark mode ready** — Design with dark mode as a first-class citizen.
- **Typography matters** — Use premium Google Fonts, proper hierarchy (size, weight, spacing), and never rely on browser defaults.

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

### DON'T:
- ❌ Do NOT run lint checks, build checks, or type checks after every step. Only run checks when explicitly asked or at the end of a complete feature.
- ❌ Do NOT use placeholder images — generate real assets using the image generation tool when needed
- ❌ Do NOT create basic/minimal UIs — every component must look premium
- ❌ Do NOT hardcode data — use proper TypeScript types/interfaces even for mock data
- ❌ Do NOT skip animations — every page transition, list render, and interactive element should have motion
- ❌ Do NOT ignore mobile — test every layout mentally for 375px (mobile), 768px (tablet), and 1440px (desktop)

---

## User Roles (8 Total)

Each role has its own dashboard and set of screens. Role-based access control restricts visibility.

### 1. Admin / Super Admin
- **Purpose:** System configuration, user management, master data setup
- **Screens:** User management, role/permission settings, system config, material masters, storage location masters, formula/blend masters, supplier/farmer master
- **Priority:** 🥇 Build first — establishes design system and core UI patterns

### 2. Gate / Security Operator
- **Purpose:** Records vehicle arrivals and exits for both RM and dispatch
- **Screens:** Gate Entry form, Gate Dashboard (live vehicle tracker), Vehicle Exit verification, Document verification
- **Status Flow:** ARRIVED → GATE ENTRY CREATED → WAITING FOR WEIGHMENT → ... → VEHICLE EXIT COMPLETED

### 3. Weighbridge Operator
- **Purpose:** Records gross/tare/net weighments for incoming RM and outgoing dispatch
- **Screens:** Weighment entry form, auto net-weight calculation, weighbridge slip generation, photo/document upload
- **Key Rule:** System auto-calculates Net = Gross − Tare. Never manual.

### 4. QC / Lab Technician
- **Purpose:** Sampling, testing, and approval of both raw materials and finished goods
- **Screens:** QC sample entry, test parameter forms (Moisture%, Ash%, GCV, Bulk Density, Foreign Matter%), approval/hold/reject workflow, QC reports, COA generation
- **Status Flow:** PENDING → TESTING → APPROVED / HOLD / REJECTED
- **Key Rule:** Rejected/Hold material must NOT become available inventory.

### 5. Production Supervisor / Operator
- **Purpose:** Manages entire production lifecycle
- **Screens:** Production Plan creation, Material Issue requests, stage-wise logging (Cleaning → Grinding → Drying → Blending → Pelletisation → Cooling → Screening), Production Batch creation, machine/shift/operator tracking, downtime logging
- **Status Flow:** PLANNED → MATERIAL ISSUED → PROCESSING → PELLETISATION → COOLING → SCREENING → PRODUCED → QC PENDING → APPROVED/HOLD/REJECTED → STORED

### 6. Warehouse / Inventory Manager
- **Purpose:** Manages RM inventory, FG inventory, storage locations, packaging, stock tracking
- **Screens:** RM Inventory dashboard (location-wise), FG Inventory dashboard, RM Lot management, Packaging/bagging entry, stock movements, lot traceability view
- **Key Feature:** Location-wise inventory (Yard A, Warehouse 1, Shed 2, etc.)

### 7. Sales / Dispatch Manager
- **Purpose:** Manages customer orders, dispatch planning, loading, invoicing, delivery, payments
- **Screens:** Customer Master, Sales Order CRUD, Dispatch planning, Loading transaction, Invoice & document generation (e-way bill, delivery challan, LR), Delivery tracking, Payment/receivable tracking
- **Status Flows:**
  - Sales: ENQUIRY → QUOTATION → ORDER RECEIVED → CONFIRMED → PARTIALLY DISPATCHED → FULLY DISPATCHED → CLOSED
  - Dispatch: DISPATCHED → IN TRANSIT → DELIVERED → POD RECEIVED
  - Payment: INVOICE GENERATED → OUTSTANDING → PART PAYMENT → FULLY PAID → CLOSED

### 8. Management / Plant Director
- **Purpose:** High-level visibility into entire plant operation
- **Screens:** Live Management Dashboard, full traceability view, analytics/reports
- **Dashboard KPIs:** Vehicles inside plant, RM awaiting QC, RM available stock, Production today vs target, FG awaiting QC, FG stock, Pending orders, Today's dispatches, Outstanding receivables, Average RM cost, Production cost per MT
- **Key Feature:** Bi-directional traceability (Customer ↔ Supplier)

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
