# Phase 5: Organization - Research

**Researched:** 2026-01-25
**Domain:** Recipe organization (favorites, tags, search, filtering)
**Confidence:** HIGH

## Summary

Phase 5 adds organization features to the recipe system: favorite marking, user-defined tags, title search, and filtering. The existing codebase already has search functionality (title filtering) implemented on the Opskrifter page, so this phase extends that pattern to include favorites and tags.

The implementation uses:
- **Client-side filtering** with `useMemo` for instant feedback (already proven in codebase)
- **SWR optimistic updates** with `mutate()` for favorite toggle (pattern established in STATE.md)
- **Badge component** for tag chips with X remove button
- **Command + Popover composition** for tag autocomplete input (cmdk already installed)
- **Custom heart animation** via CSS keyframes in Tailwind

**Primary recommendation:** Extend the existing client-side filtering pattern in `opskrifter/page.tsx` to include favorites and tags. Add Popover component for tag input combobox. Use optimistic updates for favorite toggle to ensure instant visual feedback.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| swr | 2.3.8 | Data fetching + cache | Already used, supports optimistic updates |
| cmdk | 1.1.1 | Autocomplete/combobox | Already installed for Command component |
| lucide-react | 0.563.0 | Heart icon | Already used throughout app |
| @radix-ui/react-toggle | 1.1.10 | Toggle primitive | Already installed for ToggleGroup |

### Supporting (Need to Add)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-popover | latest | Popover primitive | Required for Combobox pattern |

### shadcn/ui Components Needed
| Component | Status | Purpose |
|-----------|--------|---------|
| Badge | Installed | Tag chips display |
| Command | Installed | Tag autocomplete list |
| Popover | **NOT INSTALLED** | Tag input dropdown container |
| Input | Installed | Search field |
| Toggle | Installed | Filter chip active state |

**Installation:**
```bash
npx shadcn@latest add popover
```

## Architecture Patterns

### Recommended Component Structure
```
src/
├── components/
│   └── opskrifter/
│       ├── recipe-card.tsx         # Add heart overlay
│       ├── recipe-list-item.tsx    # Add heart icon
│       ├── favorite-button.tsx     # NEW: Reusable heart toggle
│       ├── tag-input.tsx           # NEW: Combobox for adding tags
│       ├── tag-chip.tsx            # NEW: Badge with X remove
│       ├── filter-bar.tsx          # NEW: Search + tag chips + fav filter
│       └── empty-state.tsx         # NEW: No results message
├── hooks/
│   └── use-opskrifter.ts           # Extend with toggleFavorite, updateTags
├── lib/
│   └── types.ts                    # Extend Opskrift with favorit, tags
└── app/
    └── opskrifter/
        ├── page.tsx                # Add filter-bar, filtering logic
        └── [id]/
            └── page.tsx            # Add favorite button, tag management
```

### Pattern 1: Client-Side Filtering with useMemo
**What:** Filter recipes in browser memory, no server roundtrip
**When to use:** Dataset is small (< 1000 items), instant feedback required
**Why:** Already implemented for search in `opskrifter/page.tsx`

```typescript
// Source: Existing pattern in opskrifter/page.tsx
const filteredOpskrifter = useMemo(() => {
  let result = opskrifter

  // Search filter (title only)
  if (search.trim()) {
    const searchLower = search.toLowerCase()
    result = result.filter((o) => o.titel.toLowerCase().includes(searchLower))
  }

  // Tag filter (AND logic - must have ALL selected tags)
  if (selectedTags.length > 0) {
    result = result.filter((o) =>
      selectedTags.every((tag) => o.tags?.includes(tag))
    )
  }

  // Favorites filter
  if (showFavoritesOnly) {
    result = result.filter((o) => o.favorit === true)
  }

  return result
}, [opskrifter, search, selectedTags, showFavoritesOnly])
```

### Pattern 2: SWR Optimistic Update for Favorites
**What:** Update UI immediately, sync to server in background
**When to use:** Toggle actions where instant feedback is critical
**Why:** STATE.md specifies `mutate()` for optimistic toggle

```typescript
// Source: SWR docs + STATE.md pattern
const toggleFavorite = async (opskriftId: string) => {
  const currentRecipe = opskrifter.find((o) => o.id === opskriftId)
  if (!currentRecipe) return

  const newFavorit = !currentRecipe.favorit

  // Optimistic update
  mutate(
    `/api/madplan/opskrifter?ejerId=${ejerId}`,
    opskrifter.map((o) =>
      o.id === opskriftId ? { ...o, favorit: newFavorit } : o
    ),
    {
      revalidate: false, // Don't refetch immediately
      rollbackOnError: true, // Revert on failure
    }
  )

  // Server sync
  try {
    await fetch('/api/madplan/opskrift/favorit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opskriftId, favorit: newFavorit }),
    })
  } catch {
    // Rollback handled by SWR
  }
}
```

### Pattern 3: Combobox with Popover + Command
**What:** Autocomplete input with dropdown suggestions
**When to use:** Tag input with existing tag suggestions
**Why:** Official shadcn/ui pattern, cmdk already installed

```typescript
// Source: shadcn/ui Combobox documentation
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

function TagInput({ existingTags, onAddTag }: Props) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder="Tilfoej tag..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Soeg tags..." />
          <CommandList>
            <CommandEmpty>
              {value && (
                <button onClick={() => onAddTag(value)}>
                  Opret "{value}"
                </button>
              )}
            </CommandEmpty>
            <CommandGroup>
              {existingTags
                .filter((tag) => tag.toLowerCase().includes(value.toLowerCase()))
                .map((tag) => (
                  <CommandItem key={tag} onSelect={() => onAddTag(tag)}>
                    {tag}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

### Anti-Patterns to Avoid
- **Server-side filtering for small datasets:** Adds latency, complexity. Use client-side.
- **Debouncing live search:** User decided no debounce - instant filtering is fast enough
- **Toast on favorite toggle:** User decided animation is feedback enough
- **Tags on recipe cards:** User decided tag editing only on detail page

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Autocomplete dropdown | Custom dropdown with position logic | Popover + Command | Handles positioning, keyboard nav, a11y |
| Keyboard navigation | Custom keydown handlers | cmdk CommandList | Built-in arrow keys, Enter, Escape |
| Unique tags | Manual Set management | Dedupe on server in Airtable | Multi-select field handles uniqueness |
| Heart filled state | Custom SVG path toggling | fill="currentColor" + class toggle | Lucide Heart accepts fill prop |

**Key insight:** The combobox pattern for tag input looks simple but handles edge cases like:
- Dropdown positioning (Popover handles viewport collision)
- Keyboard navigation (cmdk handles arrow keys, Enter, Escape)
- Focus management (Radix handles focus trap)
- Creating new options (CommandEmpty slot for "create new" UI)

## Common Pitfalls

### Pitfall 1: Heart Icon Fill State
**What goes wrong:** Lucide Heart icon is outline-only by default
**Why it happens:** Lucide icons are stroke-based, not fill-based
**How to avoid:** Use `fill="currentColor"` when favorited, combine with CSS
```typescript
<Heart
  className={cn(
    "transition-all",
    isFavorite && "fill-terracotta-500 text-terracotta-500"
  )}
/>
```
**Warning signs:** Heart stays outline when clicked

### Pitfall 2: Airtable Empty Checkbox Response
**What goes wrong:** Unchecked checkboxes return `undefined`, not `false`
**Why it happens:** Airtable omits fields with empty/null values from API response
**How to avoid:** Always coalesce: `recipe.favorit ?? false`
**Warning signs:** TypeScript errors about boolean | undefined

### Pitfall 3: Tag Array vs String in Airtable
**What goes wrong:** Tags sent as comma-separated string instead of array
**Why it happens:** Confusion about Airtable multi-select format
**How to avoid:** Send tags as array: `["tag1", "tag2"]` not `"tag1,tag2"`
**Warning signs:** Single option created with comma in name

### Pitfall 4: Optimistic Update Key Mismatch
**What goes wrong:** mutate() doesn't update the correct cache key
**Why it happens:** Cache key must exactly match useSWR key
**How to avoid:** Use same key construction: `/api/madplan/opskrifter?ejerId=${ejerId}`
**Warning signs:** UI doesn't update optimistically

### Pitfall 5: AND vs OR Logic Confusion
**What goes wrong:** Filter shows recipes with ANY tag instead of ALL tags
**Why it happens:** Using `.some()` instead of `.every()`
**How to avoid:** User decided AND logic - use `selectedTags.every()`
**Warning signs:** Too many results when multiple tags selected

## Code Examples

Verified patterns from existing codebase and official sources:

### Favorite Button Component
```typescript
// Source: Pattern derived from existing toggle-group.tsx + Lucide docs
'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  className?: string
}

export function FavoriteButton({ isFavorite, onToggle, className }: FavoriteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault() // Prevent card link navigation
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        "p-2 rounded-full bg-white/80 backdrop-blur-sm",
        "hover:bg-white transition-colors",
        className
      )}
      aria-label={isFavorite ? "Fjern fra favoritter" : "Tilfoej til favoritter"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all duration-200",
          isFavorite
            ? "fill-terracotta-500 text-terracotta-500 scale-110"
            : "text-sand-600"
        )}
      />
    </button>
  )
}
```

### Heart Pulse Animation (CSS)
```css
/* Source: Tailwind animation docs + community patterns */
/* Add to globals.css */

@keyframes heart-pulse {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate-heart-pulse {
  animation: heart-pulse 0.4s ease-in-out;
}
```

### Tag Chip with Remove Button
```typescript
// Source: shadcn/ui Badge + GitHub issue #3647 pattern
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface TagChipProps {
  tag: string
  onRemove?: () => void
  selected?: boolean
  onClick?: () => void
}

export function TagChip({ tag, onRemove, selected, onClick }: TagChipProps) {
  return (
    <Badge
      variant={selected ? "default" : "outline"}
      className={cn(
        "cursor-pointer transition-colors",
        onClick && "hover:bg-olive-100",
        selected && "bg-olive-500 hover:bg-olive-600"
      )}
      onClick={onClick}
    >
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  )
}
```

### Extended Opskrift Type
```typescript
// Source: Extend existing types.ts
export interface Opskrift {
  id: string
  ejerId: string
  titel: string
  portioner: number
  ingredienser: string[]
  fremgangsmaade: string
  oprettetDato: string
  billedeUrl?: string
  kilde?: string
  // NEW fields for Phase 5
  favorit?: boolean      // Airtable Checkbox field - may be undefined if unchecked
  tags?: string[]        // Airtable Multi-select field - may be undefined if empty
}
```

### All Tags Extraction
```typescript
// Source: Client-side pattern for tag suggestions
const allTags = useMemo(() => {
  const tagSet = new Set<string>()
  opskrifter.forEach((o) => {
    o.tags?.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}, [opskrifter])
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Server-side search | Client-side filtering | Current | Instant feedback, no loading states |
| Separate search/filter states | Combined filter object | Current | Simpler state management |
| useSWRMutation for writes | useSWR mutate() | SWR 2.0 | Shared cache, simpler optimistic updates |

**Deprecated/outdated:**
- cmdk 0.2.x: Current version is 1.1.1, API has changed
- useSWR bound mutate vs global: Both work, bound mutate preferred for single-key updates

## Airtable Schema Changes

### New Fields Required
| Field Name | Field Type | Airtable Config | Default |
|------------|------------|-----------------|---------|
| Favorit | Checkbox | - | Unchecked |
| Tags | Multiple select | Allow adding new options | Empty |

### API Format
```json
// Reading a recipe with new fields
{
  "id": "recXXX",
  "fields": {
    "Titel": "Pasta Carbonara",
    "Favorit": true,                    // Only present if checked
    "Tags": ["Italian", "Quick"]        // Array of strings
  }
}

// Updating favorite
{
  "fields": {
    "Favorit": true                     // or false to uncheck
  }
}

// Updating tags
{
  "fields": {
    "Tags": ["Tag1", "Tag2"]            // Full array, replaces existing
  }
}
```

### n8n Workflow Changes
| Workflow | Change Needed |
|----------|---------------|
| Hent Opskrifter | Include Favorit, Tags fields in response |
| Opret Opskrift | Accept optional Favorit, Tags fields |
| **NEW** Toggle Favorit | PATCH single recipe with Favorit field |
| **NEW** Update Tags | PATCH single recipe with Tags array |

## Open Questions

Things that couldn't be fully resolved:

1. **Tag creation permissions**
   - What we know: Airtable multi-select requires creator+ permissions to add new options
   - What's unclear: Current n8n/Airtable setup permission level
   - Recommendation: Use `typecast: true` in Airtable API to auto-create new tags

2. **Tag limit**
   - What we know: Airtable multi-select supports up to 10,000 options
   - What's unclear: Practical UX limit for tags per recipe
   - Recommendation: No hard limit initially, revisit if UX suffers

## Sources

### Primary (HIGH confidence)
- Existing codebase: `opskrifter/page.tsx` - filtering pattern
- Existing codebase: `use-opskrifter.ts` - SWR hook pattern
- Existing codebase: `[id]/page.tsx` - detail page structure
- Existing codebase: `command.tsx` - cmdk already installed
- Existing codebase: `badge.tsx` - Badge component available

### Secondary (MEDIUM confidence)
- [SWR Mutation docs](https://swr.vercel.app/docs/mutation) - optimistic update pattern
- [shadcn/ui Combobox](https://ui.shadcn.com/docs/components/combobox) - Popover + Command composition
- [Airtable Checkbox docs](https://support.airtable.com/docs/checkbox-field) - boolean format
- [Airtable Multi-select docs](https://support.airtable.com/docs/multiple-select-field) - array format
- [Lucide Heart icon](https://lucide.dev/icons/heart) - fill property

### Tertiary (LOW confidence)
- [Tailwind animation guide](https://tailwindcss.com/docs/animation) - keyframes pattern
- [shadcn/ui Issue #3647](https://github.com/shadcn-ui/ui/issues/3647) - InputTags pattern

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already in use or officially documented
- Architecture: HIGH - extends existing patterns in codebase
- Pitfalls: MEDIUM - some derived from Airtable community discussions
- Animations: MEDIUM - CSS patterns are well-documented

**Research date:** 2026-01-25
**Valid until:** 2026-02-25 (30 days - stable domain)
