---
phase: 02-core-data-flow
plan: 05
subsystem: ui
tags: [react, swr, optimistic-updates, shopping-list, checkbox]

# Dependency graph
requires:
  - phase: 02-02
    provides: API routes for indkobsliste
  - phase: 02-03
    provides: useIndkobsliste hook with optimistic updates
provides:
  - ShoppingItem component with checkbox toggle
  - CategoryGroup component for visual grouping
  - AddItemInput component for manual items
  - Fully wired /indkob page with data fetching
affects: [phase-03-pwa, future-category-grouping]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Optimistic UI updates for checkbox interactions
    - Items grouped by source (ret vs manuel)
    - Checked items moved to bottom section

key-files:
  created:
    - madplan-v2/src/components/indkob/shopping-item.tsx
    - madplan-v2/src/components/indkob/category-group.tsx
    - madplan-v2/src/components/indkob/add-item-input.tsx
  modified:
    - madplan-v2/src/app/indkob/page.tsx

key-decisions:
  - "Group by source (ret/manuel) not category - schema lacks category data"
  - "No toast on toggle - too noisy for checkbox interaction"
  - "Keep focus on input after add for quick multi-add workflow"

patterns-established:
  - "Optimistic toggle: instant UI update, revert on error"
  - "CategoryGroup pattern: Card with header and divided items"
  - "Add input at top for quick access during shopping"

# Metrics
duration: ~15min
completed: 2026-01-24
---

# Phase 2 Plan 05: Indkobsliste Page Summary

**Shopping list view with optimistic checkbox toggle, source-based grouping, and manual item addition**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-01-24T14:00:00Z (estimated)
- **Completed:** 2026-01-24T14:26:43Z
- **Tasks:** 4 (3 auto + 1 verification checkpoint)
- **Files modified:** 4

## Accomplishments

- ShoppingItem component with instant checkbox toggle (optimistic updates)
- CategoryGroup component organizing items by source
- AddItemInput for adding manual items with loading state
- Checked items automatically move to "Kobt" section at bottom
- Loading skeletons and error states for robust UX

## Task Commits

Each task was committed atomically:

1. **Task 1: Create shopping item and category group components** - `b68d7bc` (feat)
2. **Task 2: Create add item input component** - `1071fa9` (feat)
3. **Task 3: Wire indkob page with data and components** - `5c41a39` (feat)
4. **Task 4: Verify shopping list functionality** - checkpoint (approved)

## Files Created/Modified

- `madplan-v2/src/components/indkob/shopping-item.tsx` - Item row with checkbox, strikethrough when checked
- `madplan-v2/src/components/indkob/category-group.tsx` - Card wrapper for grouped items
- `madplan-v2/src/components/indkob/add-item-input.tsx` - Input field with submit button and loading state
- `madplan-v2/src/app/indkob/page.tsx` - Wired page with useIndkobsliste hook, grouping logic

## Decisions Made

- **Group by source, not category:** Plan specified "grouped by source" (fra opskrifter / tilfojet manuelt). Current schema lacks category data (dairy, produce, etc.)
- **No toast on toggle:** Checkbox toggles are frequent - toasts would be noisy. Only show toast on add/error
- **Keep focus after add:** Input keeps focus after submission for quick multi-add workflow in store

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components built and wired as specified.

## User Setup Required

None - no external service configuration required.

## Future Considerations

**User feedback captured:** User requested grouping by category (dairy, produce, etc.) instead of by source. This is out of scope for this plan as:
1. Plan specified "grouped by source" as must-have
2. Current Airtable schema lacks category field on ingredients
3. Would require schema changes and n8n workflow updates

This feature should be considered for a future phase after v2 baseline is complete.

## Next Phase Readiness

- Shopping list page fully functional
- Ready for Phase 3 (PWA Enhancement) - offline support for shopping in stores
- Remaining Phase 2 plans: 02-04 (Ugeplan), 02-06 (Opskrifter)

---
*Phase: 02-core-data-flow*
*Completed: 2026-01-24*
