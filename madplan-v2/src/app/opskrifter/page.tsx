'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { RecipeCard } from '@/components/opskrifter/recipe-card'
import { RecipeListItem } from '@/components/opskrifter/recipe-list-item'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Search, LayoutGrid, List } from 'lucide-react'
import { useOpskrifter } from '@/hooks/use-opskrifter'
import { useEjere } from '@/hooks/use-ejere'

type ViewMode = 'cards' | 'list'

export default function OpskrifterPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [search, setSearch] = useState('')

  // TODO: ejerId from user context - for now use first ejer
  const { ejere, isLoading: ejereLoading } = useEjere()
  const ejerId = ejere[0]?.id ?? null

  const {
    opskrifter,
    isLoading: opskrifterLoading,
    isError,
  } = useOpskrifter(ejerId)

  // Filter recipes by search
  const filteredOpskrifter = useMemo(() => {
    if (!search.trim()) return opskrifter
    const searchLower = search.toLowerCase()
    return opskrifter.filter((o) =>
      o.titel.toLowerCase().includes(searchLower)
    )
  }, [opskrifter, search])

  const isLoading = ejereLoading || opskrifterLoading

  return (
    <AppShell title="Opskrifter">
      {/* Search and view toggle */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Soeg i opskrifter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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
            <p className="text-sm mt-1">Tjek din forbindelse og proev igen</p>
          </CardContent>
        </Card>
      ) : filteredOpskrifter.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {search ? (
              <p>Ingen opskrifter matcher "{search}"</p>
            ) : (
              <>
                <p>Ingen opskrifter endnu</p>
                <p className="text-sm mt-1">Tilfoej opskrifter fra Tilfoej-fanen</p>
              </>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-2 gap-3 pb-4">
          {filteredOpskrifter.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-sand-200">
          {filteredOpskrifter.map((recipe) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))}
        </Card>
      )}
    </AppShell>
  )
}
