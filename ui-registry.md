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

> **This file is auto-updated as components are built. Do not manually edit pattern entries — use the `imprint` skill after building each component.**
