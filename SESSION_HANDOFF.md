# 🚀 MAHAURJA – Agent Session Handoff & Implementation Blueprint

> **CRITICAL INSTRUCTION FOR THE NEXT AGENT:**  
> Read this entire document before writing any code or answering the user.  
> The user does **NOT** want to explain design decisions, layouts, or requirements again.  
> All visual standards, layout conventions, typography, and mobile responsive rules have already been finalized and approved across **Gate Operations** and **QC Lab**.  
> Your task is to apply these exact same standards to the remaining 6 operational modules methodically, one by one.

---

## 📌 1. Project Context & Philosophy

- **Project:** Mahaurja Plant Operational Management System for **Bharat Industrial & Renewables LLP**.
- **Industry:** Biomass Pellet Manufacturing & Clean Energy.
- **Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lenis, Lucide React.
- **Color Palette (80-15-5 Rule):**
  - **80% Grays & Neutrals:** Canvas (`#F4F5F7`), borders (`#E2E8F0` / `border-neutral-300`), unselected chips (`#ECEFF2`), text (`#0F172A` / `#64748B`), pitch charcoal (`#18181B`).
  - **15% Pure White Surfaces:** Elevated cards, modal dialogs, tooltips, and data entry inputs (`#FFFFFF`).
  - **5% Bio-Emerald Green:** Surgical accents ONLY (`#059669` primary, `#10B981` accent, `#047857` hover, `#ECFDF5` mint tint). Used strictly for active bays, primary submission buttons, and approved status pills.
- **Typography:** Switzer font family. Heavy, authoritative command headings (`font-black tracking-tight text-neutral-900`), crisp uppercase labels (`text-xs font-bold uppercase tracking-wider text-neutral-800`), monospace tabular numbers (`font-mono tabular-nums`).

---

## 🚦 2. Current System Status

All 8 operational roles and their underlying contexts, mock data, and routing exist and compile with **0 TypeScript errors** (`npx tsc --noEmit`).

### ✅ Fully Harmonized Modules (8 of 8 Roles — 100% Complete):
1. **Gate / Security Operator (`/gate`)** – 100% Done
   - `src/components/gate/gate-home.tsx` (Dashboard & expected arrivals)
   - `src/components/gate/live-vehicle-tracker.tsx` (Interactive 3D axle multi-compartment visualizer)
   - `src/components/gate/gate-entry-modal.tsx` (Zero-scroll < 650px gate entry console)
   - `src/components/gate/gate-exit.tsx` (Physical security checklist & clearance)
2. **Quality Control Lab (`/quality`)** – 100% Done
   - `src/components/quality/qc-overview.tsx` (Lab pulse, punchy KPI cards, pending sampling)
   - `src/components/quality/qc-records-ledger.tsx` (Single Command Header, count badge, cards default, zero-scroll mobile cards)
   - `src/components/quality/rm-testing-workbench.tsx` (6-parameter tolerance workbench, responsive selectors)
   - `src/components/quality/fg-testing-workbench.tsx` (Finished goods testing console, batch release)
3. **Weighbridge Operator (`/weighbridge`)** – 100% Done
   - `src/components/weighbridge/weighbridge-home.tsx` (Dual-scale cockpit & waiting queue)
   - `src/components/weighbridge/weighments-ledger.tsx` (Command Header, count badge, cards/table, official slips)
4. **Sales & Dispatch Manager (`/sales`)** – 100% Done
   - `src/components/sales/sales-orders-view.tsx`
   - `src/components/sales/dispatch-planning-view.tsx`
   - `src/components/sales/invoices-docs-view.tsx`
   - `src/components/sales/delivery-pod-view.tsx`
   - `src/components/sales/payments-ledger-view.tsx`
5. **Production Supervisor (`/production`)** – 100% Done
   - `src/components/production/production-plans-view.tsx`
   - `src/components/production/material-issue-workbench.tsx`
   - `src/components/production/processing-stages-console.tsx`
   - `src/components/production/batch-history-view.tsx`
6. **Warehouse / Inventory Manager (`/inventory`)** – 100% Done
   - `src/components/inventory/raw-materials-view.tsx`
   - `src/components/inventory/finished-goods-view.tsx`
   - `src/components/inventory/packaging-workbench.tsx`
   - `src/components/inventory/lots-traceability-view.tsx`
7. **Admin / Super Admin (`/admin`)** – 100% Done
   - `src/components/admin/suppliers-master-view.tsx`
   - `src/components/admin/customers-master-view.tsx`
   - `src/components/admin/materials-storage-view.tsx`
   - `src/components/admin/formulas-master-view.tsx`
   - `src/components/admin/users-access-view.tsx`
8. **Management Directorate (`/management`)** – 100% Done
   - `src/components/management/management-dashboard-view.tsx`
   - `src/components/management/traceability-explorer-view.tsx`
   - `src/components/management/cost-yield-view.tsx`
   - `src/components/management/plant-reports-view.tsx`

---

## 📐 3. The 6 Core UI Standards (Strictly Enforced)

Every screen you touch MUST follow these 6 standards without exception:

### Standard 1: Clean Command Header (Zero Banners & Zero Subtitle Clutter)
Every page MUST sit directly on the `#F4F5F7` canvas with a crisp hairline bottom border.
- **NEVER** wrap the header in a white card box (`bg-white border rounded shadow`).
- **NEVER** include PDF section numbers (e.g. `PDF Section 6...`) or multi-line descriptive text.
- **Format:**
```tsx
<div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div className="flex items-center gap-3">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
      {Page Title}
    </h1>
    {/* Optional count badge for ledgers / rosters */}
    {itemCount !== undefined && (
      <span className="text-[11px] font-bold font-mono px-2 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">
        {itemCount}
      </span>
    )}
  </div>

  {/* Actions: Primary action button (e.g. + New ...) OR [ Cards ] [ Table ] toggle */}
</div>
```

---

### Standard 2: Elimination of Redundant Subheadings on Ledger Pages
On screens that host a single primary queue, ledger, or table (such as `Weighments Ledger`, `Sales Orders`, `Customer Directory`, `Payments`):
- **BEFORE (Wrong):**
  - Page `<h1>QC Reports & History</h1>`
  - Then directly below: `<div className="bg-neutral-200/50 p-3"><h2>QC TEST HISTORY & RECORDS</h2> [ Cards ] [ Table ]</div>`
  *(This duplicates the header, clutters the UI, and creates cognitive noise).*
- **AFTER (Correct):**
  - Promote the count badge `[ 7 ]` and the segmented toggle `[ Cards ] [ Table ]` directly into the **main `<h1>` Command Header**.
  - Directly beneath the hairline border, render the search bar and filter controls.
  - Delete the redundant second header bar completely.

---

### Standard 3: Strict Ban on Duplicate Nav Buttons in Page Headers
The top navbar (`components/layout/industrial-nav.tsx`) already contains the desk tabs (e.g., `[ Overview ] [ RM Testing ] [ FG Testing ] [ Reports ]`) right above the page.
- **NEVER** place header buttons that switch between tabs.
- Header buttons are reserved **exclusively for primary creation actions**:
  - `+ New Gate Entry`
  - `+ Capture Weight`
  - `+ New Sales Order`
  - `+ Create Dispatch Plan`
  - `+ Issue Material`
  - `+ Add Supplier`
  - `+ Add Customer`
- Primary button styling:
```tsx
<button className="h-10 px-4 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer">
  <Plus className="w-4 h-4" />
  <span>New Action</span>
</button>
```

---

### Standard 4: Mandatory Mobile Responsive Cards (Zero Horizontal Table Bleed)
Plant operators and supervisors frequently use smartphones on-site.
- **Wide data tables must NEVER be rendered on mobile viewports (≤ 640px).**
- Add `hidden sm:block` (or `hidden sm:table`) to the table container.
- Mobile devices **MUST ALWAYS render responsive single-column cards** (`grid grid-cols-1 sm:hidden gap-3` or conditionally via `viewMode === "cards"`).
- Desktop uses the segmented switcher (`[ Cards ] [ Table ]`) to toggle freely.
- View switcher component:
```tsx
<div className="hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10">
  <button
    type="button"
    onClick={() => setViewMode("cards")}
    className={`px-3 py-2 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] cursor-pointer transition-colors ${
      viewMode === "cards"
        ? "bg-[#18181B] text-white"
        : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
    }`}
  >
    <LayoutGrid className="w-3.5 h-3.5" />
    <span>Cards</span>
  </button>
  <button
    type="button"
    onClick={() => setViewMode("table")}
    className={`px-3 py-2 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] cursor-pointer transition-colors ${
      viewMode === "table"
        ? "bg-[#18181B] text-white"
        : "bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200"
    }`}
  >
    <TableIcon className="w-3.5 h-3.5" />
    <span>Table</span>
  </button>
</div>
```
- Responsive Card Structure:
```tsx
<div className="p-4 bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all flex flex-col justify-between">
  {/* Card Header: Identifier + Direction Badge */}
  <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-2.5 mb-3">
    <span className="font-mono font-bold text-xs bg-neutral-100 border border-neutral-300 px-2 py-0.5 text-neutral-900">
      {id}
    </span>
    <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-emerald-300 bg-emerald-50 text-[#047857]">
      {badgeText}
    </span>
  </div>

  {/* Card Details: 2-column key-values */}
  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
    <div>
      <span className="text-[10px] font-bold uppercase text-neutral-500 block">Field 1</span>
      <span className="font-semibold text-neutral-900">{val1}</span>
    </div>
    <div>
      <span className="text-[10px] font-bold uppercase text-neutral-500 block">Field 2</span>
      <span className="font-semibold text-neutral-900">{val2}</span>
    </div>
  </div>

  {/* Card Footer: Status Pill + Action Button */}
  <div className="pt-2.5 border-t border-neutral-200 flex items-center justify-between">
    <span className="text-[10px] font-bold px-2 py-0.5 uppercase border ...">
      {status}
    </span>
    <button className="h-8 px-3 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold uppercase">
      View Details
    </button>
  </div>
</div>
```

---

### Standard 5: Punchy Plain English Labels on Metric Cards
On dashboard overview screens:
- Use **1–2 short, punchy Plain English words** for metric card labels.
- **NEVER** use long academic strings like `RAW MATERIAL AWAITING QC` or `QUALITY COMPLIANCE RATE` that truncate with ellipsis (`...`).
- Reference Table:

| ❌ Jargon / Long String | ✅ Plain English Punchy Label |
|---|---|
| Raw Material Awaiting QC | **PENDING RM** |
| Finished Goods Awaiting Testing | **PENDING FG** |
| Quality Compliance Pass Rate | **PASS RATE** |
| Total Tests Conducted Today | **TESTED TODAY** |
| Vehicles Currently In Plant | **INSIDE PLANT** |
| Consignments Cleared For Exit | **READY FOR EXIT** |
| Active Weighment Inbound Queue | **WAITING WEIGHMENT** |
| Total Raw Biomass Stored MT | **TOTAL STOCK** |
| Shift Production Target vs Actual | **OUTPUT TODAY** |
| Total Accounts Receivable Due | **OUTSTANDING** |

- Format of Metric Card:
```tsx
<div className="p-4 bg-white/40 border border-neutral-300 hover:border-neutral-900 transition-all flex flex-col justify-between">
  <div className="flex items-center justify-between gap-2 mb-2">
    <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 truncate">
      {punchyLabel}
    </span>
    <Icon className="w-4 h-4 text-[#059669] shrink-0" />
  </div>
  <div className="flex items-baseline gap-2">
    <span className="text-2xl sm:text-3xl font-black text-neutral-900 tabular-nums">
      {value}
    </span>
    {unit && <span className="text-xs text-neutral-400 font-medium">{unit}</span>}
  </div>
</div>
```

---

### Standard 6: Responsive Dropdowns & Filter Popups
- Workbench selectors (e.g., sample picker, batch picker, formula selector) MUST include:
  ```tsx
  <div className="flex items-center gap-2">
    <label className="text-[11px] font-bold uppercase text-neutral-600 shrink-0">Select:</label>
    <select className="flex-1 min-w-0 h-10 px-3 bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 truncate">
      ...
    </select>
  </div>
  ```
  *(Adding `flex-1 min-w-0 truncate` and `shrink-0` ensures long strings do not bleed past screen boundaries on mobile).*
- Search bars on mobile must include a square filter toggle button:
  ```tsx
  <button
    onClick={() => setShowMobileFilters(true)}
    className="sm:hidden w-10 h-10 flex items-center justify-center border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 shrink-0"
  >
    <SlidersHorizontal className="w-4 h-4" />
  </button>
  ```

---

## 📋 4. Step-by-Step Execution Plan for Remaining 6 Modules

Follow this exact order. Check off each sub-item as you update it.

### 🔷 Module 1: Weighbridge Operator (`/weighbridge`)
**Files:**
- `src/components/weighbridge/weighbridge-home.tsx` (Scale Terminal)
- `src/components/weighbridge/weighments-ledger.tsx` (Weight Records Ledger)

**Tasks:**
1. In `weighbridge-home.tsx`:
   - Verify single command header `Scale Terminal` on canvas with live digital clock.
   - Clean up any descriptive subtitle paragraphs.
   - For the queue at the bottom: verify `[ Cards ] [ Table ]` view switcher with mobile strictly rendering cards (`hidden sm:block` on table).
2. In `weighments-ledger.tsx`:
   - Single Command Header: `Weight Records` with count badge `[ N ]` and `[ Cards ] [ Table ]` toggle in the same header row.
   - Delete any duplicate second subheading bar.
   - Enforce `hidden sm:block` on the 8-column table; mobile always renders responsive cards.
   - Verify search bar and direction filter (`All Directions`, `Inbound RM`, `Outbound FG`).

---

### 🔷 Module 2: Sales & Dispatch (`/sales`)
**Files:**
- `src/components/sales/sales-orders-view.tsx`
- `src/components/sales/dispatch-planning-view.tsx`
- `src/components/sales/invoices-docs-view.tsx`
- `src/components/sales/delivery-pod-view.tsx`
- `src/components/sales/payments-ledger-view.tsx`

**Tasks:**
1. In `sales-orders-view.tsx`:
   - Command Header: `Sales Orders` with count badge, `[ Cards ] [ Table ]` toggle, and `+ New Sales Order` primary button (`bg-[#059669]`).
   - Remove redundant second subheadings. Mobile renders cards only.
2. In `dispatch-planning-view.tsx`:
   - Command Header: `Dispatch Planning` with count badge and `+ Create Dispatch Plan` button.
   - Responsive cards for vehicle allocations on mobile.
3. In `invoices-docs-view.tsx`:
   - Command Header: `Invoices & Documentation` with count badge and `[ Cards ] [ Table ]`.
   - Remove duplicate subheadings.
4. In `delivery-pod-view.tsx`:
   - Command Header: `Delivery Tracking & POD` with count badge and `[ Cards ] [ Table ]`.
5. In `payments-ledger-view.tsx`:
   - Command Header: `Customer Payments` with count badge and `[ Cards ] [ Table ]`.

---

### 🔷 Module 3: Production Supervisor (`/production`)
**Files:**
- `src/components/production/production-plans-view.tsx`
- `src/components/production/material-issue-view.tsx`
- `src/components/production/processing-view.tsx`
- `src/components/production/batch-history-view.tsx`

**Tasks:**
1. In `production-plans-view.tsx`:
   - Command Header: `Production Planning` with count badge, `[ Cards ] [ Table ]`, and `+ New Plan` button.
2. In `material-issue-view.tsx`:
   - Command Header: `Raw Material Issue` with count badge and `+ Issue Material` button.
3. In `processing-view.tsx`:
   - Command Header: `Pellet Processing Console` with line status indicator (`Line 1 Active`).
   - Keep 7-stage console clean and responsive.
4. In `batch-history-view.tsx`:
   - Command Header: `Finished Goods Batches` with count badge and `[ Cards ] [ Table ]`.
   - Remove duplicate subheadings. Mobile renders cards only.

---

### 🔷 Module 4: Warehouse / Inventory Manager (`/inventory`)
**Files:**
- `src/components/inventory/raw-materials-view.tsx`
- `src/components/inventory/finished-goods-view.tsx`
- `src/components/inventory/packaging-view.tsx`
- `src/components/inventory/lot-traceability-view.tsx`

**Tasks:**
1. In `raw-materials-view.tsx`:
   - Command Header: `Raw Material Yards` with total capacity telemetry.
   - Clean location cards.
2. In `finished-goods-view.tsx`:
   - Command Header: `Finished Goods Stock` with count badge and `[ Cards ] [ Table ]`.
3. In `packaging-view.tsx`:
   - Command Header: `Bagging & Packaging` with `+ Record Bagging` button.
4. In `lot-traceability-view.tsx`:
   - Command Header: `RM Lot Traceability` with count badge and `[ Cards ] [ Table ]`.
   - Remove duplicate subheadings. Mobile renders cards only.

---

### 🔷 Module 5: Admin Masters (`/admin`)
**Files:**
- `src/components/admin/suppliers-master-view.tsx`
- `src/components/admin/customers-master-view.tsx`
- `src/components/admin/materials-storage-view.tsx`
- `src/components/admin/formulas-master-view.tsx`
- `src/components/admin/users-access-view.tsx`

**Tasks:**
1. In `suppliers-master-view.tsx`:
   - Command Header: `Suppliers & Farmers` with count badge, `[ Cards ] [ Table ]`, and `+ Add Supplier` button.
   - Remove redundant second subheader.
2. In `customers-master-view.tsx`:
   - Command Header: `Customer Directory` with count badge, `[ Cards ] [ Table ]`, and `+ Add Customer` button.
3. In `materials-storage-view.tsx`:
   - Command Header: `Materials & Yards` with `+ Add Material` button.
4. In `formulas-master-view.tsx`:
   - Command Header: `Blend Formulas` with `+ New Formula` button.
5. In `users-access-view.tsx`:
   - Command Header: `Personnel & Shifts` with `+ Add User` button.

---

### 🔷 Module 6: Management Directorate (`/management`)
**Files:**
- `src/components/management/management-dashboard-view.tsx`
- `src/components/management/traceability-explorer-view.tsx`
- `src/components/management/cost-yield-view.tsx`
- `src/components/management/management-reports-view.tsx`

**Tasks:**
1. In `management-dashboard-view.tsx`:
   - Command Header: `Executive Dashboard`.
   - Metric cards: apply punchy 1–2 word labels (`INSIDE PLANT`, `RM STOCK`, `OUTPUT TODAY`, `DISPATCHES`, `OUTSTANDING`).
   - Clean card layout, no text clipping.
2. In `traceability-explorer-view.tsx`:
   - Command Header: `Digital Traceability Lineage`.
   - Responsive flow node chain.
3. In `cost-yield-view.tsx` & `management-reports-view.tsx`:
   - Standard Command Headers directly on canvas.

---

## 🛠️ 5. Quality & Verification Workflow

Before considering any module complete:
1. **No Lint / Type Errors:**
   ```bash
   npx tsc --noEmit
   ```
   Must return code 0 with 0 errors.
2. **Mental Responsive Test:**
   - 375px (Mobile iPhone SE): Are tables hidden? Do cards render with zero horizontal scroll? Are dropdowns truncated properly?
   - 768px (Tablet): Are grids 2-column?
   - 1280px+ (Desktop): Does the Command Header look bold and authoritative? Is desktop zero-scroll preserved?
3. **Commit Rule:** Commit only after completing full milestones or when instructed by the user.

---

> **You are now fully equipped. Follow the checklist above methodically without requesting repeat explanations.**
