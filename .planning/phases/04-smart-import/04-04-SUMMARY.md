---
phase: 04-smart-import
plan: 04
subsystem: ui
tags: [image-capture, camera, gallery, ocr, base64, url-detection, file-input]

# Dependency graph
requires:
  - phase: 04-01
    provides: API route /api/madplan/import-billede for image OCR
  - phase: 04-02
    provides: RecipeForm component for preview/edit after import
provides:
  - ImageImport component with camera/gallery capture
  - URL detection flow with user choice
  - Error handling with retry and manual fallback
affects: [04-05, tilfoej-page]

# Tech tracking
tech-stack:
  added: []
  patterns: [state-machine-for-import-flow, hidden-file-input-pattern, android-camera-workaround]

key-files:
  created:
    - madplan-v2/src/components/import/image-import.tsx
  modified: []

key-decisions:
  - "Use kilde field to detect URL in OCR response (not separate detectedUrl field)"
  - "Show URL choice only when kilde present in import response"
  - "30-second timeout on both image OCR and URL import fetches"
  - "Accept image/*,application/pdf for camera input to fix Android 14/15 bug"

patterns-established:
  - "State machine with union type for import flow (idle/preview/loading/urlDetected/error)"
  - "Hidden file inputs with refs for camera/gallery separation"
  - "AbortController + setTimeout for request timeouts"

# Metrics
duration: 4min
completed: 2026-01-25
---

# Phase 4 Plan 4: Image Import Summary

**ImageImport component with camera/gallery capture, preview confirmation, URL detection handling, and error states**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-25T07:49:37Z
- **Completed:** 2026-01-25T07:53:12Z
- **Tasks:** 2
- **Files created:** 1

## Accomplishments
- Created ImageImport component with complete state machine
- Two buttons: "Tag billede" (camera) and "Vaelg billede" (gallery)
- Image preview with "Brug dette billede" confirmation before OCR
- URL detection flow: choice between URL import and OCR text
- Error state with "Proev igen" and "Tilfoej manuelt" options
- Android 14/15 camera workaround in accept attribute

## Task Commits

Each task was committed atomically:

1. **Task 1+2: Create ImageImport component** - `e1260cd` (feat)
   - Combined into single commit as component was built holistically

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `madplan-v2/src/components/import/image-import.tsx` | 301 | Image capture with OCR and URL detection |

## Component API

```typescript
interface ImageImportProps {
  onImportSuccess: (data: ImportResult['data']) => void
  onManualEntry: () => void
}
```

## State Machine

```typescript
type ImageState =
  | { status: 'idle' }
  | { status: 'preview'; base64: string }
  | { status: 'loading'; message: string }
  | { status: 'urlDetected'; url: string; ocrData: ImportResult['data'] }
  | { status: 'error'; message: string }
```

## Decisions Made
- Used existing `kilde` field from ImportResult to detect URLs (n8n workflow populates this if URL found in image)
- Camera input uses `accept="image/*,application/pdf"` to work around Android 14/15 Chrome bug where camera option is missing
- 30-second timeout on all fetch calls with AbortController
- Base64 image cleared automatically on state transitions (memory management)

## Deviations from Plan

None - plan executed exactly as written.

Note: Tasks 1 and 2 were combined into a single implementation and commit since the component was designed holistically with all states from the start. Both tasks' verification criteria are met.

## Issues Encountered

None.

## Next Phase Readiness
- ImageImport ready for integration in tilfoej page (04-05)
- Works with existing /api/madplan/import-billede endpoint
- Works with existing /api/madplan/import-url endpoint for URL detection fallback
- Calls onImportSuccess to hand off data to RecipeForm preview

---
*Phase: 04-smart-import*
*Completed: 2026-01-25*
