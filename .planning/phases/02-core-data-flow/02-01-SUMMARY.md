---
phase: 02-core-data-flow
plan: 01
subsystem: data-layer
tags: [swr, typescript, date-fns, shadcn-ui]

dependency_graph:
  requires:
    - "01-01": "Next.js app shell"
    - "01-02": "App layout with navigation"
  provides:
    - "SWR global provider with fetcher"
    - "TypeScript types matching v1 n8n responses"
    - "ISO week calculation utilities"
    - "Additional shadcn/ui components"
  affects:
    - "02-02": "API hooks will use SWR provider"
    - "02-03": "Ugeplan will use types and week-utils"
    - "02-04": "Indkoebsliste will use types"
    - "02-05": "Opskrifter will use types"

tech_stack:
  added:
    - swr@2.3.8
    - date-fns@4.1.0
    - use-long-press@3.3.0
    - sonner (via shadcn)
    - vaul (via shadcn drawer)
    - cmdk (via shadcn command)
  patterns:
    - "SWRConfig provider pattern"
    - "Global fetcher with error handling"
    - "ISO 8601 week calculations"

key_files:
  created:
    - madplan-v2/src/lib/types.ts
    - madplan-v2/src/lib/week-utils.ts
    - madplan-v2/src/providers/swr-provider.tsx
    - madplan-v2/src/components/ui/checkbox.tsx
    - madplan-v2/src/components/ui/command.tsx
    - madplan-v2/src/components/ui/dialog.tsx
    - madplan-v2/src/components/ui/drawer.tsx
    - madplan-v2/src/components/ui/input.tsx
    - madplan-v2/src/components/ui/scroll-area.tsx
    - madplan-v2/src/components/ui/sonner.tsx
    - madplan-v2/src/components/ui/toggle.tsx
    - madplan-v2/src/components/ui/toggle-group.tsx
  modified:
    - madplan-v2/package.json
    - madplan-v2/src/app/layout.tsx

decisions:
  - decision: "revalidateOnFocus: false"
    rationale: "Better mobile experience - avoid refetches on app focus"
  - decision: "shouldRetryOnError: false"
    rationale: "Manual retry via user action preferred for error recovery"
  - decision: "Toaster in SWRProvider"
    rationale: "Single global Toaster instance for all pages"

metrics:
  duration: "~10 minutes"
  completed: "2026-01-24"
---

# Phase 02 Plan 01: Data Layer Foundation Summary

SWR provider with global fetcher, TypeScript types matching v1 n8n workflows, ISO week utilities using date-fns.

## What Was Built

### TypeScript Types (types.ts)
Interfaces that match the v1 n8n workflow response shapes:

| Type | Purpose |
|------|---------|
| `ApiResponse<T>` | Generic wrapper for all API responses |
| `Ejer` | Owner/user context (id, navn) |
| `Opskrift` | Recipe with ingredients and instructions |
| `DagEntry` | Single day entry in week plan |
| `Ugeplan` | Week plan with 7 days |
| `Indkoebspost` | Shopping list item |
| `DAGE` / `DagNavn` | Day names constant and type |

### Week Utilities (week-utils.ts)
ISO 8601 week calculation functions using date-fns:

| Function | Purpose |
|----------|---------|
| `getCurrentWeek()` | Get current ISO year and week number |
| `navigateWeek()` | Navigate to prev/next week (handles year boundary) |
| `getDateFromISOWeek()` | Convert year+week to Date |
| `getWeekDates()` | Get array of 7 dates for a week |
| `formatDayDate()` | Format date as "24. jan" in Danish |
| `formatWeekLabel()` | Format as "Uge 4, 2026" |

### SWR Provider (swr-provider.tsx)
Global SWR configuration wrapped around app:

- **fetcher**: Simple fetch with error handling
- **revalidateOnFocus**: false (mobile-friendly)
- **shouldRetryOnError**: false (manual retry)
- **dedupingInterval**: 5000ms
- **Toaster**: Global toast notifications via sonner

### shadcn/ui Components Added
9 new components for Phase 2 features:

| Component | Usage |
|-----------|-------|
| sonner | Toast notifications |
| checkbox | Shopping list toggles |
| input | Search and manual add |
| scroll-area | Recipe picker scrolling |
| toggle-group | Cards/list view toggle |
| drawer | Mobile recipe picker |
| command | Recipe search with keyboard |
| toggle | View toggle internals |
| dialog | Modal dialogs (drawer dependency) |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| b8d10e0 | chore | Install dependencies and shadcn components |
| 514638d | feat | Add TypeScript types and week utilities |
| 14b3063 | feat | Add SWR provider with Toaster |

## Verification Results

1. `npm ls swr date-fns use-long-press` - All packages installed
2. UI components present - All 7 required + 2 auto-dependencies
3. `npx tsc --noEmit` - TypeScript compiles without errors
4. Dev server runs without errors

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Ready for 02-02 (API Hooks):**
- SWR provider in place with global fetcher
- TypeScript types ready for hook return types
- Week utilities ready for API query parameters

**Dependencies satisfied:**
- types.ts exports all required interfaces
- week-utils.ts exports all required functions
- SWRProvider wraps app in layout.tsx
