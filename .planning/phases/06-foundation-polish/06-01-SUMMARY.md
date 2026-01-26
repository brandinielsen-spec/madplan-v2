---
phase: 06-foundation-polish
plan: 01
subsystem: ui
tags: [danish-localization, navigation, accessibility, pwa]

# Dependency graph
requires:
  - phase: 05-madplan-integration
    provides: UI components that needed Danish character fixes
provides:
  - 5-icon bottom navigation with Home first
  - Proper Danish Unicode characters in all UI text
  - Correct day labels (Lordag, Sondag)
  - Fixed active state logic for home route
affects: [phase-6 plans, user experience, accessibility]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Exact match for home route active state (pathname === "/" vs startsWith)
    - Danish Unicode characters in user-facing strings only (not variable names)

key-files:
  modified:
    - madplan-v2/src/components/layout/mobile-nav.tsx
    - madplan-v2/src/app/page.tsx
    - madplan-v2/src/app/layout.tsx
    - madplan-v2/src/app/manifest.ts
    - madplan-v2/src/app/ugeplan/page.tsx
    - madplan-v2/src/app/indkob/page.tsx
    - madplan-v2/src/app/opskrifter/page.tsx
    - madplan-v2/src/app/tilfoej/page.tsx
    - madplan-v2/src/components/ugeplan/day-card.tsx
    - madplan-v2/src/components/ugeplan/recipe-picker.tsx
    - madplan-v2/src/components/import/url-import-form.tsx
    - madplan-v2/src/components/import/image-import.tsx
    - madplan-v2/src/components/import/recipe-form.tsx
    - madplan-v2/src/components/indkob/add-item-input.tsx
    - madplan-v2/src/components/opskrifter/tag-input.tsx
    - madplan-v2/src/components/opskrifter/favorite-button.tsx
    - madplan-v2/src/components/opskrifter/empty-state.tsx

key-decisions:
  - "Keep ASCII in variable names, routes, file paths - only fix user-facing strings"
  - "Use exact match (===) for home route active state to prevent all routes showing home as active"

patterns-established:
  - "Danish character replacement: oe->o, ae->ae, aa->aa in UI strings"
  - "Home route active state: exact match rather than startsWith"

# Metrics
duration: 10min
completed: 2026-01-26
---

# Phase 6 Plan 1: Danish Characters and Home Navigation Summary

**5-icon bottom navigation with Home first, proper Danish Unicode characters (o, ae, aa) across 17 UI files**

## Performance

- **Duration:** 10 min
- **Started:** 2026-01-26T08:12:06Z
- **Completed:** 2026-01-26T08:22:32Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments

- Added Home icon as first item in bottom navigation with proper active state logic
- Fixed Danish characters across all 17 UI files (pages and components)
- Day labels now show "Lordag" and "Sondag" instead of "Lordag" and "Sondag"
- All action text shows proper characters: "Tilfoj", "Sog", "Vaelg", "prov", etc.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Home icon to bottom navigation** - `ecc30e8` (feat)
2. **Task 2: Fix Danish characters across all UI files** - `2672308` (fix)

## Files Created/Modified

- `madplan-v2/src/components/layout/mobile-nav.tsx` - Added Home icon, fixed active state, fixed nav labels
- `madplan-v2/src/app/page.tsx` - Fixed "Planlaeg", "maaltider", "paa", "tilfoeje"
- `madplan-v2/src/app/layout.tsx` - Fixed metadata description
- `madplan-v2/src/app/manifest.ts` - Fixed PWA manifest description
- `madplan-v2/src/app/ugeplan/page.tsx` - Fixed toast messages and error text
- `madplan-v2/src/app/indkob/page.tsx` - Fixed title, toast messages, category labels
- `madplan-v2/src/app/opskrifter/page.tsx` - Fixed search placeholder and error text
- `madplan-v2/src/app/tilfoej/page.tsx` - Fixed page title and instruction text
- `madplan-v2/src/components/ugeplan/day-card.tsx` - Fixed day labels and aria-labels
- `madplan-v2/src/components/ugeplan/recipe-picker.tsx` - Fixed title and placeholder
- `madplan-v2/src/components/import/url-import-form.tsx` - Fixed button labels and aria-labels
- `madplan-v2/src/components/import/image-import.tsx` - Fixed all loading/error messages and aria-labels
- `madplan-v2/src/components/import/recipe-form.tsx` - Fixed validation messages and labels
- `madplan-v2/src/components/indkob/add-item-input.tsx` - Fixed placeholder and aria-label
- `madplan-v2/src/components/opskrifter/tag-input.tsx` - Fixed button label and placeholder
- `madplan-v2/src/components/opskrifter/favorite-button.tsx` - Fixed aria-label
- `madplan-v2/src/components/opskrifter/empty-state.tsx` - Fixed instruction text

## Decisions Made

1. **ASCII in variable names preserved** - Only user-facing strings were modified, keeping code identifiers like `loerdag`, `soendag` as ASCII for consistency with route names and API fields
2. **Exact match for home route** - Used `pathname === "/"` instead of `startsWith("/")` to prevent home icon showing active on all pages

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all files were successfully edited and build passes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- BUG-06 (Danish characters) fully resolved
- UI-02 (Home navigation) fully resolved
- Ready for 06-02-PLAN.md (if additional foundation work needed)
- All UI text now displays proper Danish characters for native speakers

---
*Phase: 06-foundation-polish*
*Completed: 2026-01-26*
