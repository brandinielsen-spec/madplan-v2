# Phase 7: Opskrifter Enhancement - Research

**Researched:** 2026-01-26
**Domain:** Recipe favorites persistence, tags management, filtering, shopping list integration
**Confidence:** HIGH

## Summary

Phase 7 completes the recipe organization features that were planned for v2.0 but not fully implemented. The analysis reveals that the UI components and frontend patterns already exist - the missing pieces are primarily backend persistence and one new feature (add recipe ingredients to shopping list from recipe detail page).

**Current state:**
1. **Favorites (BUG-01):** UI works, optimistic updates work, but n8n workflow `/madplan/opskrift/opdater` may not exist or may not be responding. The frontend calls `POST /api/madplan/opskrift/favorit` which proxies to `${N8N_BASE}/madplan/opskrift/opdater` with `{ opskriftId, fields: { Favorit: true/false } }`.

2. **Tags (BUG-02):** Complete UI exists (TagInput, TagChip, detail page tag management). API endpoint exists at `/api/madplan/opskrift/tags` which calls same n8n endpoint. Issue is likely the same - n8n workflow needs to exist/respond.

3. **Tag Filter (BUG-03):** Already fully implemented in `opskrifter/page.tsx`. FilterBar component handles tag selection, client-side filtering uses AND logic with `selectedTags.every()`. This requirement may already be complete.

4. **Add to Shopping List (FEAT-03):** This feature exists on the ugeplan page (DayCard has shopping cart button) but NOT on the recipe detail page. Need to add a button to `opskrifter/[id]/page.tsx` that calls `addItems(recipe.ingredienser, recipe.titel)`.

**Primary recommendation:** Verify n8n workflow exists for `/madplan/opskrift/opdater`. If not, create it. Then add "Add to shopping list" button on recipe detail page. The frontend code is mostly ready - this is primarily a backend verification/creation task.

## Standard Stack

This phase uses only existing libraries - no new dependencies needed.

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| swr | 2.3.8 | Data fetching with optimistic updates | Already used throughout app |
| lucide-react | 0.563.0 | Heart, Tag, ShoppingCart icons | Already used |
| sonner | latest | Toast notifications | Already used |
| cmdk | 1.1.1 | Tag autocomplete | Already used in TagInput |

### Components Already Built
| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| FavoriteButton | `components/opskrifter/favorite-button.tsx` | Heart toggle with animation | Complete |
| TagInput | `components/opskrifter/tag-input.tsx` | Combobox for adding tags | Complete |
| TagChip | `components/opskrifter/tag-chip.tsx` | Badge with X remove | Complete |
| FilterBar | `components/opskrifter/filter-bar.tsx` | Filter by favorites/tags | Complete |

**Installation:**
```bash
# No installation needed - all dependencies and components already present
```

## Architecture Patterns

### Current Flow Analysis

**Favorites Flow (Current):**
```
1. User clicks FavoriteButton
2. toggleFavorite() in use-opskrifter.ts
3. Optimistic update via SWR mutate()
4. POST /api/madplan/opskrift/favorit
5. Proxy to N8N: ${N8N_BASE}/madplan/opskrift/opdater
   Body: { opskriftId, fields: { Favorit: boolean } }
6. [POTENTIAL ISSUE] n8n workflow may not exist
```

**Tags Flow (Current):**
```
1. User adds/removes tag on detail page
2. updateTags() in use-opskrifter.ts
3. Optimistic update via SWR mutate()
4. POST /api/madplan/opskrift/tags
5. Proxy to N8N: ${N8N_BASE}/madplan/opskrift/opdater
   Body: { opskriftId, fields: { Tags: string[] } }
6. [POTENTIAL ISSUE] Same n8n workflow as favorites
```

**Tag Filtering (Current - Already Complete):**
```
1. FilterBar shows all unique tags from recipes
2. User clicks tag chips to toggle selection
3. selectedTags state in opskrifter/page.tsx
4. Client-side filtering with useMemo
5. AND logic: recipe must have ALL selected tags
```

**Add to Shopping List from Ugeplan (Already Working):**
```
1. DayCard shows ShoppingCart button when recipe linked
2. handleAddToShoppingList() in ugeplan/page.tsx
3. Finds recipe by opskriftId
4. Calls addItems(recipe.ingredienser, recipe.titel)
5. POST /api/madplan/indkob for each ingredient
```

### Pattern 1: N8N Update Recipe Workflow
**What:** Single n8n workflow to update any fields on a recipe
**Expected endpoint:** `${N8N_BASE}/madplan/opskrift/opdater`
**Expected method:** POST
**Expected body:**
```json
{
  "opskriftId": "recXXX",
  "fields": {
    "Favorit": true,
    "Tags": ["Quick", "Italian"]
  }
}
```

**n8n workflow structure:**
```
Webhook Trigger -> Airtable Update -> Respond
```

**Airtable operation:**
- Table: Opskrifter
- Action: Update record by ID
- Fields: Dynamic from request body

### Pattern 2: Add to Shopping List from Recipe Detail
**What:** Button on recipe detail page to add all ingredients to shopping list
**Where:** `app/opskrifter/[id]/page.tsx`
**How:** Reuse existing `useIndkobsliste` hook and `addItems()` function

```typescript
// Current pattern from ugeplan/page.tsx - reuse exactly
const { addItems } = useIndkobsliste(ejerId, aar, uge)

const handleAddToShoppingList = async () => {
  if (!opskrift?.ingredienser?.length) {
    toast.error('Ingen ingredienser')
    return
  }

  const toastId = toast.loading(`Tilfojer ${opskrift.ingredienser.length} ingredienser...`)

  try {
    const { added, failed } = await addItems(opskrift.ingredienser, opskrift.titel)
    if (failed === 0) {
      toast.success(`${added} ingredienser tilfojet til indkob`, { id: toastId })
    } else {
      toast.warning(`${added} af ${added + failed} tilfojet`, { id: toastId })
    }
  } catch {
    toast.error('Kunne ikke tilfoeje ingredienser', { id: toastId })
  }
}
```

### Anti-Patterns to Avoid
- **Creating new API endpoints when proxies exist:** The `/api/madplan/opskrift/favorit` and `/tags` routes already exist and work - the issue is n8n, not Next.js
- **Duplicating shopping list logic:** Reuse the exact pattern from ugeplan, don't create variations
- **Server-side tag filtering:** Keep using client-side filtering for instant feedback

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Favorite toggle | New API route | Existing `/api/madplan/opskrift/favorit` | Route exists, works |
| Tag management | New API route | Existing `/api/madplan/opskrift/tags` | Route exists, works |
| Tag filtering | Server filtering | Existing client-side filtering | Already complete |
| Add ingredients | New hook | Existing `useIndkobsliste.addItems()` | Pattern proven |

**Key insight:** This phase is mostly backend verification (n8n) and one component addition (shopping button on detail page). The frontend patterns and components are ready.

## Common Pitfalls

### Pitfall 1: Assuming Frontend Bug When Backend Missing
**What goes wrong:** Debugging React code when n8n workflow doesn't exist
**Why it happens:** Frontend shows optimistic update, then quietly rolls back
**How to avoid:** First verify n8n endpoint responds: `curl ${N8N_BASE}/madplan/opskrift/opdater`
**Warning signs:** Favorites/tags work momentarily then revert on page refresh

### Pitfall 2: Week Context for Shopping List
**What goes wrong:** Adding items to wrong week's shopping list
**Why it happens:** useIndkobsliste requires (ejerId, aar, uge)
**How to avoid:** On recipe detail page, use `getCurrentWeek()` for current week
**Warning signs:** Items appear in unexpected week's list

### Pitfall 3: Airtable Field Names
**What goes wrong:** Sending lowercase `favorit` when Airtable expects `Favorit`
**Why it happens:** Case sensitivity in Airtable field names
**How to avoid:** Check actual Airtable field names, use exact casing in n8n
**Warning signs:** 422 or silent failure from Airtable

### Pitfall 4: Tags as Array vs Comma-Separated
**What goes wrong:** Tags created as single "Tag1,Tag2" option instead of two options
**Why it happens:** Airtable multi-select expects array, not string
**How to avoid:** Send `["Tag1", "Tag2"]` not `"Tag1,Tag2"`
**Warning signs:** Single tag with commas appears in UI

### Pitfall 5: No Recipe Name in Shopping List
**What goes wrong:** Items show "Fra opskrift" instead of actual recipe name
**Why it happens:** kildeNavn not being passed/stored in n8n workflow
**How to avoid:** Phase 6 already added this support - verify n8n workflow passes kildeNavn through
**Warning signs:** Phase 6 fallback text showing instead of recipe name

## Code Examples

### N8N Workflow: Update Opskrift Fields

**Webhook Configuration:**
- Method: POST
- Path: `/madplan/opskrift/opdater`
- Authentication: None (or match existing pattern)

**Airtable Update Node:**
```javascript
// Operation: Update
// Base ID: From environment
// Table: Opskrifter
// Record ID: {{ $json.opskriftId }}
// Fields: {{ $json.fields }}

// This allows updating any combination of fields:
// - Favorit (boolean)
// - Tags (array of strings)
// - Or any other fields in future
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "recXXX",
    "fields": { ... }
  }
}
```

### Recipe Detail Page - Add Shopping List Button

```typescript
// In app/opskrifter/[id]/page.tsx
// Add to imports
import { ShoppingCart } from 'lucide-react'
import { useIndkobsliste } from '@/hooks/use-indkobsliste'
import { getCurrentWeek } from '@/lib/week-utils'

// Inside component, get week context
const { aar, uge } = getCurrentWeek()
const { addItems, isAddingMultiple } = useIndkobsliste(ejerId, aar, uge)

// Handler function
const handleAddToShoppingList = async () => {
  if (!opskrift?.ingredienser?.length) {
    toast.error('Opskriften har ingen ingredienser')
    return
  }

  const toastId = toast.loading(
    `Tilfojer ${opskrift.ingredienser.length} ingredienser...`,
    { duration: Infinity }
  )

  try {
    const { added, failed } = await addItems(opskrift.ingredienser, opskrift.titel)
    if (failed === 0) {
      toast.success(`${added} ingredienser tilfojet til indkob`, { id: toastId })
    } else if (added > 0) {
      toast.warning(`${added} af ${added + failed} tilfojet`, { id: toastId })
    } else {
      toast.error('Kunne ikke tilfoeje ingredienser', { id: toastId })
    }
  } catch {
    toast.error('Kunne ikke tilfoeje ingredienser', { id: toastId })
  }
}

// JSX - Add button after ingredients card
<Button
  onClick={handleAddToShoppingList}
  disabled={isAddingMultiple || !opskrift?.ingredienser?.length}
  className="w-full"
>
  <ShoppingCart className="h-4 w-4 mr-2" />
  Tilfoej til indkobsliste
</Button>
```

### Verifying Tag Filter Works

```typescript
// In opskrifter/page.tsx - ALREADY IMPLEMENTED
// The filter logic in filteredOpskrifter useMemo:

// Tag filter (AND logic - must have ALL selected tags)
if (selectedTags.length > 0) {
  result = result.filter((o) =>
    selectedTags.every((tag) => (o.tags ?? []).includes(tag))
  )
}

// This is complete. BUG-03 may already be resolved.
// Test: Add tags to recipes, verify filter chips appear, verify filtering works
```

## What Needs Verification

### 1. N8N Workflow Existence
Check if `/madplan/opskrift/opdater` endpoint exists in n8n:

```bash
# Test from terminal or n8n workflow management
curl -X POST ${N8N_WEBHOOK_URL}/madplan/opskrift/opdater \
  -H "Content-Type: application/json" \
  -d '{"opskriftId":"test","fields":{"Favorit":true}}'
```

**If 404:** Create the workflow
**If 500:** Debug Airtable connection
**If 200:** Frontend should work - check optimistic update rollback

### 2. Airtable Schema
Verify these fields exist in Opskrifter table:

| Field | Type | Required For |
|-------|------|--------------|
| Favorit | Checkbox | BUG-01 |
| Tags | Multi-select | BUG-02, BUG-03 |

### 3. Tag Filter UI
Test the existing filter implementation:
1. Create recipes with tags via Airtable directly
2. Load /opskrifter page
3. Verify tag chips appear in FilterBar
4. Verify clicking tags filters recipes correctly

## Existing Code Locations

| Requirement | Relevant Files | Status |
|-------------|----------------|--------|
| BUG-01 Favorites | `use-opskrifter.ts:toggleFavorite`, `favorite-button.tsx`, `/api/madplan/opskrift/favorit/route.ts` | Frontend complete, needs n8n |
| BUG-02 Tags | `use-opskrifter.ts:updateTags`, `tag-input.tsx`, `tag-chip.tsx`, `/api/madplan/opskrift/tags/route.ts` | Frontend complete, needs n8n |
| BUG-03 Filter | `opskrifter/page.tsx`, `filter-bar.tsx` | Likely complete |
| FEAT-03 Shopping | `[id]/page.tsx` (needs button), `use-indkobsliste.ts:addItems` | Hook ready, needs UI |

## Open Questions

1. **N8N Workflow Status**
   - What we know: Frontend calls `/madplan/opskrift/opdater`
   - What's unclear: Does this workflow exist? Is it active?
   - Recommendation: Use n8n MCP tools to check workflow list, create if missing

2. **Airtable Field Configuration**
   - What we know: Types defined in types.ts (Favorit: boolean, Tags: string[])
   - What's unclear: Are these fields actually created in Airtable?
   - Recommendation: Verify via Airtable or test API calls

3. **Tag Filter Completion Status**
   - What we know: Code exists and looks complete
   - What's unclear: Has it been tested with real data?
   - Recommendation: Test before marking BUG-03 as new work

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `use-opskrifter.ts` - toggleFavorite, updateTags implementation
- Codebase analysis: `favorite-button.tsx`, `tag-input.tsx`, `tag-chip.tsx` - UI components
- Codebase analysis: `filter-bar.tsx`, `opskrifter/page.tsx` - filtering implementation
- Codebase analysis: `use-indkobsliste.ts` - addItems function
- Codebase analysis: `ugeplan/page.tsx` - working add-to-shopping-list pattern
- Codebase analysis: API routes in `/api/madplan/opskrift/` - existing endpoints

### Secondary (MEDIUM confidence)
- Phase 5 research - established patterns for favorites and tags
- Phase 6 research - shopping list kildeNavn pattern

### Tertiary (LOW confidence)
- N8N workflow existence - needs verification with n8n tools

## Metadata

**Confidence breakdown:**
- Favorites frontend: HIGH - code exists, pattern clear
- Tags frontend: HIGH - code exists, pattern clear
- Tag filtering: HIGH - code exists and appears complete
- Shopping list button: HIGH - pattern exists in ugeplan
- N8N backend: LOW - needs verification

**Research date:** 2026-01-26
**Valid until:** 2026-02-26 (30 days - stable domain)

## Recommended Plan Structure

Given the findings, this phase should be organized as:

1. **Plan 1: Backend Verification & N8N Workflow**
   - Verify n8n workflow exists for `/madplan/opskrift/opdater`
   - Create workflow if missing
   - Test favorites and tags persistence
   - Verifies BUG-01 and BUG-02

2. **Plan 2: Tag Filter Verification**
   - Test existing filter implementation
   - Verify BUG-03 is actually complete
   - Document any issues found

3. **Plan 3: Add to Shopping List Button**
   - Add button to recipe detail page
   - Reuse existing addItems pattern
   - Implements FEAT-03
