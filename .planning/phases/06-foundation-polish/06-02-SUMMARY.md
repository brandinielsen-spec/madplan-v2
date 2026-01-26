---
phase: 06-foundation-polish
plan: 02
subsystem: ui
tags: [shopping-list, source-tracking, indkob, typescript]

# Dependency graph
requires:
  - phase: 06-01
    provides: Phase 6 initialization
provides:
  - Shopping list items display source (recipe name or "Tilfojet manuelt")
  - Indkoebspost type extended with kildeNavn property
  - addItems function accepts optional kildeNavn parameter
affects: [07-opskrifter-enhancement, 08-madplan-enhancement]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Source tracking via kildeNavn optional property"
    - "Graceful fallback when kildeNavn not provided ('Fra opskrift')"

key-files:
  created: []
  modified:
    - madplan-v2/src/lib/types.ts
    - madplan-v2/src/hooks/use-indkobsliste.ts
    - madplan-v2/src/components/indkob/shopping-item.tsx
    - madplan-v2/src/app/ugeplan/page.tsx

key-decisions:
  - "Extended existing Indkoebspost type rather than creating new type"
  - "kildeNavn is optional to support both existing data and graceful degradation"
  - "Fallback text 'Fra opskrift' when kildeNavn not provided by backend"
  - "Removed Badge component in favor of secondary text below item name"

patterns-established:
  - "Optional source tracking: use kildeNavn?: string for recipe attribution"
  - "Graceful fallback: display generic text when backend data incomplete"

# Metrics
duration: 4min
completed: 2026-01-26
---

# Phase 6 Plan 2: Shopping List Source Display Summary

**Shopping list items now display source - recipe name for items from meal plan, "Tilfojet manuelt" for manual items, with graceful "Fra opskrift" fallback**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-26T08:12:29Z
- **Completed:** 2026-01-26T08:16:01Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Extended Indkoebspost interface with optional kildeNavn property for recipe name tracking
- Updated addItems function to accept and pass kildeNavn to API
- Shopping items display source text below item name (recipe name, "Tilfojet manuelt", or "Fra opskrift" fallback)
- Day card passes recipe.titel when adding ingredients to shopping list

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend type and hook to support source name** - `14cfebb` (feat)
2. **Task 2: Update UI to display source and pass recipe name** - `8fc4867` (feat)

**Plan metadata:** (committed with this summary)

## Files Created/Modified

- `madplan-v2/src/lib/types.ts` - Added kildeNavn optional property to Indkoebspost interface
- `madplan-v2/src/hooks/use-indkobsliste.ts` - Extended addItems to accept kildeNavn parameter
- `madplan-v2/src/components/indkob/shopping-item.tsx` - Display source text for all items with getSourceText helper
- `madplan-v2/src/app/ugeplan/page.tsx` - Pass recipe.titel to addItems when adding ingredients

## Decisions Made

1. **kildeNavn as optional property** - Allows existing data to work (no migration needed) and provides graceful degradation if backend doesn't store the value
2. **Removed Badge component** - Replaced with secondary text line for cleaner UI that works for all source types
3. **"Fra opskrift" fallback** - When kildeNavn is not provided for recipe items, shows generic text rather than nothing

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward implementation following the plan specifications.

## User Setup Required

None - no external service configuration required.

Note: The n8n backend may or may not store kildeNavn. The frontend handles this gracefully:
- If backend stores kildeNavn: recipe name is displayed
- If backend doesn't store kildeNavn: "Fra opskrift" fallback is shown for recipe items

## Next Phase Readiness

- BUG-05 frontend implementation complete
- Backend can be updated independently to persist kildeNavn to Airtable
- Ready for 06-03 (Danish character fixes)

---
*Phase: 06-foundation-polish*
*Completed: 2026-01-26*
