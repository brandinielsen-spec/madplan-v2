---
phase: 04-smart-import
plan: 05
subsystem: ui
tags: [page-integration, import-flow, state-machine, form-submission, navigation]

# Dependency graph
requires:
  - phase: 04-03
    provides: UrlImportForm component for URL import
  - phase: 04-04
    provides: ImageImport component for image/camera import
  - phase: 04-02
    provides: RecipeForm component for preview/edit
provides:
  - Complete tilfoej page with all import flows integrated
  - State management for import -> preview -> save flow
  - Navigation to recipe detail after save
affects: [user-workflow, recipe-creation]

# Tech tracking
tech-stack:
  added: []
  patterns: [page-state-machine, form-submission-with-toast, client-side-navigation]

key-files:
  created: []
  modified:
    - madplan-v2/src/app/tilfoej/page.tsx

key-decisions:
  - "Three-state page state machine: select, preview, saving"
  - "Transform ingredienser from ImportResult format to RecipeForm format"
  - "Navigate to /opskrifter/{id} on successful save"
  - "Show source indicator badge for imported recipes"

patterns-established:
  - "Page-level state machine with discriminated union"
  - "Form submission with toast feedback"
  - "Back navigation preserves no state (reset to select)"

# Metrics
duration: n/a (pre-implemented)
completed: 2026-01-25
---

# Phase 4 Plan 5: Add Page Integration Summary

**Complete tilfoej page with URL import, image import, manual entry, preview/edit, and save flow**

## Performance

- **Duration:** Pre-implemented (verified working)
- **Completed:** 2026-01-25
- **Tasks:** 2 (implemented prior to GSD execution)
- **Files modified:** 1

## Accomplishments
- Tilfoej page with three import options (URL, Image, Manual)
- URL Import Card with UrlImportForm component
- Image Import Card with ImageImport component
- Manual Entry Card with "Opret ny opskrift" button
- Preview mode with RecipeForm and source indicator
- Save flow with POST to /api/madplan/opskrift
- Navigation to recipe detail page on success
- Error handling with toast messages
- Back navigation to reset to import selection

## Page State Machine

```typescript
type PageState =
  | { mode: 'select' }
  | { mode: 'preview'; data: ImportResult['data']; source: 'url' | 'image' | 'manual' }
  | { mode: 'saving'; data: ImportResult['data']; source: 'url' | 'image' | 'manual' }
```

## User Flows

1. **URL Import:** Paste URL → Click import → See preview → Edit → Save → Navigate to detail
2. **Image Import:** Take/select photo → Confirm → OCR → Preview → Edit → Save → Navigate
3. **Manual Entry:** Click "Opret ny opskrift" → Fill form → Save → Navigate to detail

## Files Modified

| File | Lines | Purpose |
|------|-------|---------|
| `madplan-v2/src/app/tilfoej/page.tsx` | 223 | Complete import page with all three flows |

## Key Components Used

- `UrlImportForm` - URL paste and import button
- `ImageImport` - Camera/gallery capture with OCR
- `RecipeForm` - Preview and edit imported/manual recipe
- `AppShell` - Layout wrapper with navigation

## API Integration

- POST `/api/madplan/opskrift` - Create new recipe
- Response includes `id` for navigation to detail page

## Issues Encountered

- n8n workflow was missing BilledeUrl and Kilde fields (fixed during verification)
- EjerId format issue in n8n workflow (fixed)

## Deviations from Plan

None - page was implemented according to plan specification.

---
*Phase: 04-smart-import*
*Completed: 2026-01-25*
