---
phase: 04-smart-import
plan: 02
subsystem: ui
tags: [react-hook-form, zod, validation, form, recipe, useFieldArray]

# Dependency graph
requires:
  - phase: 04-01
    provides: Form libraries (react-hook-form, zod, @hookform/resolvers)
provides:
  - Textarea shadcn/ui component
  - RecipeForm component with dynamic ingredients
  - RecipeFormData export type for submit handlers
affects: [04-03, 04-04, 04-05, tilfoej-page]

# Tech tracking
tech-stack:
  added: []
  patterns: [useFieldArray-for-dynamic-lists, valueAsNumber-for-inputs]

key-files:
  created:
    - madplan-v2/src/components/ui/textarea.tsx
    - madplan-v2/src/components/import/recipe-form.tsx
  modified: []

key-decisions:
  - "Use z.number() with valueAsNumber instead of z.coerce for Zod 4 compatibility"
  - "Transform ingredienser between string[] (external) and {value}[] (internal for useFieldArray)"
  - "highlightImported uses bg-amber-50 for subtle visual indication"

patterns-established:
  - "Dynamic form arrays with useFieldArray, object wrapper for array items"
  - "Register options: { valueAsNumber: true } for number inputs"

# Metrics
duration: 6min
completed: 2026-01-25
---

# Phase 4 Plan 2: Recipe Form Summary

**RecipeForm component with Zod validation and dynamic ingredient management using react-hook-form**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-25
- **Completed:** 2026-01-25
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- Installed shadcn/ui Textarea component for multi-line text input
- Created RecipeForm component with full validation and dynamic features
- Implemented useFieldArray for add/remove ingredient rows
- Added highlightImported prop for visual indication of pre-filled fields
- Exports RecipeFormData type for consistent submit handling

## Task Commits

Each task was committed atomically:

1. **Task 1: Add shadcn Textarea component** - `d1175b7` (feat)
2. **Task 2: Create RecipeForm component** - `e0177c8` (feat)

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `madplan-v2/src/components/ui/textarea.tsx` | 18 | Multi-line text input (shadcn/ui) |
| `madplan-v2/src/components/import/recipe-form.tsx` | 234 | Recipe form with validation |

## Component API

```typescript
interface RecipeFormProps {
  defaultValues?: {
    titel?: string
    portioner?: number
    ingredienser?: string[]
    fremgangsmaade?: string
    billedeUrl?: string
    kilde?: string
  }
  onSubmit: (data: RecipeFormData) => void | Promise<void>
  isSubmitting?: boolean
  submitLabel?: string  // Default: "Gem opskrift"
  highlightImported?: boolean  // Show amber bg on pre-filled fields
}
```

## Validation Rules
- **titel:** Required (min 1 character)
- **portioner:** Required number, minimum 1
- **ingredienser:** At least 1 ingredient required, each must have content
- **fremgangsmaade:** Optional
- **billedeUrl, kilde:** Read-only display when present

## Decisions Made
- Used `z.number()` with `valueAsNumber: true` register option instead of `z.coerce.number()` for Zod 4 + @hookform/resolvers compatibility
- Ingredienser internally stored as `{value: string}[]` for useFieldArray, transformed to `string[]` on submit
- Minimum 1 ingredient row always shown (cannot remove last row)
- Kilde and billedeUrl displayed read-only with hidden inputs to preserve values

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Zod 4 + @hookform/resolvers type mismatch**
- **Found during:** Task 2
- **Issue:** `z.coerce.number()` creates `unknown` type that doesn't match @hookform/resolvers expected types
- **Fix:** Used `z.number()` with `{ valueAsNumber: true }` register option
- **Files modified:** recipe-form.tsx
- **Commit:** e0177c8

## Issues Encountered

None beyond the Zod 4 type issue (auto-fixed).

## Next Phase Readiness
- RecipeForm ready for import preview flow (04-03)
- RecipeForm ready for manual entry flow (04-05)
- Component supports both empty forms and pre-filled import data
- highlightImported provides visual feedback for imported fields

---
*Phase: 04-smart-import*
*Completed: 2026-01-25*
