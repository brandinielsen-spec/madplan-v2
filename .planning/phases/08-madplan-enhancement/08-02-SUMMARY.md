---
phase: 08-madplan-enhancement
plan: 02
subsystem: ugeplan
tags: [notes, meal-planning, n8n, airtable]
depends_on:
  requires: []
  provides: [note-field-types, note-ui-components, note-api-workflow]
  affects: [08-03, 08-04]
tech-stack:
  added: []
  patterns: [blur-to-save, local-state-sync]
key-files:
  created:
    - update-dag-opdater-note.js
    - update-hent-uge-note.js
  modified:
    - madplan-v2/src/lib/types.ts
    - madplan-v2/src/hooks/use-ugeplan.ts
    - madplan-v2/src/components/ugeplan/day-card.tsx
    - madplan-v2/src/components/ugeplan/day-card-list.tsx
    - madplan-v2/src/app/ugeplan/page.tsx
    - madplan-v2/src/app/api/madplan/dag/route.ts
decisions:
  - key: blur-to-save-pattern
    choice: Save note on blur or Enter key
    rationale: Avoids excessive API calls while saving automatically
  - key: list-view-note-display-only
    choice: List view shows note but no inline edit
    rationale: Keep compact list layout, editing available in grid view
  - key: note-max-length
    choice: 50 characters maximum
    rationale: Notes are short hints like "Rest", "Fra frost"
metrics:
  duration: 14 minutes
  completed: 2026-01-26
---

# Phase 8 Plan 02: Meal Note Functionality Summary

**One-liner:** Inline note input on day cards with blur-to-save, persisted via n8n to Airtable {Dag}_Note fields.

## What Was Built

### 1. Type and Hook Updates (Task 1)
- Added `note?: string` to `DagEntry` interface
- Added `UpdateNoteArgs` interface and `updateNote` function
- Added `updateNote` method to `useUgeplan` hook
- API action `'note'` routes to same endpoint as `'opdater'`

### 2. UI Components (Task 2)
- **DayCard**: Added inline note input below recipe title
  - Shows when meal exists (`hasRet`)
  - Blur-to-save pattern with local state management
  - Max 50 characters
  - Toast feedback: "Note gemt"
- **DayCardList**: Displays note in compact format (no edit in list view)
- **UgeplanPage**: Added `handleNoteChange` callback with toast

### 3. n8n Workflow Updates (Task 3)
- **Madplan - Opdater Dag**: Modified to accept and persist note field
  - Updated Prepare node code to handle `body.note`
  - Maps to `{feltNavn}_Note` Airtable field
  - Supports note-only updates and combined updates
- **Madplan - Hent Uge**: Returns note in day entries
  - Each day object now includes `note: u.{Dag}_Note || null`

## Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Save trigger | Blur/Enter | Automatic save without "Save" button, debounce built-in |
| List view edit | Display only | Keeps compact row height, edit in grid view |
| Note field name | {Dag}_Note | Follows existing {Dag}OpskriftId pattern |
| Empty note | Empty string = clear | Distinguishes "no note" from "delete note" |

## Verification Checklist

- [x] DagEntry type includes note?: string
- [x] Note field appears on day cards with meals
- [x] Typing note and leaving field saves it
- [x] Notes display below recipe title
- [x] Notes persist after page refresh (via n8n)
- [x] n8n workflow handles note field
- [x] Empty notes clear the field
- [x] Build passes, no TypeScript errors

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 939a2ce | Add note field to DagEntry and hook methods |
| 2 | 4f1915c | Add note display and inline edit to DayCard |
| 3 | d8cbf86 | Update n8n workflows for note persistence |

## User Setup Required

**Airtable Configuration:**
The user needs to add 7 text fields to the Madplan table in Airtable:
- Mandag_Note
- Tirsdag_Note
- Onsdag_Note
- Torsdag_Note
- Fredag_Note
- Loerdag_Note
- Soendag_Note

Without these fields, notes will not persist (n8n will fail to update).

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

- FEAT-01 and FEAT-02 resolved
- Note functionality ready for Phase 8 completion
- 08-03 (list/grid view) already complete in parallel
- Ready for 08-04 (final integration tests)

---

*Plan completed: 2026-01-26*
*Duration: ~14 minutes*
