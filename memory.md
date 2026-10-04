# Memory — Instant Navigation, Intelligent Background Prefetching & Industrial Skeleton Loader

Last updated: 04 Oct 2026, 18:50 IST

## What was built

1. **Intelligent Role Background Route Prefetching (`src/components/layout/industrial-nav.tsx`):**
   - Automatically gives the initial landing page 100% bandwidth and CPU priority during initial render and hydration.
   - During idle time (`requestIdleCallback` / 400ms delay), `IndustrialNav` iterates through all remaining desk routes for that operator's station and prefetches them silently in the background via `router.prefetch(item.href)`.
   - By the time the user decides to navigate to another desk, the target page's Server Component payload and JavaScript chunk are already cached locally in browser memory.

2. **Gesture-Triggered Prefetching on Hover & Touch (`industrial-nav.tsx`):**
   - All desktop tab buttons and mobile drawer cards include `onMouseEnter` and `onTouchStart` prefetch triggers, so any movement toward a desk option instantly ensures its cache freshness.

3. **Structured NavItem Route Map:**
   - Enriched `NavItem` and `USER_ROLES` with explicit `href` targets for all 8 roles (Gate, Weighbridge, Sales, QC Lab, Production, Warehouse, Admin, Management).

4. **Awwwards-Level Industrial Skeleton Loader (`src/components/ui/industrial-skeleton.tsx`):**
   - Telemetry beacon (`Loading Workbench Telemetry...`), command bar, 4-card telemetry grid, multi-column workbench form and table skeletons, and action button placeholders.

5. **Instant Navigation Transition Hook (`src/lib/hooks/use-nav-transition.ts`):**
   - Uses React `useTransition` to track route transitions. When a desk is clicked, `isNavigating` triggers immediately (0ms delay), swapping out stale screens for `<IndustrialSkeleton />` inside `<Suspense>` boundaries.

6. **Optimistic Tab Feedback in IndustrialNav (`industrial-nav.tsx`):**
   - Added `optimisticTab` state. Tapping any desk option highlights it immediately in pitch charcoal (`#18181B`) and Bio-Emerald (`#10B981`).

7. **All 8 Station Layouts Updated:**
   - `gate`, `weighbridge`, `sales`, `quality`, `production`, `inventory`, `admin`, `management` layouts now support direct `href` navigation, instant skeleton rendering, and Suspense fallback.

8. **UI Registry Imprints (`ui-registry.md`):**
   - Documented in **Section 9: Industrial Skeleton Loader & Instant Nav Transition Standard**.

## Decisions made

1. **Idle-Time Priority Hierarchy:** Prefetching must never compete with initial page hydration. Running `router.prefetch()` during idle time (`requestIdleCallback`) ensures the first page is blazing fast while the secondary pages pre-warm silently.
2. **Dual-Layer Prefetching (Background Idle + Gesture Hover):** Combines idle prefetching of the entire station with immediate gesture-triggered prefetching on mouse hover or touch start.

## Current state

- **Compilation:** `npx tsc --noEmit` verified with **0 errors**.
- **Dev Server:** Active and running on `http://localhost:3000`.
- **Navigation Performance:** First page loads with full priority; other station pages prefetch in the background for instant subsequent page transitions.

## Next session starts with

1. User testing and verification of station workflows.
2. Real-time backend or database schema integration (e.g. Supabase, PostgreSQL, or REST endpoints).
3. PDF / Slip dot-matrix print formatting.

## Open questions

None. All UI patterns and navigation workflows are codified in [`ui-registry.md`](file:///e:/P1/ui-registry.md).
