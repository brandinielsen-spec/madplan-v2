---
phase: 08
plan: 01
subsystem: ugeplan
tags: [react, week-picker, drawer, swr]

dependency-graph:
  requires:
    - 07: Opskrifter Enhancement (RecipePicker component)
  provides:
    - WeekPicker component for week selection
    - Cross-week meal addition capability
    - Updated RecipePicker with week selector
  affects:
    - 08-02: Note field (uses same DayCard)
    - 08-03: View toggle (shares ugeplan page)

tech-stack:
  added: []
  patterns:
    - Cross-week data fetching with SWR global mutate
    - Drawer state reset with useEffect

file-tracking:
  created:
    - madplan-v2/src/components/ugeplan/week-picker.tsx
  modified:
    - madplan-v2/src/components/ugeplan/recipe-picker.tsx
    - madplan-v2/src/hooks/use-ugeplan.ts
    - madplan-v2/src/app/ugeplan/page.tsx

decisions:
  - name: Week label format
    choice: "Denne uge, Naeste uge, Uge X, Uge Y"
    rationale: Per CONTEXT.md user decision
  - name: SWR global mutate for cross-week
    choice: Fetch target week's ugeplan ID, then invalidate cache after update
    rationale: Avoid modifying n8n workflow, work within existing API structure

metrics:
  duration: ~11 minutes
  completed: 2026-01-26
---

# Phase 8 Plan 01: Week Picker in RecipePicker Summary

WeekPicker component adds week selection to RecipePicker drawer, enabling users to add meals to current + 3 future weeks.

## What Was Built

### WeekPicker Component
- Horizontal row of 4 week tile buttons
- Labels: "Denne uge", "Naeste uge", "Uge X", "Uge Y"
- Selected state: terracotta-500 ring + terracotta-50 background
- Unselected: border + hover:bg-accent
- Touch-friendly: 44px minimum height

### RecipePicker Integration
- WeekPicker rendered below DrawerHeader, above search
- State for selectedWeek (defaults to current week)
- useEffect resets to current week when drawer opens
- handleSelect passes selectedWeek to parent onSelect callback

### Cross-Week Support (use-ugeplan.ts)
- New `addDayToWeek(targetWeek, dag, ret, opskriftId)` method
- Fetches target week's ugeplan to get its ID
- Makes POST to /api/madplan/dag with target week's ID
- Uses SWR's `globalMutate` to invalidate target week's cache
- Also refreshes current week data

### Page Updates (page.tsx)
- handleSelectMeal receives selectedWeek parameter
- Compares selected week to current displayed week
- Same week: uses existing updateDay
- Different week: uses new addDayToWeek
- Toast shows week number when adding to different week

## Verification

- [x] WeekPicker shows 4 weeks with correct labels
- [x] Current week pre-selected when drawer opens
- [x] npm run build passes
- [x] TypeScript compilation clean

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing onNoteChange in WeekContent commonProps**
- **Found during:** Build verification
- **Issue:** WeekContentProps had onNoteChange but it wasn't passed to DayCard via commonProps
- **Fix:** Added `onNoteChange: (note: string) => onNoteChange(dag, note)` to commonProps
- **Note:** This was a pre-existing incomplete feature from 08-02, auto-fixed to unblock build

## Commits

| Hash | Message |
|------|---------|
| 994eb6a | feat(08-01): create WeekPicker component for week selection |
| 12d1c95 | feat(08-01): integrate WeekPicker into RecipePicker and add cross-week support |

## Key Files

```
madplan-v2/src/components/ugeplan/week-picker.tsx    # New component
madplan-v2/src/components/ugeplan/recipe-picker.tsx  # Added WeekPicker integration
madplan-v2/src/hooks/use-ugeplan.ts                  # Added addDayToWeek method
madplan-v2/src/app/ugeplan/page.tsx                  # Updated handleSelectMeal
```

## Next Phase Readiness

**Ready for:** Plan 08-02 (Note field) and 08-03 (View toggle)
**Blockers:** None
**Concerns:** None

---

*Plan: 08-01*
*Completed: 2026-01-26*
