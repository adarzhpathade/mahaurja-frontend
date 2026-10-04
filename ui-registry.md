# 🎨 MAHAURJA – UI Registry

> A living document that captures the visual patterns, component specs, and design tokens used across the app.
> Updated as components are built to ensure visual consistency.

---

## Design Tokens (Tailwind v4)

### Colors (80% Grays, 15% White, 5% Surgical Bio-Emerald)
```css
/* Core Theme Tokens */
--color-canvas: #f4f5f7;            /* Mist Page Background */
--color-surface: #ffffff;           /* White Elevated Cards / Tables */
--color-surface-subtle: #f8f9fa;    /* Header & Panel Insets */
--color-surface-muted: #eceff2;     /* Unselected Loaded Bays / Chips */
--color-border: #e2e8f0;            /* 1px Hairline Lines */
--color-charcoal: #18181b;          /* Active Nav Pill, Chassis, Pitch Charcoal */

/* Surgical Accents (Strictly for Selected Items & Focal Actions) */
--color-primary: #059669;           /* Bio-Emerald (#059669) */
--color-primary-hover: #047857;     /* Deep Emerald Hover */
--color-accent: #10b981;            /* Vibrant Bio-Green (#10b981) */
--color-accent-subtle: #ecfdf5;     /* Soft Mint Tint */

/* Typography */
--color-foreground: #0f172a;        /* Deep Slate Headings & Values */
--color-foreground-muted: #64748b;  /* Cool Slate Secondary Labels */

/* Status Workflows */
--color-status-success: #16a34a;    /* Complete / Approved */
--color-status-pending: #f59e0b;    /* In Transit / Testing / Pending */
--color-status-hold: #f97316;       /* Quarantined / On Hold */
--color-status-danger: #dc2626;     /* Failed / Downtime Alert */
```

### Typography
```
Font Family: Switzer (local WOFF2 fonts in /fonts & /src/fonts)
CSS Variable: var(--font-switzer) / var(--font-sans)
Weights:
  - 400 (Regular): Body, descriptions, metadata
  - 500 (Medium): Table cells, buttons, nav items
  - 600 (Semibold): Headings, metric numbers, badges, card titles
Fallback: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

### Spacing Scale
```
Standard Tailwind spacing is used.
Custom overrides (if any) will be documented here.
```

### Border Radius
```
Cards: TBD
Buttons: TBD
Inputs: TBD
Badges: TBD
Modals: TBD
```

### Shadows
```
Card shadow: TBD
Dropdown shadow: TBD
Modal overlay: TBD
Glass effect: TBD
```

---

## Component Patterns

> Each component entry is added here after it is built, using the `imprint` skill.
> Format: Component name → visual description → key classes → variants.

### Scale Indicator (Digital Industrial Telemetry)

File: `src/components/weighbridge/scale-indicator.tsx`
Last updated: 03 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Background       | `bg-[#18181B]` (canvas) / `bg-[#050507]` (CRT box)   |
| Border           | `border border-[#27272A]`, `border-2 border-neutral-800` |
| Border radius    | `style={{ borderRadius: 0 }}` (Sharp industrial)    |
| Text — primary   | `text-white`, `font-mono text-5xl sm:text-7xl font-black` |
| Text — secondary | `text-neutral-400`, `text-neutral-500 font-mono`     |
| Spacing          | `p-4 sm:p-6`, `gap-6`, `space-y-4`                   |
| Hover state      | `hover:bg-neutral-700`, `hover:text-white`           |
| Shadow           | `shadow-xl`, `shadow-inner`                          |
| Accent usage     | `text-[#10B981]` (glow), `bg-[#059669]` (active tab) |

**Pattern notes:**
High-contrast Rice Lake / Avery Weightronix industrial LED digital readout. Features live `STABLE` (emerald) vs `IN_MOTION` (amber ping) beacon, axle load distribution bar, unit toggle (MT / KG), and zero tare calibration.

---

### Scale Platform Card

File: `src/components/weighbridge/platform-card.tsx`
Last updated: 03 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Background       | `bg-white` (card) / `bg-[#F8F9FA]` (load box)        |
| Border           | `border border-neutral-300` / active: `border-2 border-[#18181B]` |
| Border radius    | `style={{ borderRadius: 0 }}`                        |
| Text — primary   | `font-mono text-2xl sm:text-3xl font-black text-neutral-900` |
| Text — secondary | `text-[10px] text-neutral-500 font-medium`           |
| Spacing          | `p-4`, `mb-3`, `gap-2`                               |
| Hover state      | `hover:border-neutral-400`                           |
| Shadow           | `shadow-md ring-1 ring-[#18181B]/10` (active)        |
| Accent usage     | `bg-emerald-50 text-emerald-800 border-emerald-200`  |

**Pattern notes:**
Compact physical platform status cards for WB-01 (Inbound) and WB-02 (Outbound). Shows occupied vehicle with pass number and live weight reading.

---

### Weighment Capture Modal

File: `src/components/weighbridge/weighment-capture-modal.tsx`
Last updated: 03 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Background       | `bg-white`, header: `bg-[#18181B]`, net: `bg-[#059669]/20` |
| Border           | `border-2 border-neutral-900`, net: `border-2 border-[#10B981]` |
| Border radius    | `style={{ borderRadius: 0 }}`                        |
| Text — primary   | `font-mono text-xl sm:text-2xl font-black text-white` |
| Text — secondary | `text-[10px] uppercase font-bold text-neutral-500`   |
| Spacing          | `p-4 sm:p-6`, `space-y-5`, `gap-3`                   |
| Hover state      | `hover:bg-[#047857]` (confirm), `hover:bg-neutral-100` |
| Shadow           | `shadow-2xl`                                         |
| Accent usage     | `text-[#10B981]`, `bg-[#059669]`                     |

**Pattern notes:**
3-column real-time weight matrix displaying Gross, Tare, and strictly automated non-editable Net Weight (`Net = |Gross - Tare|`). Displays legal tolerance check and ANPR plate camera verification.

---

### Official Weighbridge Slip Modal

File: `src/components/weighbridge/weighbridge-slip-modal.tsx`
Last updated: 03 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Background       | `bg-white` (paper canvas), net row: `bg-[#ECFDF5]`   |
| Border           | `border-2 border-neutral-900`, `border-neutral-300`  |
| Border radius    | `style={{ borderRadius: 0 }}`                        |
| Text — primary   | `font-mono text-base font-black text-neutral-900`    |
| Text — secondary | `text-[10px] font-mono text-neutral-500`             |
| Spacing          | `p-5 sm:p-8`, `space-y-4`                            |
| Hover state      | `hover:bg-[#047857]`, `hover:bg-neutral-50`          |
| Shadow           | `shadow-2xl` (on screen), `print:shadow-none`        |
| Accent usage     | `text-[#047857]`, `bg-[#059669]`                     |

**Pattern notes:**
Print-ready official legal metrology weight certificate with Bharat Industrial & Renewables LLP header, barcode strip, 2-stage Gross/Tare/Net audit table, legal disclaimer, and operator signature stamp. Contains full `@media print` overrides.

---

### Segmented Direction / Mode Switcher (Dual/Multi Pill Toggle)

File: `src/components/gate/gate-entry.tsx`
Last updated: 04 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Background       | Container: `bg-neutral-100`, Active Inbound: `bg-[#059669]`, Active Outbound: `bg-[#18181B]`, Inactive: `hover:bg-neutral-200` |
| Border           | Outer container: `border border-neutral-300 p-0.5`   |
| Border radius    | `style={{ borderRadius: 0 }}` (Sharp industrial)    |
| Text — primary   | Active: `text-white font-bold text-xs uppercase tracking-wider` |
| Text — secondary | Inactive: `text-neutral-700 hover:text-neutral-900`  |
| Spacing          | `h-9 sm:h-8 px-2 sm:px-3 gap-1.5`, Grid: `grid grid-cols-2 sm:flex gap-1` |
| Hover state      | `hover:bg-neutral-200`                               |
| Shadow           | Active: `shadow-xs`                                  |
| Accent usage     | `bg-[#059669]` (Inbound RM / primary state), `bg-[#18181B]` (Outbound / dark charcoal state) |

**Pattern notes:**
Tactile, zero-radius segmented control for mode switching (Inbound vs Outbound, RM vs FG, Shift A vs B, or Stage tabs). Automatically adapts from a 2-column mobile grid to a flex row on desktop with short labels on mobile (`Inbound RM`) and full labels on desktop (`Inbound Biomass RM`). Highly reusable across QC (RM vs FG testing), Inventory, and Production.

---

### Quick Preset Action Chips (Tactile Inspection Pills)

File: `src/components/gate/gate-entry.tsx`
Last updated: 04 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Background       | `bg-white hover:bg-neutral-100`                      |
| Border           | `border border-neutral-300 hover:border-neutral-400` |
| Border radius    | `style={{ borderRadius: 0 }}`                        |
| Text — primary   | `text-xs font-medium text-neutral-700`               |
| Text — secondary | `text-[11px] text-neutral-500 font-medium` (label)   |
| Spacing          | Container: `gap-2.5 sm:gap-3 py-1`, Chip: `px-3 py-1.5` |
| Hover state      | `hover:bg-neutral-100 hover:border-neutral-400`      |
| Shadow           | `shadow-2xs`                                         |
| Accent usage     | Prefix `+` or subtle emerald hover ring              |

**Pattern notes:**
Standardized quick-action pills used to append structured remarks with a single tap. Enforces minimum touch target ergonomics (`px-3 py-1.5 text-xs`) and vertical/horizontal wrap breathing room (`gap-2.5 sm:gap-3`). Reusable for QC sample observations (Moisture High, Foreign Matter, Clean Lot), Production downtime reasons (Feeder Jam, Power Trip, Screen Choke), and Dispatch gate clearance notes.

---

### Industrial Form Architecture & Section Spacing Pattern

File: `src/components/gate/gate-entry.tsx`
Last updated: 04 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Outer container  | `bg-transparent border-0 p-0 sm:border sm:border-neutral-300 sm:p-5 sm:bg-white` |
| Section divider  | `mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-200 space-y-3` |
| Field grid       | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` |
| Field input      | `h-10 px-3 bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:border-[#059669]` |
| Textarea         | `w-full min-h-[56px] sm:min-h-[48px] p-3 text-xs leading-relaxed resize-none` |
| Form footer      | `mt-6 sm:mt-5 pt-5 sm:pt-4 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3` |
| Primary submit   | `h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider` |
| Reset / Clear    | `h-10 px-4 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase` |

**Pattern notes:**
Standard architectural layout for all high-throughput operational forms. Guarantees zero vertical scroll on desktop viewports (< 650px total height) by packing fields into balanced 3-column rows, while eliminating nested white containers on mobile devices (≤ 640px) to maximize touch width and fit seamlessly on the `#F4F5F7` mist canvas. Reusable for QC Sample Entry, Production Planning, Material Issue, and Sales Orders.

---

### Entity Inspection Drawer (Slide-Over Panel)

File: `src/components/gate/vehicle-details-drawer.tsx`
Last updated: 04 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Drawer canvas    | `max-w-md w-full bg-white border-l border-neutral-300 shadow-2xl` |
| Backdrop         | `fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50` |
| Header           | `p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between` |
| Nav tabs         | Segmented sub-tabs (`Overview`, `Documents`, `Timeline`) with active emerald border-b |
| Data rows        | Alternating or bordered key-value pairs with monospace values |
| Print action     | Quick slip print button in drawer footer             |

**Pattern notes:**
Universal slide-over panel that opens from the right without navigating away from the active workbench. Used for inspecting vehicles in Gate & Weighbridge, inspecting production batches in Processing, reviewing RM lots in Warehouse, and checking sales order delivery status in Dispatch.

---

### Document Verification & Clearance Checklist

File: `src/components/gate/gate-doc-verification.tsx` / `gate-exit.tsx`
Last updated: 04 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Checklist item   | `p-3 bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3` |
| Verified badge   | `bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2 py-0.5` |
| Pending badge    | `bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium px-2 py-0.5` |
| Toggle control   | Tactile binary switch or single-tap verification stamp button |
| Sign-off block   | Digital operator stamp with employee ID, timestamp, and signature disclaimer |

**Pattern notes:**
Operational verification pattern that requires explicit security/operator confirmation before authorizing transitions (e.g. Weighbridge Slip verified before gate exit; COA & Invoice verified before dispatch exit; Sample test results verified before RM storage). Reusable for Gate Exit, Loading Authorization, QC Sampling Release, and Delivery Confirmation.

---

### Weighbridge Live Scale Cockpit & Waiting Queue Workbench

File: `src/components/weighbridge/weighbridge-home.tsx` / `scale-indicator.tsx`
Last updated: 04 Oct 2026

| Property             | Class                                                |
| -------------------- | ---------------------------------------------------- |
| Cockpit Container    | `bg-white border border-neutral-300 overflow-hidden shadow-2xs` |
| Cockpit Split        | `grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200` |
| Digital Readout Zone | `lg:col-span-6 p-4 sm:p-5 flex flex-col justify-between space-y-4` |
| Live Tonnage Readout | `font-mono text-5xl sm:text-6xl font-black tracking-tight text-neutral-900` |
| Stabilization Beacon | `inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase border bg-emerald-50 text-emerald-800 border-emerald-300` |
| Active Truck Card    | `lg:col-span-6 p-4 sm:p-5 flex flex-col justify-between space-y-3 bg-[#FAFAFA]` |
| Primary Action       | `w-full py-3 px-4 text-xs font-bold uppercase tracking-wider bg-[#059669] hover:bg-[#047857] text-white border border-[#10B981] shadow-xs` |
| Queue Section Header | `flex items-center justify-between border-b border-neutral-300 pb-3` |
| Movement Filter Tabs | `px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#18181B] text-white border-[#18181B]` |
| Plate Pill           | `px-2 py-0.5 font-mono font-bold text-sm bg-neutral-50 border border-neutral-300 text-neutral-900 inline-block` |
| Table Row Action     | `h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs` |

---

### Desktop Dual View Mode Switcher (Cards / Table with Icons)

File: Standard across all 8 operational roles
Last updated: 04 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Container        | `hidden sm:inline-flex border border-neutral-300 divide-x divide-neutral-300 text-xs shrink-0 h-10` |
| Active Pill      | `bg-[#18181B] text-white font-semibold px-3 py-1.5 flex items-center gap-1.5 cursor-pointer` |
| Inactive Pill    | `bg-neutral-200/50 text-neutral-700 hover:bg-neutral-200 px-3 py-1.5 flex items-center gap-1.5 cursor-pointer` |
| Cards Button     | `<LayoutGrid className="w-3.5 h-3.5" /> <span>Cards</span>` |
| Table Button     | `<TableIcon className="w-3.5 h-3.5" /> <span>Table</span>` |
| Ordering         | Strictly `[ Cards ] [ Table ]` left-to-right         |
| Mobile Behavior  | Hidden on mobile (`hidden sm:inline-flex`); mobile ALWAYS renders vertical responsive cards (`grid-cols-1 sm:hidden gap-3`) |

**Pattern notes:**
Mandatory control for every operational queue, fleet roster, or weight history ledger across all 8 desks. Every viewMode switcher displays the `LayoutGrid` icon for Cards and `Table` (`TableIcon`) icon for Table. Eliminates wide table horizontal scrollbars on mobile phones while giving desktop industrial workstation operators the flexibility of dense tabular scanning or rich visual card inspection.

---

### Transparent Industrial Table Standard (Strict Ban on Table White Backgrounds)

File: `src/components/gate/gate-home.tsx` / `gate-exit.tsx` / `weighbridge-home.tsx`
Last updated: 04 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Container        | `overflow-x-auto border border-neutral-300 bg-transparent` |
| Table            | `w-full text-left text-xs border-collapse` (Strictly NO `bg-white`) |
| Thead Row        | `border-b border-neutral-300 bg-neutral-200/50 text-neutral-600 font-bold uppercase tracking-wider text-[10px]` |
| Tbody            | `divide-y divide-neutral-300`                        |
| Table Row (Tr)   | `hover:bg-neutral-200/40 transition-colors cursor-pointer` |
| Vehicle Plate    | `px-2 py-0.5 font-mono font-bold text-xs bg-neutral-50 border border-neutral-300 text-neutral-900 inline-block` |
| Weights & Times  | `font-mono tabular-nums text-xs font-semibold text-neutral-800` |
| Row Action       | `h-8 px-3 bg-[#18181B] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs transition-colors` |

**Pattern notes:**
Tables must sit transparently on the `#F4F5F7` canvas or container insets rather than having thick solid white rectangles. Uses cool mist slate headers (`bg-neutral-200/50`) and soft hairline dividers (`divide-neutral-300`) with subtle mouseover illumination (`hover:bg-neutral-200/40`).

---

### Translucent Operational Queue Card (`bg-white/40`)

File: `src/components/gate/gate-home.tsx` / `gate-exit.tsx` / `weighbridge-home.tsx`
Last updated: 04 Oct 2026

| Property         | Class                                                |
| ---------------- | ---------------------------------------------------- |
| Card Container   | `border border-neutral-300 hover:border-neutral-900 bg-white/40 p-3.5 flex flex-col justify-between space-y-3 transition-all group` |
| Header Strip     | `flex items-start justify-between gap-1 pb-2 border-b border-neutral-200` |
| Primary Plate    | `font-mono font-bold text-neutral-900 text-sm group-hover:text-[#059669] transition-colors` |
| Secondary Pass   | `text-[10px] text-neutral-500 font-mono mt-0.5`      |
| Details Grid     | `space-y-1 text-xs text-neutral-700`                 |
| Weight Telemetry | Monospace 3-col telemetry strip (`bg-neutral-100/70 border border-neutral-200 p-2`) |
| Action Footer    | `pt-2 border-t border-neutral-200 flex items-center justify-between` |

**Pattern notes:**
Universal card standard for all queue vehicles (Gate arrivals, Weighbridge waiting, Yard unloading, Exit clearance). The translucent `bg-white/40` gives card surfaces rich atmospheric layering over the `#F4F5F7` background.

---

### Movement Direction Badging Standard

File: `src/components/gate/gate-home.tsx` / `live-vehicle-tracker.tsx` / `weighbridge-home.tsx`
Last updated: 04 Oct 2026

| Direction | Badging Classes | Visual Label |
|---|---|---|
| **Inbound Biomass RM** | `border border-emerald-300 bg-emerald-50 text-[#047857] text-[10px] font-bold uppercase px-2 py-0.5` | `Inbound RM` |
| **Outbound Dispatch FG** | `border border-neutral-300 bg-[#18181B] text-white text-[10px] font-bold uppercase px-2 py-0.5` | `Outbound FG` |

**Pattern notes:**
Strictly standardized across Gate, Weighbridge, Inventory, and Production. Inbound raw biomass arrival represents active plant intake and uses Surgical Bio-Emerald tint (`bg-emerald-50 text-[#047857]`). Outbound finished pellet dispatch uses heavy industrial Pitch Charcoal (`bg-[#18181B] text-white`).

---

## Animation Patterns

### Page Transitions
```
Library: Motion (motion.dev)
Pattern: TBD
Duration: TBD
Easing: TBD
```

### List / Table Row Stagger
```
Pattern: TBD
Stagger delay: TBD
```

### Card Hover
```
Pattern: TBD (Tailwind transition)
```

### Modal Enter/Exit
```
Pattern: TBD
```

### Sidebar Collapse
```
Pattern: TBD
```

### Smooth Scroll
```
Library: Lenis
Config: TBD
```

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|---|---|---|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Layout Rules
- **Mobile (< 768px):** Single column, bottom nav, collapsible sidebar as drawer
- **Tablet (768–1024px):** Collapsed sidebar (icons only), content fills width
- **Desktop (> 1024px):** Full sidebar + content area

---

## Status Color Map

> Maps workflow statuses to visual colors. Will be finalized with the color palette.

| Status | Color | Usage |
|---|---|---|
| Expected / Planned | `gray` | Not yet started |
| Arrived / In Progress | `blue` | Active/ongoing |
| Pending / Waiting | `amber` | Awaiting action |
| Approved / Complete | `green` | Successfully done |
| Hold | `orange` | Temporarily blocked |
| Rejected / Failed | `red` | Needs attention |
| Dispatched / In Transit | `indigo` | In movement |
| Closed / Consumed | `slate` | Archived/finished |

---

## Core Operational Surface Standards (Imprinted Oct 2026)

### 1. Clean Command Header (Zero Decorative White Box Banners)
- **Container:** `<div className="border-b border-neutral-300 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">`
- **Page Title:** `<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">`
- **Rules:** Never wrap page titles in large white card boxes with redundant subtitle clutter, decorative chips, or PDF section tags. Sits directly on `#F4F5F7` canvas.

### 2. Standardized Section Heading
- **Container:** `<div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">`
- **Icon + Label:** `<div className="flex items-center gap-2"><Icon className="w-4 h-4 text-neutral-800 shrink-0" /><h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{Title}</h2><span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 text-neutral-800">{count}</span></div>`
- **Rules:** Never use giant `text-xl sm:text-2xl font-black` for section headers inside queues or ledgers.

### 3. Search Bar & Mobile Filter Square Standard
- **Search & Mobile Button Wrapper:** `<div className="flex items-center gap-2 flex-1 sm:max-w-md">`
- **Search Input:** `w-full h-10 pl-8.5 pr-3 text-xs bg-white border border-neutral-300 text-neutral-900 placeholder:text-[11px] placeholder:text-neutral-400 focus:outline-none focus:border-[#059669] transition-colors`
- **Mobile Filter Square Button:** `<button type="button" onClick={() => setIsMobileFilterOpen(true)} className="sm:hidden w-10 h-10 flex items-center justify-center border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 shrink-0 cursor-pointer" title="Filter Options"><SlidersHorizontal className="w-4 h-4" /></button>`
- **Desktop Filter Tabs:** `<div className="hidden sm:flex items-center border border-neutral-300 divide-x divide-neutral-300 text-xs overflow-x-auto no-scrollbar shrink-0 h-10 bg-white">`
- **Mobile Filter Modal Popup:** Rendered when `isMobileFilterOpen === true` inside a fixed backdrop overlay with close button and touch-friendly full-width selection buttons.

### 4. Command Overview Layout (Gate & QC Standard Architecture)
- **Desktop Actions in Header:** `<div className="hidden sm:flex items-center gap-3">` placed on the right side of the command header.
- **Mobile Header:** Shows only the clean `<h1>` title and hairline bottom border (`border-b border-neutral-300 pb-4 sm:pb-5`). No cluttered button wrapping inside header.
- **4 Operational Metric Cards:** `grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5` sitting immediately below header divider.
  - Card style: `border border-neutral-300 p-4 sm:p-5 hover:border-neutral-900 transition-colors cursor-pointer group bg-white flex flex-col justify-between`
  - Values: Bold tabular numbers + inline muted unit label (`9 Vehicles`, `3 Batches`, `67% Optimal`). Eliminates busy colored badge tags on data cards.
  - **Plain English Punchy Labels:** Labels must be 1–2 short words (e.g. `PENDING RM`, `PENDING FG`, `TESTED TODAY`, `PASS RATE`, `INSIDE PLANT`, `READY FOR EXIT`) to prevent ugly ellipsis truncation (`...`) on mobile devices.
- **Mobile Action Stack (Below KPI Cards):** Placed directly below the 4 metric cards (`sm:hidden flex flex-col items-stretch gap-2.5 w-full`):
  - Secondary actions: `h-11 px-4 border border-neutral-300 bg-white text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 w-full`
  - Primary action: `h-11 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs w-full`
- **Section Spacing Below:** `space-y-4 pt-3 sm:pt-6` leading to queues or rosters.

---

> **This file is auto-updated as components are built. Do not manually edit pattern entries — use the `imprint` skill after building each component.**

