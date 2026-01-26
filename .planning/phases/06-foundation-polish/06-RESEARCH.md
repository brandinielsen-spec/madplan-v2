# Phase 6: Foundation & Polish - Research

**Researched:** 2026-01-26
**Domain:** Danish character encoding, navigation structure, shopping list data display
**Confidence:** HIGH

## Summary

Phase 6 fixes three foundational issues in the Madplan app: incorrect Danish character display (using ASCII fallbacks like "oe" instead of proper "oe"), missing Home icon in the bottom navigation menu, and incomplete shopping list source attribution.

The codebase analysis reveals:
1. **Danish characters:** Multiple UI strings use ASCII approximations (Tilfoej, Indkob, proev, paa, etc.) instead of proper Danish characters. This is a systematic search-and-replace task across ~15 files.
2. **Bottom navigation:** Currently has 4 icons (Ugeplan, Opskrifter, Tilfoej, Indkob). Needs Home icon added as first item pointing to "/" route. The `Home` icon is already imported in `header.tsx`.
3. **Shopping list source:** Items have `kilde: 'ret' | 'manuel'` but display only shows "manuel" badge. Items from recipes should show the recipe name, requiring the n8n workflow to include recipe name in the data.

**Primary recommendation:** Fix Danish characters first (pure UI text changes), then update navigation (simple array modification), then tackle shopping list source display (requires n8n workflow changes or join logic in UI).

## Standard Stack

This phase uses only existing libraries - no new dependencies needed.

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lucide-react | 0.563.0 | Home icon | Already used, Home icon available |
| React 19 | 19.x | Component framework | Core stack |
| TypeScript | 5.x | Type safety | Core stack |

### Supporting
No additional libraries needed. This is a pure refactoring/bug-fix phase.

**Installation:**
```bash
# No installation needed - all dependencies already present
```

## Architecture Patterns

### Current File Structure (Relevant Files)

```
src/
|-- components/
|   |-- layout/
|   |   |-- mobile-nav.tsx      # Bottom navigation - needs Home icon
|   |   |-- header.tsx          # Already imports Home icon
|   |-- indkob/
|   |   |-- shopping-item.tsx   # Needs source display update
|   |   |-- category-group.tsx  # Groups items by source
|-- app/
|   |-- page.tsx                # Home page at "/" route
|   |-- indkob/page.tsx         # Shopping list page
|   |-- ugeplan/page.tsx        # Week plan page
|   |-- opskrifter/page.tsx     # Recipes page
|   |-- tilfoej/page.tsx        # Add recipe page
|-- lib/
|   |-- types.ts                # Indkoebspost type definition
```

### Pattern 1: Danish Character Mapping
**What:** Systematic replacement of ASCII fallbacks with proper Danish characters
**When to use:** All user-facing text in .tsx files
**Why:** Required for correct Danish UI per BUG-06

Mapping table:
| ASCII | Danish | Unicode |
|-------|--------|---------|
| oe    | oe       | U+00F8  |
| ae    | ae       | U+00E6  |
| aa    | aa       | U+00E5  |
| Oe    | Oe       | U+00D8  |
| Ae    | Ae       | U+00C6  |
| Aa    | Aa       | U+00C5  |

**Caution:** Only replace in display strings, NOT in:
- Variable names (e.g., `loerdag`, `soendag` in type definitions)
- File paths or route names
- API field names coming from Airtable

### Pattern 2: Navigation Item Structure
**What:** Adding Home as first navigation item
**Current structure:**
```typescript
// mobile-nav.tsx - CURRENT (4 items)
const navItems = [
  { href: "/ugeplan", icon: Calendar, label: "Ugeplan" },
  { href: "/opskrifter", icon: Book, label: "Opskrifter" },
  { href: "/tilfoej", icon: Plus, label: "Tilfoej" },  // Note: needs oe
  { href: "/indkob", icon: ShoppingCart, label: "Indkob" },  // Note: needs oe
];
```

**Target structure:**
```typescript
// mobile-nav.tsx - TARGET (5 items)
const navItems = [
  { href: "/", icon: Home, label: "Hjem" },
  { href: "/ugeplan", icon: Calendar, label: "Ugeplan" },
  { href: "/opskrifter", icon: Book, label: "Opskrifter" },
  { href: "/tilfoej", icon: Plus, label: "Tilfoej" },
  { href: "/indkob", icon: ShoppingCart, label: "Indkoeb" },
];
```

### Pattern 3: Shopping List Source Display
**What:** Showing recipe name as source for items from meal plan
**Current:** Items have `kilde: 'ret' | 'manuel'`
**Problem:** `'ret'` doesn't contain the actual recipe name

**Two solutions:**

**Option A (Backend change - recommended):**
Update `Indkoebspost` type and n8n workflow to include recipe name:
```typescript
export interface Indkoebspost {
  id: string
  ejerId: string
  aar: number
  uge: number
  navn: string
  kilde: 'ret' | 'manuel'
  kildeNavn?: string  // NEW: Recipe name when kilde='ret'
  afkrydset: boolean
}
```

**Option B (Frontend join - fallback):**
If n8n cannot be updated, show generic "Fra opskrift" text for items with `kilde='ret'`. Less ideal but still better than current state.

### Anti-Patterns to Avoid
- **Replacing characters in variable names:** Keep `loerdag`, `soendag` in code - only change display strings
- **Hardcoding 5 columns in nav CSS:** Keep flexible `justify-around` layout that handles any number of items
- **Creating new API endpoints:** Shopping list source should come from existing data flow

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icon for Home | Custom SVG | lucide-react Home | Already imported in header.tsx |
| Active route detection | Custom pathname parsing | Existing `pathname.startsWith(href)` or exact match | Pattern established |
| Danish character encoding | Manual string manipulation | Direct Unicode characters in source | React/Vite handle UTF-8 natively |

**Key insight:** All pieces exist - this phase is assembly, not creation.

## Common Pitfalls

### Pitfall 1: Partial Character Replacement
**What goes wrong:** Replacing "oe" in code identifiers like `loerdag`, `soendag`
**Why it happens:** Overzealous find-replace without context awareness
**How to avoid:** Only replace in:
  - String literals in JSX: `"Tilfoej"` -> `"Tilfoej"`
  - String literals in object values: `label: "Indkob"` -> `label: "Indkoeb"`
**Warning signs:** TypeScript errors about undefined properties

### Pitfall 2: Home Route Active State
**What goes wrong:** Home is always "active" because "/" is prefix of all routes
**Why it happens:** Using `pathname.startsWith(href)` for "/" route
**How to avoid:** Use exact match for home: `pathname === href` when `href === "/"`
```typescript
const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
```
**Warning signs:** Home icon stays highlighted on all pages

### Pitfall 3: Navigation Layout Breaking with 5 Items
**What goes wrong:** Icons get cramped or text wraps
**Why it happens:** Fixed width assumptions in CSS
**How to avoid:** Current `justify-around` flexbox handles this automatically
**Warning signs:** Test on narrow viewport (320px width)

### Pitfall 4: Shopping List Source Missing from API
**What goes wrong:** UI expects `kildeNavn` but n8n doesn't send it
**Why it happens:** Backend not updated alongside frontend
**How to avoid:** Coordinate n8n workflow update OR handle gracefully with fallback
**Warning signs:** `undefined` displayed as source name

### Pitfall 5: Character Encoding in Toast Messages
**What goes wrong:** Toast messages like `toast.success("tilfojet")` not updated
**Why it happens:** Toast calls spread across multiple files, easy to miss
**How to avoid:** Grep for all toast.* calls and update systematically
**Warning signs:** Notifications show ASCII characters while UI shows Danish

## Code Examples

### Danish Character Fixes - Key Files

**mobile-nav.tsx (navigation labels):**
```typescript
// BEFORE
{ href: "/tilfoej", icon: Plus, label: "Tilfoej" },
{ href: "/indkob", icon: ShoppingCart, label: "Indkob" },

// AFTER
{ href: "/tilfoej", icon: Plus, label: "Tilfoej" },
{ href: "/indkob", icon: ShoppingCart, label: "Indkoeb" },
```

**page.tsx (home page):**
```typescript
// BEFORE
<p className="text-muted-foreground">
  Planlaeg ugens maaltider nemt og hurtigt
</p>

// AFTER
<p className="text-muted-foreground">
  Planlaeg ugens maaltider nemt og hurtigt
</p>
```

**day-card.tsx (day labels):**
```typescript
// BEFORE
const DAG_LABELS: Record<DagNavn, string> = {
  // ...
  loerdag: 'Lordag',
  soendag: 'Sondag',
}

// AFTER
const DAG_LABELS: Record<DagNavn, string> = {
  // ...
  loerdag: 'Loerdag',
  soendag: 'Soendag',
}
```

### Home Navigation Addition

**mobile-nav.tsx:**
```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Book, Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Hjem" },
  { href: "/ugeplan", icon: Calendar, label: "Ugeplan" },
  { href: "/opskrifter", icon: Book, label: "Opskrifter" },
  { href: "/tilfoej", icon: Plus, label: "Tilfoej" },
  { href: "/indkob", icon: ShoppingCart, label: "Indkoeb" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          // Exact match for home, prefix match for others
          const isActive = href === "/"
            ? pathname === "/"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg",
                "transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### Shopping List Source Display

**shopping-item.tsx (updated):**
```typescript
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { Indkoebspost } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ShoppingItemProps {
  item: Indkoebspost
  onToggle: (id: string, checked: boolean) => void
}

export function ShoppingItem({ item, onToggle }: ShoppingItemProps) {
  const handleClick = () => {
    onToggle(item.id, !item.afkrydset)
  }

  // Determine source display text
  const getSourceText = () => {
    if (item.kilde === 'manuel') return 'Tilfojet manuelt'
    // For items from recipes, show recipe name if available
    if (item.kildeNavn) return item.kildeNavn
    return 'Fra opskrift'  // Fallback if kildeNavn not provided
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-3 px-1 cursor-pointer rounded-md',
        'hover:bg-sand-100 active:bg-sand-200 transition-colors',
        item.afkrydset && 'opacity-60'
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <Checkbox
        checked={item.afkrydset}
        onCheckedChange={(checked) => onToggle(item.id, checked === true)}
        onClick={(e) => e.stopPropagation()}
        className="pointer-events-auto"
      />

      <div className="flex-1 min-w-0">
        <span
          className={cn(
            'text-base block',
            item.afkrydset && 'line-through text-muted-foreground'
          )}
        >
          {item.navn}
        </span>
        <span className="text-xs text-muted-foreground">
          {getSourceText()}
        </span>
      </div>
    </div>
  )
}
```

## Files Requiring Danish Character Updates

Systematic list based on grep analysis:

| File | Strings to Update |
|------|-------------------|
| `mobile-nav.tsx` | "Tilfoej", "Indkob" |
| `page.tsx` (home) | "Planlaeg", "maaltider", "tilfoeje", "paa", "Tilfoej", "Indkob" |
| `ugeplan/page.tsx` | "tilfoeje", "proev" |
| `indkob/page.tsx` | "tilfojet", "tilfoeje", "proev", "paa" |
| `opskrifter/page.tsx` | "Soeg", "proev" |
| `opskrifter/[id]/page.tsx` | "Fremgangsmaade" |
| `tilfoej/page.tsx` | "Tilfoej", "Indsaet", "saa", "laeser" |
| `day-card.tsx` | "Lordag" -> "Loerdag", "Sondag" -> "Soendag", "Tilfoej", "indkoebsliste" |
| `image-import.tsx` | "Laeser", "laese", "proev", "Netvaerksfejl", "Vaelg", "Tilfoej" |
| `url-import-form.tsx` | "proev", "Indsaet", "Tilfoej" |
| `recipe-form.tsx` | "paakraevet", "vaere", "Fremgangsmaade", "Tilfoej" |
| `add-item-input.tsx` | "Tilfoej" |
| `recipe-picker.tsx` | "Vaelg", "Soeg", "Tilfoej" |
| `week-nav.tsx` | "Naeste" |
| `favorite-button.tsx` | "Tilfoej" |
| `tag-input.tsx` | "Tilfoej", "Soeg" |
| `empty-state.tsx` | "Tilfoej" |

**Total:** ~17 files need updates

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ASCII fallbacks in Danish UI | Direct Unicode characters | Always best practice | Proper localization |
| 4-icon navigation | 5-icon with Home | This phase | Better UX navigation |
| Generic source labels | Recipe-specific source | This phase | Better shopping list context |

**Note:** Danish character encoding has always worked in React/Vite - the ASCII fallbacks were a development shortcut that should have been fixed earlier.

## Open Questions

1. **n8n Workflow for Shopping List Source**
   - What we know: Items are created via `addItems()` from `use-indkobsliste.ts`
   - What's unclear: Does the n8n workflow (`/madplan/indkob/tilfoej`) receive/store recipe name?
   - Recommendation: Check n8n workflow. If not storing recipe name, add `kildeNavn` field to Airtable and update workflow. If blocked, use "Fra opskrift" fallback text.

2. **Shopping List Items from Week Plan vs Manual**
   - What we know: `use-indkobsliste.ts` `addItems()` adds ingredients without recipe reference
   - What's unclear: How to pass recipe name through the add flow
   - Recommendation: Modify `addItems()` to accept optional `kildeNavn` parameter, pass through to n8n

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `mobile-nav.tsx` - current navigation structure
- Codebase analysis: `shopping-item.tsx` - current source display logic
- Codebase analysis: `types.ts` - Indkoebspost interface
- Codebase analysis: Grep for Danish character patterns across 17 files

### Secondary (MEDIUM confidence)
- Lucide React documentation - Home icon available
- React/Vite UTF-8 support - standard behavior, no special config needed

### Tertiary (LOW confidence)
- n8n workflow behavior - needs verification for shopping list source feature

## Metadata

**Confidence breakdown:**
- Danish characters: HIGH - pure text replacement, verified locations via grep
- Navigation: HIGH - straightforward array modification, Home icon exists
- Shopping list source: MEDIUM - depends on n8n workflow capabilities

**Research date:** 2026-01-26
**Valid until:** 2026-02-26 (30 days - stable domain, mostly UI fixes)
