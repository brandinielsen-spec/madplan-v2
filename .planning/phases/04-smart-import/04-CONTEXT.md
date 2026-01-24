# Phase 4: Smart Import - Context

**Gathered:** 2026-01-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Import recipes from external sources (URLs and images) into the app. Users can paste a URL, take/upload a photo, or manually enter a recipe. Preview and edit before saving. This phase delivers the Tilføj tab functionality.

Out of scope: Organization features (tags, favorites, search) belong to Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Import entry point
- Lives in existing Tilføj tab (not a separate page or modal)
- URL input first with large paste field at top
- Image buttons secondary below URL field
- Include manual entry as third option ("Tilføj manuelt")
- After successful save → navigate to recipe detail page

### URL import experience
- Require button click to start import (not auto on paste)
- Simple spinner with "Henter opskrift..." during loading
- On failure: show error message with "Prøv igen" and "Tilføj manuelt" options
- No fallback to partial data — clear success or clear failure

### Image import experience
- Two separate buttons: "Tag billede" (camera) and "Vælg billede" (gallery/file picker)
- Show image preview with "Brug dette billede" confirm button before OCR starts
- If URL detected in image: ask user "Fandt URL — hent derfra?" vs "Brug OCR tekst"
- No quality guidance tips — keep interface clean

### Preview & edit flow
- Full recipe form: title, description, ingredients, instructions, portions, time, image
- Highlight auto-filled fields (subtle background color or icon)
- Validation before save: title AND ingredients required
- Empty/optional fields clearly indicated

### Claude's Discretion
- URL history (recent URLs during session) — implement if adds value
- Preview layout (full page vs modal/sheet) — choose based on form complexity
- Exact loading state animations
- Error message wording

</decisions>

<specifics>
## Specific Ideas

- Three-way import: URL (primary), Image (secondary), Manual (tertiary)
- Manual entry uses the same preview/edit form as import — consistent experience
- "Brug dette billede" confirmation prevents accidental OCR on wrong image
- User choice on URL-in-image detection — don't auto-decide

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-smart-import*
*Context gathered: 2026-01-25*
