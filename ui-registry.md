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

### Sidebar
```
Status: NOT BUILT
```

### Topbar
```
Status: NOT BUILT
```

### Button
```
Status: NOT BUILT
```

### Card
```
Status: NOT BUILT
```

### Table
```
Status: NOT BUILT
```

### Badge / Status Pill
```
Status: NOT BUILT
```

### Modal
```
Status: NOT BUILT
```

### Form Inputs
```
Status: NOT BUILT
```

### KPI Card
```
Status: NOT BUILT
```

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
