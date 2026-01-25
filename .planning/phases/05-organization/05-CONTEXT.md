# Phase 5: Organization - Context

**Gathered:** 2026-01-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Organize and find recipes through favorites, tags, search, and filtering. Users can mark recipes as favorites, add user-defined tags, search by title, and filter the recipe list. Recipe editing, categories (beyond tags), and advanced sorting are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Favorit interaction
- Heart icon in top-right corner of recipe cards, overlaid on card
- Instant fill + scale pulse animation on tap
- No toast confirmation — animation is feedback enough
- Heart also appears in recipe detail page header (next to title)

### Tag management
- Free-form input with auto-suggestions of existing tags as user types
- Tag editing only on recipe detail page (not from cards)
- Existing tags displayed as colored chips with X to remove
- All tags use single accent color from earth tone palette

### Search behavior
- Live filtering as user types — no search button needed
- Search matches recipe title only (not description or tags)
- Search field sticky at top of Opskrifter page, below header
- X button appears in search field to clear when text present

### Filter UI
- Horizontal scrollable row of tag chips below search field
- Multi-select with AND logic — recipes must have ALL selected tags
- Heart chip in same row as tag chips for "favorites only" filter
- Combining: search + tag filters + favorites filter all work together

### Claude's Discretion
- Active filter chip styling (filled vs outlined, checkmarks, etc.)
- Exact animation timing for favorite pulse
- Tag input component implementation (combobox pattern)
- Empty state when no recipes match filters

</decisions>

<specifics>
## Specific Ideas

- Favorite animation should feel satisfying — instant fill with a quick scale pulse like Instagram
- Tag chips should feel consistent with the earth tone palette — single color keeps it clean
- Live search should feel fast and responsive — no perceived delay

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-organization*
*Context gathered: 2026-01-25*
