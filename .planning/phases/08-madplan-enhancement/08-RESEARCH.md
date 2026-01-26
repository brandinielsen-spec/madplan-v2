# Phase 8: Madplan Enhancement - Research

**Researched:** 2026-01-26
**Domain:** React UI components, Airtable data schema, localStorage persistence
**Confidence:** HIGH

## Summary

Research focused on understanding the existing madplan (meal plan) implementation to inform enhancements for week selection, notes, and view toggling.

The codebase already has:
1. **Week navigation** via carousel (`WeekSwiper` with Embla) and arrow buttons (`WeekNav`)
2. **Recipe picker** via `Drawer` component triggered from `DayCard`
3. **List/Grid toggle** pattern already implemented on `/opskrifter` page using `ToggleGroup`
4. **localStorage usage** via SWR cache provider (pattern available for preferences)

The requirements involve:
- BUG-04: Week picker in RecipePicker drawer (currently no week selection)
- FEAT-01/02: Note field on meal entries (currently `DagEntry` has only `ret` and `opskriftId`)
- UI-01: View toggle for madplan page (can reuse opskrifter pattern)

**Primary recommendation:** Leverage existing patterns from opskrifter page and extend the RecipePicker drawer with a week selector component. Notes require both frontend component changes and backend/Airtable schema update.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.x | UI framework | Already in use |
| Next.js | 15.x | App router, API routes | Already in use |
| SWR | 2.x | Data fetching with caching | Already in use for all API calls |
| date-fns | 4.x | Week/date calculations | Already in use via `week-utils.ts` |
| vaul | 1.x | Drawer component | Already in use for RecipePicker |
| @radix-ui/react-toggle-group | - | View toggle | Already in use on opskrifter page |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | - | Icons (LayoutGrid, List) | Already in use for view toggle icons |
| sonner | - | Toast notifications | Already in use for feedback |

### No New Dependencies Needed

All required functionality can be built using existing libraries. View toggle, drawer enhancements, and localStorage persistence are all supported by current stack.

**Installation:**
```bash
# No new packages required
```

## Architecture Patterns

### Current Week Plan Component Structure
```
src/
├── app/
│   └── ugeplan/
│       └── page.tsx         # Main page with WeekSwiper, RecipePicker
├── components/
│   └── ugeplan/
│       ├── day-card.tsx     # Day entry display with meal info
│       ├── recipe-picker.tsx # Drawer for selecting recipes
│       ├── week-nav.tsx     # Prev/next week arrows + label
│       ├── week-swiper.tsx  # Embla carousel container
│       └── week-slide.tsx   # Individual week slide wrapper
├── hooks/
│   └── use-ugeplan.ts       # SWR hook for week plan data
└── lib/
    ├── types.ts             # DagEntry, Ugeplan types
    └── week-utils.ts        # Week calculation utilities
```

### Recommended Changes Structure
```
src/
├── components/
│   └── ugeplan/
│       ├── day-card.tsx           # MODIFY: Add note display and input
│       ├── recipe-picker.tsx      # MODIFY: Add week picker section
│       ├── week-picker.tsx        # NEW: Week tile selector component
│       ├── view-toggle.tsx        # NEW: Grid/list toggle (or inline)
│       ├── meal-card-grid.tsx     # NEW: Grid view card for meals
│       └── meal-row-list.tsx      # NEW: List view row for meals
├── hooks/
│   ├── use-ugeplan.ts             # MODIFY: Support note field
│   └── use-view-preference.ts     # NEW: localStorage preference hook
└── lib/
    └── types.ts                   # MODIFY: Add note to DagEntry
```

### Pattern 1: Week Picker Tiles
**What:** Horizontal row of 4 clickable week tiles
**When to use:** Inside RecipePicker drawer, before recipe list
**Example:**
```typescript
// Conceptual structure based on CONTEXT.md decisions
interface WeekTile {
  aar: number
  uge: number
  label: string  // "Denne uge", "Naeste uge", "Uge X"
  isSelected: boolean
}

// Generate 4 weeks: current + 3 future
const weeks = useMemo(() => {
  const current = getCurrentWeek()
  return [
    { ...current, label: 'Denne uge' },
    { ...navigateWeek(current.aar, current.uge, 'next'), label: 'Naeste uge' },
    // ... next 2 weeks with "Uge X" format
  ]
}, [])
```

### Pattern 2: View Preference Hook
**What:** Custom hook for persisting view mode to localStorage
**When to use:** When view toggle needs to remember user preference
**Example:**
```typescript
// Based on existing localStorage pattern in swr-provider.tsx
function useViewPreference(key: string, defaultValue: 'grid' | 'list') {
  const [view, setView] = useState<'grid' | 'list'>(() => {
    if (typeof window === 'undefined') return defaultValue
    const stored = localStorage.getItem(key)
    return (stored === 'grid' || stored === 'list') ? stored : defaultValue
  })

  const setViewAndPersist = (newView: 'grid' | 'list') => {
    setView(newView)
    localStorage.setItem(key, newView)
  }

  return [view, setViewAndPersist] as const
}
```

### Pattern 3: Note Field on DagEntry
**What:** Optional note string on meal entries
**When to use:** For short hints like "Rest", "Fra frost"
**Example:**
```typescript
// types.ts modification
export interface DagEntry {
  ret: string | null
  opskriftId?: string
  note?: string  // NEW: Optional short note
}
```

### Anti-Patterns to Avoid
- **Modal for notes:** Don't use a modal/dialog for entering notes. Use inline text field as per CONTEXT.md decision.
- **Note validation overkill:** Keep it simple - no complex validation, just optional short text.
- **Week picker outside drawer:** Keep week selection in the RecipePicker drawer, not on main page.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| View toggle UI | Custom toggle buttons | `ToggleGroup` from Radix | Already used on opskrifter page, consistent UX |
| Week navigation | Manual date math | `date-fns` + existing `week-utils.ts` | Already has `navigateWeek`, `getCurrentWeek`, etc. |
| Bottom sheet picker | Custom drawer | `vaul` Drawer | Already used for RecipePicker |
| Preference persistence | Manual localStorage | Hook pattern | SSR-safe pattern exists in swr-provider.tsx |
| Toast feedback | Custom notifications | `sonner` toast | Already used throughout app |

**Key insight:** This phase is primarily about extending existing patterns, not building new infrastructure.

## Common Pitfalls

### Pitfall 1: SSR localStorage Access
**What goes wrong:** Accessing localStorage during server-side rendering causes hydration errors
**Why it happens:** Next.js App Router renders components on server first
**How to avoid:** Use `typeof window === 'undefined'` guard or lazy initialization with `useState(() => ...)`
**Warning signs:** Hydration mismatch errors in console

### Pitfall 2: Missing N8N Workflow Update
**What goes wrong:** Frontend sends note field but backend doesn't persist it
**Why it happens:** Airtable schema and n8n workflow need to be updated alongside frontend
**How to avoid:** Plan workflow: 1) Add field to Airtable, 2) Update n8n workflow, 3) Update frontend
**Warning signs:** Notes disappear on page refresh

### Pitfall 3: Week Selection Scope Confusion
**What goes wrong:** Selecting a future week in picker but meal gets added to wrong week
**Why it happens:** RecipePicker currently uses parent's week context, not its own selection
**How to avoid:** Pass selected week back with recipe selection: `onSelect(ret, opskriftId, selectedWeek)`
**Warning signs:** Meals appear on current week when future week was selected

### Pitfall 4: Stale Ugeplan Data After Week Change
**What goes wrong:** Adding meal to future week doesn't show if user navigates there
**Why it happens:** SWR cache for future week is stale
**How to avoid:** After successful add to different week, invalidate that week's SWR cache key
**Warning signs:** User navigates to target week and doesn't see their new meal

## Code Examples

Verified patterns from existing codebase:

### View Toggle (from opskrifter/page.tsx)
```typescript
// Source: src/app/opskrifter/page.tsx lines 103-115
<ToggleGroup
  type="single"
  value={viewMode}
  onValueChange={(value) => value && setViewMode(value as ViewMode)}
  className="border rounded-md"
>
  <ToggleGroupItem value="cards" aria-label="Vis som kort">
    <LayoutGrid className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="list" aria-label="Vis som liste">
    <List className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>
```

### Week Label Formatting (from week-utils.ts)
```typescript
// Source: src/lib/week-utils.ts
export function formatWeekLabel(aar: number, uge: number): string {
  return `Uge ${uge}, ${aar}`
}

export function getCurrentWeek(): { aar: number; uge: number } {
  const now = new Date()
  return {
    aar: getISOWeekYear(now),
    uge: getISOWeek(now),
  }
}

export function navigateWeek(
  aar: number,
  uge: number,
  direction: 'prev' | 'next'
): { aar: number; uge: number } {
  const date = getDateFromISOWeek(aar, uge)
  const newDate = direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1)
  return {
    aar: getISOWeekYear(newDate),
    uge: getISOWeek(newDate),
  }
}
```

### RecipePicker Pattern (current drawer structure)
```typescript
// Source: src/components/ugeplan/recipe-picker.tsx
<Drawer open={open} onOpenChange={onOpenChange}>
  <DrawerTrigger asChild>{trigger}</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Vaelg ret</DrawerTitle>
    </DrawerHeader>
    {/* Content here - week picker would go before search */}
    <div className="px-4 pb-2">
      {/* Search input */}
    </div>
    <ScrollArea className="h-[50vh] px-4">
      {/* Recipe list */}
    </ScrollArea>
  </DrawerContent>
</Drawer>
```

### DayCard Current Structure (for note addition)
```typescript
// Source: src/components/ugeplan/day-card.tsx
// Note would go below the recipe title in this structure:
<div className="flex-1 min-w-0">
  <div className="flex items-baseline gap-2 mb-1">
    <span className="font-medium text-foreground">{DAG_LABELS[dag]}</span>
    <span className="text-sm text-muted-foreground">{dato}</span>
  </div>
  <p className="text-base text-foreground truncate">{entry.ret}</p>
  {/* NEW: Note would render here in smaller text */}
  {/* {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>} */}
</div>
```

### API Update Pattern (from use-ugeplan.ts)
```typescript
// Source: src/hooks/use-ugeplan.ts
// Current updateDay signature - needs note parameter added
updateDay: async (dag: DagNavn, ret: string, opskriftId?: string) => {
  if (!data?.id) throw new Error('No ugeplan loaded')
  return triggerUpdate({
    id: data.id,
    feltNavn: capitalize(dag),
    ret,
    opskriftId,
    // NEW: note would be added here
  })
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate week selection page | Inline week picker in drawer | Per CONTEXT.md decision | Faster UX, less navigation |
| Modal for notes | Inline text field on card | Per CONTEXT.md decision | More natural editing flow |
| No view persistence | localStorage preference | This phase | Better returning user experience |

**Deprecated/outdated:**
- None for this domain - existing patterns are current and appropriate

## Data Schema Changes Required

### Airtable: Madplan Table
Current fields per day (Mandag, Tirsdag, etc.):
- `{Dag}` (text) - Recipe name
- `{Dag}_OpskriftId` (link to Opskrifter) - Recipe ID link

**Required additions:**
- `{Dag}_Note` (text) - Short note for each day (e.g., "Mandag_Note", "Tirsdag_Note")

### N8N Workflow Updates
The following n8n endpoints need modification:

1. **GET /madplan/uge** - Include note fields in response
2. **POST /madplan/dag/opdater** - Accept and persist note field

### Frontend Type Updates
```typescript
// DagEntry interface modification
export interface DagEntry {
  ret: string | null
  opskriftId?: string
  note?: string  // NEW
}
```

## Week Selection Logic

### Current Flow (BUG-04 context)
1. User taps "+" on DayCard
2. RecipePicker drawer opens
3. User selects recipe
4. Recipe added to CURRENT week only (the week displayed on ugeplan page)

### Target Flow
1. User taps "+" on DayCard
2. RecipePicker drawer opens
3. **NEW:** Week picker shows 4 weeks (current pre-selected)
4. User can change target week
5. User selects recipe
6. Recipe added to SELECTED week
7. If selected week differs from displayed week, invalidate that week's cache

### Week Label Format (per CONTEXT.md)
- Week 0 (current): "Denne uge"
- Week +1: "Naeste uge"
- Week +2, +3: "Uge {X}" (just the week number)

## Open Questions

Things that couldn't be fully resolved:

1. **Note Character Limit**
   - What we know: CONTEXT.md says "short hints only" and lists Claude's Discretion
   - What's unclear: Exact limit not specified
   - Recommendation: 50 characters reasonable for "Rest", "Fra frost", "Dobbelt portion"

2. **Airtable Field Names**
   - What we know: Current pattern is `{Dag}` and `{Dag}_OpskriftId`
   - What's unclear: Haven't verified actual Airtable schema
   - Recommendation: Follow existing pattern with `{Dag}_Note`

3. **Grid vs List Default View**
   - What we know: CONTEXT.md says persist preference, no default mentioned
   - What's unclear: What to show first-time users
   - Recommendation: Default to 'grid' (matches visual richness of recipe cards)

## Sources

### Primary (HIGH confidence)
- Codebase analysis - `src/app/ugeplan/page.tsx`, `src/components/ugeplan/*.tsx`
- Codebase analysis - `src/app/opskrifter/page.tsx` (view toggle pattern)
- Codebase analysis - `src/hooks/use-ugeplan.ts` (data flow)
- Codebase analysis - `src/lib/types.ts` (DagEntry structure)
- Codebase analysis - `src/lib/week-utils.ts` (week calculations)

### Secondary (MEDIUM confidence)
- CONTEXT.md decisions - User decisions for week picker, notes, view toggle

### Tertiary (LOW confidence)
- None - all findings verified from codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - verified from package.json and existing code
- Architecture: HIGH - analyzed existing component structure
- Pitfalls: HIGH - based on observed patterns and common Next.js issues
- Data schema: MEDIUM - inferred from types.ts, needs Airtable verification

**Research date:** 2026-01-26
**Valid until:** 60 days (stable codebase, no external API changes expected)
