'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { RecipeCard } from '@/components/opskrifter/recipe-card'
import { RecipeListItem } from '@/components/opskrifter/recipe-list-item'
import { FilterBar } from '@/components/opskrifter/filter-bar'
import { EmptyState } from '@/components/opskrifter/empty-state'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Search, LayoutGrid, List, X } from 'lucide-react'
import { useOpskrifter } from '@/hooks/use-opskrifter'
import { useEjere } from '@/hooks/use-ejere'

type ViewMode = 'cards' | 'list'

// Tag filter state: 'include' = show only with tag, 'exclude' = hide with tag
type TagState = 'include' | 'exclude'

export default function OpskrifterPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [search, setSearch] = useState('')
  const [tagStates, setTagStates] = useState<Record<string, TagState>>({})
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // TODO: ejerId from user context - for now use first ejer
  const { ejere, isLoading: ejereLoading } = useEjere()
  const ejerId = ejere[0]?.id ?? null

  const {
    opskrifter,
    isLoading: opskrifterLoading,
    isError,
    allTags,
    toggleFavorite,
  } = useOpskrifter(ejerId)

  // Filter recipes by search, tags, and favorites
  const filteredOpskrifter = useMemo(() => {
    let result = opskrifter

    // Search filter (title only)
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      result = result.filter((o) =>
        o.titel.toLowerCase().includes(searchLower)
      )
    }

    // Tag filter with include/exclude logic
    const includeTags = Object.entries(tagStates)
      .filter(([, state]) => state === 'include')
      .map(([tag]) => tag)
    const excludeTags = Object.entries(tagStates)
      .filter(([, state]) => state === 'exclude')
      .map(([tag]) => tag)

    // Must have ALL included tags (AND logic)
    if (includeTags.length > 0) {
      result = result.filter((o) =>
        includeTags.every((tag) => (o.tags ?? []).includes(tag))
      )
    }

    // Must NOT have ANY excluded tags
    if (excludeTags.length > 0) {
      result = result.filter((o) =>
        !excludeTags.some((tag) => (o.tags ?? []).includes(tag))
      )
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((o) => o.favorit === true)
    }

    return result
  }, [opskrifter, search, tagStates, showFavoritesOnly])

  // Cycle: none → include → exclude → none
  const handleTagToggle = (tag: string) => {
    setTagStates((prev) => {
      const current = prev[tag]
      if (!current) {
        // none → include
        return { ...prev, [tag]: 'include' }
      } else if (current === 'include') {
        // include → exclude
        return { ...prev, [tag]: 'exclude' }
      } else {
        // exclude → none (remove from state)
        const { [tag]: _, ...rest } = prev
        return rest
      }
    })
  }

  const handleClearFilters = () => {
    setSearch('')
    setTagStates({})
    setShowFavoritesOnly(false)
  }

  const isLoading = ejereLoading || opskrifterLoading

  return (
    <AppShell title="Opskrifter">
      {/* Search and view toggle */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Søg i opskrifter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Ryd søgning"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
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
      </div>

      {/* Filter bar with favorites and tags */}
      <div className="mb-4">
        <FilterBar
          allTags={allTags}
          tagStates={tagStates}
          onTagToggle={handleTagToggle}
          showFavoritesOnly={showFavoritesOnly}
          onFavoritesToggle={() => setShowFavoritesOnly((prev) => !prev)}
        />
      </div>

      {isLoading ? (
        viewMode === 'cards' ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3]" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )
      ) : isError ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Kunne ikke hente opskrifter</p>
            <p className="text-sm mt-1">Tjek din forbindelse og prøv igen</p>
          </CardContent>
        </Card>
      ) : filteredOpskrifter.length === 0 ? (
        <EmptyState
          search={search}
          hasTagFilters={Object.keys(tagStates).length > 0}
          hasFavoriteFilter={showFavoritesOnly}
          onClearFilters={handleClearFilters}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-2 gap-3 pb-4">
          {filteredOpskrifter.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={() => toggleFavorite(recipe.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-sand-200">
          {filteredOpskrifter.map((recipe) => (
            <RecipeListItem
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={() => toggleFavorite(recipe.id)}
            />
          ))}
        </Card>
      )}
    </AppShell>
  )
}
