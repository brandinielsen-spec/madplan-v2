---
phase: 02-core-data-flow
plan: 03
subsystem: data-hooks
tags: [swr, typescript, hooks, optimistic-updates]

dependency_graph:
  requires:
    - "02-01": "TypeScript types and SWR provider"
  provides:
    - "useEjere hook for owner list"
    - "useOpskrifter hook for recipes"
    - "useUgeplan hook with mutations"
    - "useIndkobsliste hook with optimistic updates"
  affects:
    - "02-04": "Indkoebsliste page will use useIndkobsliste"
    - "02-05": "Opskrifter page will use useOpskrifter"
    - "02-06": "Ugeplan page will use useUgeplan"

tech_stack:
  added: []
  patterns:
    - "Conditional SWR fetching (ejerId ? key : null)"
    - "useSWRMutation for POST/PUT operations"
    - "Optimistic updates with rollbackOnError"
    - "keepPreviousData for smooth transitions"

key_files:
  created:
    - madplan-v2/src/hooks/use-ejere.ts
    - madplan-v2/src/hooks/use-opskrifter.ts
    - madplan-v2/src/hooks/use-ugeplan.ts
    - madplan-v2/src/hooks/use-indkobsliste.ts
  modified: []

decisions:
  - decision: "mutate() for optimistic toggle instead of useSWRMutation"
    rationale: "SWR 2.x useSWRMutation optimisticData has limited type support; direct mutate() provides cleaner typing and more control"
  - decision: "Sorted items in useIndkobsliste"
    rationale: "UX improvement - unchecked items first, then by source (ret before manuel), then alphabetically in Danish"

metrics:
  duration: "~5 minutes"
  completed: "2026-01-24"
---

# Phase 02 Plan 03: API Hooks Summary

SWR data hooks for all entities with typed returns, mutations, and optimistic updates for responsive UI.

## What Was Built

### useEjere Hook (use-ejere.ts)
Simple hook for fetching owner list:

```typescript
const { ejere, isLoading, isError, error } = useEjere()
```

- Fetches from `/api/madplan/ejere`
- Returns empty array while loading
- Used for owner selector/context

### useOpskrifter Hook (use-opskrifter.ts)
Conditional hook for fetching recipes:

```typescript
const { opskrifter, isLoading, isError, mutate } = useOpskrifter(ejerId)
```

- Conditional fetch: only fetches when ejerId is provided
- Returns empty array while loading or no ejerId
- mutate exposed for manual refresh

### useUgeplan Hook (use-ugeplan.ts)
Week plan hook with day mutations:

```typescript
const {
  ugeplan,
  isLoading,
  updateDay,
  deleteDay,
  isMutating
} = useUgeplan(ejerId, aar, uge)
```

| Feature | Description |
|---------|-------------|
| `keepPreviousData` | Smooth transition when navigating weeks |
| `updateDay(dag, ret, opskriftId?)` | Set meal for a day |
| `deleteDay(dag)` | Clear meal from a day |
| `isMutating` | Combined loading state for UI feedback |

Day names are capitalized automatically for Airtable field compatibility.

### useIndkobsliste Hook (use-indkobsliste.ts)
Shopping list hook with optimistic toggle:

```typescript
const {
  items,           // Sorted: unchecked first, then by kilde, then alpha
  isLoading,
  toggleItem,      // Optimistic update
  addItem,         // Manual item addition
  isAdding
} = useIndkobsliste(ejerId, aar, uge)
```

| Feature | Description |
|---------|-------------|
| `optimisticData` | Checkbox toggles instantly |
| `rollbackOnError` | Reverts if API fails |
| `revalidate: false` | No refetch after toggle (optimistic is truth) |
| Sorting | Unchecked first, ret before manuel, then Danish alphabetical |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| bdffbc4 | feat | Add useEjere and useOpskrifter SWR hooks |
| d6726b2 | feat | Add useUgeplan SWR hook with mutations |
| b4996e8 | feat | Add useIndkobsliste SWR hook with optimistic updates |

## Verification Results

1. `npx tsc --noEmit` - TypeScript compiles without errors
2. All 4 hook files exist in src/hooks/
3. useUgeplan has `keepPreviousData: true`
4. useIndkobsliste has `optimisticData` and `rollbackOnError: true`
5. All hooks export their main functions

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed SWR 2.x optimisticData type signature**

- **Found during:** Task 3
- **Issue:** Plan used `optimisticData: (current, { arg })` signature which is not valid in SWR 2.x useSWRMutation
- **Fix:** Used mutate() directly with optimisticData option instead of useSWRMutation
- **Files modified:** use-indkobsliste.ts
- **Commit:** b4996e8

## Next Phase Readiness

**Ready for 02-04 (Indkoebsliste page):**
- useIndkobsliste hook ready with optimistic toggle
- items pre-sorted for display
- toggleItem and addItem convenience methods available

**Ready for 02-05 (Opskrifter page):**
- useOpskrifter hook ready with conditional fetching
- mutate exposed for refresh after operations

**Ready for 02-06 (Ugeplan page):**
- useUgeplan hook ready with keepPreviousData
- updateDay/deleteDay convenience methods available
- isMutating state for loading indicators
