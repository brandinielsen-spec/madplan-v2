---
phase: 05-organization
plan: 02
subsystem: ui
tags: [favorite, heart, swr-optimistic, animation, recipe-card]

# Dependency graph
requires:
  - phase: 05-organization
    plan: 01
    provides: Types with favorit field, /api/madplan/opskrift/favorit endpoint, animate-heart-pulse CSS
provides:
  - FavoriteButton component with heart icon and pulse animation
  - toggleFavorite function in useOpskrifter hook with optimistic updates
  - Favorite toggle on recipe cards, list items, and detail page
affects: [05-03, 05-05]

# Tech tracking
tech-stack:
  added: []
  patterns: [swr-optimistic-update, callback-prop-pattern]

key-files:
  created:
    - madplan-v2/src/components/opskrifter/favorite-button.tsx
  modified:
    - madplan-v2/src/hooks/use-opskrifter.ts
    - madplan-v2/src/components/opskrifter/recipe-card.tsx
    - madplan-v2/src/components/opskrifter/recipe-list-item.tsx
    - madplan-v2/src/app/opskrifter/[id]/page.tsx

key-decisions:
  - "onToggleFavorite callback prop for card/list reusability"
  - "Heart pulse animation only on favorite (not unfavorite)"
  - "e.preventDefault + e.stopPropagation to prevent card navigation on click"

patterns-established:
  - "FavoriteButton with callback pattern for integration flexibility"
  - "SWR optimistic update with rollbackOnError"

# Metrics
duration: 4min
completed: 2026-01-25
---

# Phase 5 Plan 2: Favorite Toggle Summary

**FavoriteButton component with optimistic updates integrated into all recipe views**

## Performance

- **Duration:** 4 min 19 sec
- **Started:** 2026-01-25T20:05:58Z
- **Completed:** 2026-01-25T20:10:17Z
- **Tasks:** 2
- **Files created:** 1
- **Files modified:** 4

## Accomplishments
- Created FavoriteButton component with heart icon that fills when favorited
- Heart animates with pulse (animate-heart-pulse from 05-01) on favorite action
- Extended useOpskrifter hook with toggleFavorite function using SWR optimistic update
- Integrated FavoriteButton into recipe cards (top-right overlay on image)
- Integrated FavoriteButton into recipe list items (before chevron)
- Integrated FavoriteButton into recipe detail page (next to title in header)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create FavoriteButton and extend hook** - `8a0d334` (feat)
2. **Task 2: Integrate favorites into views** - `a607cd4` (feat)

## Files Created/Modified
- `madplan-v2/src/components/opskrifter/favorite-button.tsx` - FavoriteButton component (51 lines)
- `madplan-v2/src/hooks/use-opskrifter.ts` - Added toggleFavorite with optimistic update
- `madplan-v2/src/components/opskrifter/recipe-card.tsx` - Added FavoriteButton overlay on image
- `madplan-v2/src/components/opskrifter/recipe-list-item.tsx` - Added FavoriteButton before chevron
- `madplan-v2/src/app/opskrifter/[id]/page.tsx` - Added FavoriteButton next to title

## Decisions Made
- **Callback prop pattern:** FavoriteButton accepts onToggle callback, allowing parent to control toggle behavior. This enables reuse across different contexts.
- **Animation on favorite only:** Heart pulse animation triggers when isFavorite becomes true, providing positive feedback without animating on removal.
- **Event propagation control:** e.preventDefault() and e.stopPropagation() on click prevents card/link navigation when clicking the heart.

## Deviations from Plan

None - plan executed exactly as written.

## Concurrent Changes Observed

The detail page was also modified by another process (likely 05-03 tag integration) which added TagChip, TagInput imports and allTags/updateTags from the hook. Our FavoriteButton integration works alongside these changes.

## Issues Encountered

None

## Next Phase Readiness
- FavoriteButton ready for use in filter UI (05-05)
- toggleFavorite function can be passed to cards/list from opskrifter page
- Detail page now has both favorite and tags integration
- Cards and list items accept optional onToggleFavorite prop

---
*Phase: 05-organization*
*Completed: 2026-01-25*
