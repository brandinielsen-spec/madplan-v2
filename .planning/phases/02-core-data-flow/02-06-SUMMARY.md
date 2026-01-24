---
phase: 02-core-data-flow
plan: 06
subsystem: opskrifter-ui
tags: [react, components, search, view-toggle, navigation]

dependency_graph:
  requires:
    - "02-02": "API routes for /api/madplan/opskrifter"
    - "02-03": "useOpskrifter and useEjere hooks"
  provides:
    - "RecipeCard component for visual grid"
    - "RecipeListItem component for compact list"
    - "Opskrifter page with search and view toggle"
    - "Recipe detail page /opskrifter/[id]"
  affects:
    - "04": "Smart Import phase may add real images to recipe cards"

tech_stack:
  added: []
  patterns:
    - "View toggle with ToggleGroup component"
    - "Client-side search filtering with useMemo"
    - "Letter placeholder for recipe visuals"
    - "AppShell headerLeft for back navigation"

key_files:
  created:
    - madplan-v2/src/components/opskrifter/recipe-card.tsx
    - madplan-v2/src/components/opskrifter/recipe-list-item.tsx
    - madplan-v2/src/app/opskrifter/[id]/page.tsx
  modified:
    - madplan-v2/src/app/opskrifter/page.tsx

decisions:
  - decision: "Letter placeholder for recipe images"
    rationale: "Images not in current schema; first letter of title provides visual distinction until Phase 4 adds image support"
  - decision: "Cards view as default"
    rationale: "Per CONTEXT.md decision - cards more visually engaging for recipe browsing"
  - decision: "Client-side search filtering"
    rationale: "Recipe count per user is small; no need for server-side search"

metrics:
  duration: "~10 minutes"
  completed: "2026-01-24"
---

# Phase 02 Plan 06: Opskrifter Page Summary

Recipe list view with card/list toggle, search filtering, and detail page for viewing ingredients and instructions.

## What Was Built

### RecipeCard Component (recipe-card.tsx)

Visual card for grid display:

```typescript
<RecipeCard recipe={opskrift} />
```

| Feature | Description |
|---------|-------------|
| Gradient background | olive-200 to sand-200 placeholder |
| Letter avatar | First letter of recipe title |
| Hover state | Ring highlight for tap feedback |
| Navigation | Links to /opskrifter/[id] |

### RecipeListItem Component (recipe-list-item.tsx)

Compact row for list display:

```typescript
<RecipeListItem recipe={opskrift} />
```

| Feature | Description |
|---------|-------------|
| Circular avatar | First letter in olive circle |
| Chevron indicator | Visual affordance for navigation |
| Hover state | Sand background highlight |
| Navigation | Links to /opskrifter/[id] |

### Opskrifter Page (app/opskrifter/page.tsx)

Main recipe list with search and view toggle:

| Feature | Description |
|---------|-------------|
| Search input | Real-time filtering by recipe title |
| View toggle | Cards (2-col grid) or List (compact rows) |
| Loading skeletons | Match current view mode |
| Empty states | Different messages for no recipes vs no search results |
| Error state | Network error message with retry hint |

### Recipe Detail Page (app/opskrifter/[id]/page.tsx)

Read-only recipe viewer:

| Feature | Description |
|---------|-------------|
| Back navigation | Arrow button to /opskrifter |
| Title and portions | Recipe header info |
| Ingredients card | Bullet list of ingredients |
| Instructions card | Formatted fremgangsmaade text |
| Not found state | Helpful message with back link |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| da0efc2 | feat | Create RecipeCard and RecipeListItem components |
| 321e0c7 | feat | Wire opskrifter page with data and view toggle |
| bc5aeeb | feat | Create recipe detail page with back navigation |

## Verification Results

1. `npx tsc --noEmit` - TypeScript compiles without errors
2. Components exist in src/components/opskrifter/
3. /opskrifter page loads without console errors
4. View toggle switches between cards and list
5. Search filters recipes by title
6. Tapping recipe navigates to detail page
7. Detail page shows ingredients and instructions

## Deviations from Plan

None - plan executed exactly as written.

## User Feedback

**Approved with notes:**

The recipe list functionality works correctly:
- Card/list toggle operates as expected
- Search filtering works
- Detail page displays recipe content

**Future feature request (out of scope):**
User requested showing actual recipe images instead of letter placeholders. This is intentionally deferred - the current schema does not include images, and the plan specified using visual placeholders. Image support may be considered for Phase 4 (Smart Import) when recipes could be enriched with additional metadata.

## Next Phase Readiness

**Phase 2 Progress:**
- Plan 06 complete
- Opskrifter page fully functional
- Recipe browsing and detail viewing operational

**Future Enhancement Noted:**
- Recipe images could be added when schema supports it
- RecipeCard and RecipeListItem designed to accommodate images later
