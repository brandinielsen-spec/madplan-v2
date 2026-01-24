---
phase: 01-foundation
plan: 02
subsystem: ui

tags: [pwa, manifest, navigation, app-shell, mobile-nav, lucide-react]

# Dependency graph
requires:
  - phase: 01-01
    provides: Earth tone theme, shadcn/ui components, Tailwind v4 configuration
provides:
  - PWA manifest with app name, colors, and icons
  - Bottom navigation component with 4 tabs
  - Header and AppShell layout components
  - 5 placeholder pages (home, ugeplan, opskrifter, tilfoej, indkob)
  - Mobile-first app shell ready for content
affects:
  - 02-01 (recipes page will replace placeholder)
  - 02-02 (weekly plan page will replace placeholder)
  - 02-03 (shopping list page will replace placeholder)
  - 04-01 (recipe import page will replace placeholder)

# Tech tracking
tech-stack:
  added:
    - sharp (dev dependency for icon generation)
  patterns:
    - AppShell wrapper pattern for consistent page layout
    - Fixed bottom navigation with active state detection
    - PWA manifest.ts in App Router
    - Client component for usePathname navigation state

key-files:
  created:
    - madplan-v2/src/app/manifest.ts
    - madplan-v2/public/icons/icon-192.png
    - madplan-v2/public/icons/icon-512.png
    - madplan-v2/public/icons/icon-maskable.png
    - madplan-v2/public/icons/apple-touch-icon.png
    - madplan-v2/src/components/layout/mobile-nav.tsx
    - madplan-v2/src/components/layout/header.tsx
    - madplan-v2/src/components/layout/app-shell.tsx
    - madplan-v2/src/app/ugeplan/page.tsx
    - madplan-v2/src/app/opskrifter/page.tsx
    - madplan-v2/src/app/tilfoej/page.tsx
    - madplan-v2/src/app/indkob/page.tsx
  modified:
    - madplan-v2/src/app/page.tsx
    - madplan-v2/src/app/layout.tsx

key-decisions:
  - "AppShell pattern: Header + main content + MobileNav for consistent layout across all pages"
  - "Bottom navigation with 4 items: Ugeplan, Opskrifter, Tilfoej, Indkob (home accessible via logo)"
  - "Placeholder icons: Solid terracotta color, to be replaced with designed icons later"
  - "Active nav detection via pathname.startsWith() for nested routes"

patterns-established:
  - "Page structure: All pages wrapped in <AppShell title='...'> for consistent layout"
  - "Navigation: Use MobileNav component for app-wide navigation"
  - "Card usage: Use shadcn/ui Card for content blocks"
  - "Skeleton: Use Skeleton component for placeholder content previews"

# Metrics
duration: ~15min
completed: 2026-01-24
---

# Phase 1 Plan 02: App Shell Summary

**PWA-capable app shell with bottom navigation, 4 main routes, and earth-tone styled placeholder pages**

## Performance

- **Duration:** ~15 min (across sessions with checkpoint)
- **Started:** 2026-01-24
- **Completed:** 2026-01-24
- **Tasks:** 4/4
- **Files modified:** 16

## Accomplishments

- Created PWA manifest with Madplan app name and terracotta theme color
- Generated 4 placeholder icons in terracotta color (192px, 512px, maskable, apple-touch)
- Built MobileNav component with 4 navigation items and active state highlighting
- Created Header and AppShell wrapper components for consistent page layout
- Implemented 5 placeholder pages with appropriate Danish content and section-specific UI patterns
- Verified PWA installability and navigation functionality

## Task Commits

Each task was committed atomically:

1. **Task 1: Create PWA manifest and icons** - `ded91ac` (feat)
2. **Task 2: Create layout components** - `d7553c6` (feat)
3. **Task 3: Create placeholder pages** - `222d30f` (feat)
4. **Task 4: Human verification checkpoint** - (no commit, checkpoint only)

## Files Created/Modified

- `madplan-v2/src/app/manifest.ts` - PWA manifest with name, colors, icon references
- `madplan-v2/public/icons/*.png` - 4 placeholder icons (192, 512, maskable, apple-touch)
- `madplan-v2/src/components/layout/mobile-nav.tsx` - Bottom navigation with 4 tabs
- `madplan-v2/src/components/layout/header.tsx` - Top header with title and actions slot
- `madplan-v2/src/components/layout/app-shell.tsx` - Main layout wrapper combining Header and MobileNav
- `madplan-v2/src/app/page.tsx` - Home/dashboard with welcome and quick links
- `madplan-v2/src/app/ugeplan/page.tsx` - Weekly plan placeholder with day cards
- `madplan-v2/src/app/opskrifter/page.tsx` - Recipe list placeholder with search and skeleton cards
- `madplan-v2/src/app/tilfoej/page.tsx` - Add recipe placeholder with URL import hint
- `madplan-v2/src/app/indkob/page.tsx` - Shopping list placeholder with checkbox items
- `madplan-v2/src/app/layout.tsx` - Updated with apple-touch-icon link

## Decisions Made

- **AppShell pattern:** Consistent Header + content + MobileNav structure for all pages
- **4-tab navigation:** Ugeplan, Opskrifter, Tilfoej, Indkob (home accessible from any page via future logo tap)
- **Active state detection:** Using `pathname.startsWith(href)` to highlight active section including nested routes
- **Placeholder icons:** Simple terracotta-colored squares; proper designed icons deferred to later

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Complete app shell ready for content implementation
- All 4 main routes accessible via bottom navigation
- PWA manifest valid and app installable on mobile
- Ready for Plan 03: Data layer foundation (Airtable integration)
- TypeScript and build passing without errors

---
*Phase: 01-foundation*
*Completed: 2026-01-24*
