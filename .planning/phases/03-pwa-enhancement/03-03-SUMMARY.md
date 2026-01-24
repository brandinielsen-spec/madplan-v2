---
phase: 03-pwa-enhancement
plan: 03
subsystem: pwa
tags: [service-worker, offline, caching, localStorage, swr]

# Dependency graph
requires:
  - phase: 02-core-data-flow
    provides: SWR hooks and data layer for caching
provides:
  - Service worker with network-first API caching
  - SWR localStorage cache persistence
  - Offline status detection hook
  - Offline banner component
affects: [future-features]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Network-first caching strategy for API routes
    - localStorage SWR cache persistence
    - useSyncExternalStore for online status

key-files:
  created:
    - madplan-v2/public/sw.js
    - madplan-v2/src/lib/sw-register.ts
    - madplan-v2/src/hooks/use-online-status.ts
    - madplan-v2/src/components/layout/offline-banner.tsx
    - madplan-v2/src/components/service-worker-registration.tsx
  modified:
    - madplan-v2/src/providers/swr-provider.tsx
    - madplan-v2/src/app/layout.tsx

key-decisions:
  - "Network-first for API routes, cache-first for static assets"
  - "2-second debounce before showing offline banner"
  - "SWR cache persisted to 'madplan-cache' localStorage key"

patterns-established:
  - "Service worker: network-first for dynamic data, cache-first for static"
  - "Offline banner: debounce to prevent flicker on unstable connections"
  - "SWR cache provider: restore on init, save on beforeunload"

# Metrics
duration: 5min
completed: 2026-01-24
---

# Phase 3 Plan 3: Offline Support Summary

**Service worker with network-first API caching, SWR localStorage persistence, and debounced offline banner**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-24T15:33:42Z
- **Completed:** 2026-01-24T15:38:54Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Service worker caches API responses with network-first strategy
- SWR cache persists to localStorage for offline fallback
- Offline banner appears after 2-second debounce when offline
- App shows cached data when network is unavailable

## Task Commits

Each task was committed atomically:

1. **Task 1: Create service worker and registration utility** - `d9a37c5` (feat)
2. **Task 2: Create offline status hook and banner component** - `a9a12c7` (feat)
3. **Task 3: Integrate offline support into app** - `49018e5` (feat)

## Files Created/Modified
- `public/sw.js` - Service worker with network-first API caching, cache-first for static
- `src/lib/sw-register.ts` - Service worker registration utility
- `src/hooks/use-online-status.ts` - Hook using useSyncExternalStore for online/offline status
- `src/components/layout/offline-banner.tsx` - Amber banner with 2-second debounce
- `src/components/service-worker-registration.tsx` - Client component wrapper for SW registration
- `src/providers/swr-provider.tsx` - Added localStorage cache provider
- `src/app/layout.tsx` - Integrated SW registration and offline banner

## Decisions Made
- Network-first for API routes ensures fresh data when online, cached data when offline
- 2-second debounce prevents banner flickering on unstable connections (per RESEARCH pitfall 5)
- localStorage chosen over IndexedDB - simpler and sufficient for meal plan data size
- SWR cache saved on beforeunload to persist across sessions

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 3 PWA Enhancement is now complete (all 3 plans done)
- Service worker registers on app load
- Offline experience functional with cached data
- Ready for Phase 4: Smart Import

---
*Phase: 03-pwa-enhancement*
*Completed: 2026-01-24*
