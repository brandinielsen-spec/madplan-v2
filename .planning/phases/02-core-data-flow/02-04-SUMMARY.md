---
phase: 02-core-data-flow
plan: 04
subsystem: ui
tags: [react, swr, shadcn, drawer, meal-planning]

# Dependency graph
requires:
  - phase: 02-01
    provides: Types, week-utils, shadcn components
  - phase: 02-02
    provides: API routes for ugeplan CRUD
  - phase: 02-03
    provides: useUgeplan, useOpskrifter, useEjere hooks
provides:
  - WeekNav component for week navigation
  - DayCard component for meal display
  - RecipePicker drawer for meal selection
  - Fully wired ugeplan page with data fetching
affects: [phase-03, pwa, offline-support]

# Tech tracking
tech-stack:
  added: []
  patterns: [controlled-drawer, week-state-management, today-highlighting]

key-files:
  created:
    - madplan-v2/src/components/ugeplan/week-nav.tsx
    - madplan-v2/src/components/ugeplan/day-card.tsx
    - madplan-v2/src/components/ugeplan/recipe-picker.tsx
  modified:
    - madplan-v2/src/app/ugeplan/page.tsx

key-decisions:
  - "Controlled drawer pattern via selectedDag state"
  - "First ejer auto-selected (owner selection deferred)"
  - "Today card highlighted with ring-2 ring-terracotta-500"
  - "Recent meals extracted from current week's ugeplan"

patterns-established:
  - "DayCard: Compact card with meal display and add/delete actions"
  - "RecipePicker: Drawer with search, recent, and quick-add sections"
  - "Week navigation: prev/next with formatWeekLabel display"

# Metrics
duration: ~25min
completed: 2026-01-24
---

# Phase 02 Plan 04: Ugeplan Page Summary

**Week plan view with navigation, day cards, recipe picker drawer, and full add/delete meal workflow**

## Performance

- **Duration:** ~25 min
- **Tasks:** 4 (3 auto + 1 human-verify)
- **Files created:** 3
- **Files modified:** 1

## Accomplishments

- WeekNav component with prev/next arrows and week label display
- DayCard component showing meal per day with add/delete buttons
- RecipePicker drawer with search filter, recent meals, and quick-add custom meal
- Ugeplan page fully wired with SWR hooks and optimistic updates
- Today highlighting with terracotta ring accent
- Loading skeletons and error states

## Task Commits

Each task was committed atomically:

1. **Task 1: Create week navigation and day card components** - `c439579` (feat)
2. **Task 2: Create recipe picker drawer** - `f89fed1` (feat)
3. **Task 3: Wire ugeplan page with data and components** - `0502641` (feat)
4. **Task 4: Human verification** - approved with notes

## Files Created/Modified

- `src/components/ugeplan/week-nav.tsx` - Week navigation with prev/next buttons and formatWeekLabel
- `src/components/ugeplan/day-card.tsx` - Day card with meal display, add/delete actions, today highlighting
- `src/components/ugeplan/recipe-picker.tsx` - Drawer with search, recent meals, all recipes, quick-add
- `src/app/ugeplan/page.tsx` - Main page wiring hooks, state, and components together

## Decisions Made

- **Controlled drawer pattern:** RecipePicker open state controlled by selectedDag (null = closed)
- **First ejer auto-selected:** Owner selection deferred to future phase, uses first ejer from list
- **Today highlighting:** Ring accent on today's card for visual prominence
- **Recent meals from current week:** Extracted from ugeplan.dage for quick re-selection
- **Hidden trigger pattern:** RecipePicker uses `<span />` trigger, opened programmatically via state

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components compiled and integrated smoothly.

## User Setup Required

None - no external service configuration required.

## Future Considerations

User noted a feature request during verification: **ability to add all ingredients from a meal to the shopping list**. This is out of scope for the current plan but should be considered for a future enhancement phase.

## Next Phase Readiness

- Ugeplan page complete with full CRUD workflow
- Ready for 02-05 (Indkoebsliste Page) and 02-06 (Opskrifter Page)
- All SWR hooks verified working with n8n backend
- Component patterns established for reuse in other pages

---
*Phase: 02-core-data-flow*
*Plan: 04*
*Completed: 2026-01-24*
