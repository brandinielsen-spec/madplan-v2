---
phase: 07-opskrifter-enhancement
plan: 03
subsystem: ui
tags: [react, shopping-list, hooks, toast]

# Dependency graph
requires:
  - phase: 07-01
    provides: N8N workflow for adding items to shopping list with kildeNavn
provides:
  - Add to shopping list button on recipe detail page
  - One-click ingredient addition from any recipe
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Reusing useIndkobsliste hook for shopping list operations
    - getCurrentWeek for current week context in non-ugeplan pages

key-files:
  created: []
  modified:
    - madplan-v2/src/app/opskrifter/[id]/page.tsx

key-decisions:
  - "Button placed between ingredients and instructions for natural flow"
  - "Uses addItems hook method with opskrift.titel as kildeNavn"

patterns-established:
  - "Recipe-to-shopping pattern: addItems(opskrift.ingredienser, opskrift.titel)"

# Metrics
duration: 3min
completed: 2026-01-26
---

# Phase 7 Plan 3: Add to Shopping List Button Summary

**One-click shopping list button on recipe detail page using existing useIndkobsliste hook**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-26T09:06:14Z
- **Completed:** 2026-01-26T09:08:47Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added "Tilfoej til indkobsliste" button on recipe detail page
- Button adds all recipe ingredients to current week's shopping list
- Loading toast shows progress, success toast confirms count
- Recipe title passed as kildeNavn for source display in shopping list

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Shopping List Button to Recipe Detail Page** - `083c5c0` (feat)
2. **Task 2: Test Add to Shopping List Flow** - No commit (testing only, no file changes)

**Plan metadata:** See final commit below

## Files Created/Modified
- `madplan-v2/src/app/opskrifter/[id]/page.tsx` - Added shopping list button with handler and hook integration

## Decisions Made
- Button placed between Ingredienser Card and Fremgangsmaade Card for natural user flow
- Reused existing useIndkobsliste hook with getCurrentWeek for week context
- Pass opskrift.titel as kildeNavn so shopping list shows "Fra: [recipe name]"

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- FEAT-03 complete: Users can add recipe ingredients to shopping list from recipe detail page
- Phase 7 (Opskrifter Enhancement) now complete
- Ready for Phase 8 (Madplan Enhancement)

---
*Phase: 07-opskrifter-enhancement*
*Completed: 2026-01-26*
