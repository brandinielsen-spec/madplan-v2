---
phase: 05-organization
plan: 01
subsystem: api
tags: [favorit, tags, popover, radix-ui, css-animation]

# Dependency graph
requires:
  - phase: 04-smart-import
    provides: types.ts with Opskrift/OpskriftInput interfaces
provides:
  - Opskrift and OpskriftInput types with favorit/tags fields
  - POST /api/madplan/opskrift/favorit endpoint
  - POST /api/madplan/opskrift/tags endpoint
  - animate-heart-pulse CSS animation
  - Popover component for tag selection
affects: [05-02, 05-03, 05-04, 05-05]

# Tech tracking
tech-stack:
  added: [@radix-ui/react-popover]
  patterns: [partial-update-api, airtable-optional-fields]

key-files:
  created:
    - madplan-v2/src/app/api/madplan/opskrift/favorit/route.ts
    - madplan-v2/src/app/api/madplan/opskrift/tags/route.ts
    - madplan-v2/src/components/ui/popover.tsx
  modified:
    - madplan-v2/src/lib/types.ts
    - madplan-v2/src/app/globals.css

key-decisions:
  - "Optional fields for Airtable compatibility (undefined vs false/empty)"
  - "Proxy to /madplan/opskrift/opdater for partial updates"

patterns-established:
  - "Airtable checkbox: use ?? false when consuming"
  - "Airtable multi-select: use ?? [] when consuming"

# Metrics
duration: 4min
completed: 2026-01-25
---

# Phase 5 Plan 1: Organization Foundation Summary

**Extended types with favorit/tags, API routes for partial updates, heart animation, and Popover component**

## Performance

- **Duration:** 3 min 31 sec
- **Started:** 2026-01-25T20:00:10Z
- **Completed:** 2026-01-25T20:03:41Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Extended Opskrift and OpskriftInput interfaces with favorit (boolean) and tags (string[]) fields
- Created POST /api/madplan/opskrift/favorit endpoint for toggling favorite status
- Created POST /api/madplan/opskrift/tags endpoint for updating recipe tags
- Added heart-pulse keyframes animation and animate-heart-pulse utility class
- Installed shadcn Popover component with @radix-ui/react-popover

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend types and add Popover component** - `be0de9e` (feat)
2. **Task 2: Create API routes and CSS animation** - `f4e153d` (feat)

## Files Created/Modified
- `madplan-v2/src/lib/types.ts` - Added favorit and tags fields to Opskrift/OpskriftInput
- `madplan-v2/src/components/ui/popover.tsx` - Popover component from shadcn/ui
- `madplan-v2/src/app/api/madplan/opskrift/favorit/route.ts` - POST handler for favorite toggle
- `madplan-v2/src/app/api/madplan/opskrift/tags/route.ts` - POST handler for tags update
- `madplan-v2/src/app/globals.css` - heart-pulse animation keyframes and utility class

## Decisions Made
- **Optional fields for Airtable:** Both favorit and tags are optional (?) because Airtable returns undefined for unchecked checkboxes and empty multi-selects. Consumers should use `recipe.favorit ?? false` and `recipe.tags ?? []`.
- **Partial update endpoint:** Both API routes proxy to `/madplan/opskrift/opdater` with a `fields` object for partial updates, following the pattern established for Airtable field updates.

## Deviations from Plan

None - plan executed exactly as written.

## User Setup Required

**External services require manual configuration.** The plan frontmatter specifies:
- Add `Favorit` field (Checkbox) to Opskrifter table in Airtable
- Add `Tags` field (Multiple select) to Opskrifter table in Airtable

These fields must exist in Airtable for the API routes to work. The n8n workflow `/madplan/opskrift/opdater` should already handle partial field updates.

## Issues Encountered

None

## Next Phase Readiness
- Types ready for use in hooks and components
- API routes ready for frontend integration
- Heart animation ready for FavoriteButton component
- Popover ready for tag selection combobox
- Airtable fields need to be created before testing with real data

---
*Phase: 05-organization*
*Completed: 2026-01-25*
