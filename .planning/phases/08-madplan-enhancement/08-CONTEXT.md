# Phase 8: Madplan Enhancement - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Improve the weekly meal plan experience. Users can add meals to any week (not just current), add short notes to meal entries, and toggle between list/grid views. Creating new meal plan features beyond these is out of scope.

</domain>

<decisions>
## Implementation Decisions

### Week Picker Design
- Horizontal row of clickable week tiles in "Tilfoej til madplan" dialog
- Show 4 weeks: current week + 3 future weeks
- Current week pre-selected by default
- Use relative labels: "Denne uge", "Naeste uge", "Uge X", "Uge Y"

### Note Input & Display
- Inline text field directly on meal card (not modal or tap-to-expand)
- Short hints only (few words like "Rest", "Fra frost", "Dobbelt portion")
- Note displayed below recipe title in smaller text
- Simple placeholder: "Tilfoej note"

### List/Grid Layouts
- Remember last used view (persist preference across sessions)
- Grid view: Balanced cards with medium image + title + note
- List view: Rows with small thumbnail + recipe name
- View toggle placed top right of page (near week navigation)

### Claude's Discretion
- Exact character limit for notes (keep it short)
- Toggle icon design (grid/list icons)
- Animation/transition between views
- How preference is persisted (localStorage)

</decisions>

<specifics>
## Specific Ideas

- Week tiles should feel tappable and clear which is selected
- Notes are intentionally brief - not for detailed instructions
- Both views should show the note when present

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 08-madplan-enhancement*
*Context gathered: 2026-01-26*
