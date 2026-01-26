---
phase: 08-madplan-enhancement
plan: 03
subsystem: ugeplan-ui
tags: [view-toggle, list-view, grid-view, localStorage, user-preference]

dependency-graph:
  requires: []
  provides: [view-toggle, list-grid-switch, localStorage-preference]
  affects: []

tech-stack:
  added: []
  patterns: [useViewPreference-hook, conditional-rendering, localStorage-persistence]

key-files:
  created:
    - madplan-v2/src/hooks/use-view-preference.ts
    - madplan-v2/src/components/ugeplan/day-card-list.tsx
  modified:
    - madplan-v2/src/app/ugeplan/page.tsx

decisions:
  - localStorage-key: "ugeplan-view" key for persisting view preference
  - default-view: Grid view is the default (matches existing behavior)
  - ssr-safety: Hook handles hydration correctly to avoid mismatch warnings
  - compact-list: List view shows abbreviated day names (Man, Tir, etc.)

metrics:
  duration: ~10 minutes
  completed: 2026-01-26
---

# Phase 8 Plan 3: List/Grid View Toggle Summary

**One-liner:** Ugeplan view toggle with localStorage persistence, grid (default) and compact list view options

## What Was Built

### 1. useViewPreference Hook (Task 1)
Created a reusable SSR-safe hook for persisting view preferences:
- Stores view mode in localStorage
- Handles hydration correctly (no SSR mismatch)
- Accepts configurable key and default value
- Returns tuple `[viewMode, setViewMode]` like useState

### 2. View Toggle UI (Task 2)
Added ToggleGroup component to ugeplan page header:
- Positioned top-right next to WeekNav
- Grid icon and List icon for clear affordance
- Persists selection via useViewPreference hook

### 3. DayCardList Component (Task 2)
Created compact list view alternative to DayCard:
- Abbreviated day names (Man, Tir, Ons, etc.)
- Small 40x40px thumbnails
- All actions available (add, delete, shopping cart)
- Shows note when present (for 08-02 compatibility)
- Clickable meal name links to recipe detail

### 4. Conditional Rendering (Task 2)
Updated WeekContent to render based on viewMode:
- Grid: Original DayCard components with spacing
- List: DayCardList components inside Card wrapper
- Loading skeletons match current view mode

## Commits

| Hash | Description |
|------|-------------|
| 13ee909 | feat(08-03): add useViewPreference hook for localStorage persistence |
| 17e9637 | feat(08-03): add list/grid view toggle to ugeplan page |

## Verification Checklist

- [x] View toggle visible near week navigation
- [x] Grid view shows current DayCard layout
- [x] List view shows compact row layout
- [x] Toggle state persists in localStorage
- [x] Page refresh maintains view preference
- [x] Both views support all day card actions
- [x] No hydration mismatch warnings
- [x] Build passes

## Deviations from Plan

None - plan executed exactly as written.

## Technical Notes

### SSR Hydration
The useViewPreference hook initializes with the default value during SSR, then hydrates from localStorage after mount. This prevents the "text content did not match" hydration error that would occur if we read localStorage during render.

### Interface Compatibility
The DayCardList component accepts the same props as DayCard, allowing both to be rendered with the same data via `commonProps` spread. This keeps the parent component clean.

### List View Compact Design
- Day abbreviations save horizontal space
- 40x40px thumbnails (vs 48x48 in grid)
- Single-line meal name with truncation
- Smaller action buttons (28px vs 32px)

## Success Criteria Status

| Criteria | Status |
|----------|--------|
| UI-01 resolved: Ugeplan has working list/grid toggle | Complete |
| Preference persists across sessions via localStorage | Complete |
| Both views are fully functional (no feature loss in list view) | Complete |
| Toggle UI is consistent with opskrifter page pattern | Complete |

---

*Generated: 2026-01-26*
*Plan: 08-03 (List/Grid View Toggle)*
