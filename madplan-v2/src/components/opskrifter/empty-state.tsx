'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  search: string
  hasTagFilters: boolean
  hasFavoriteFilter: boolean
  onClearFilters: () => void
}

export function EmptyState({
  search,
  hasTagFilters,
  hasFavoriteFilter,
  onClearFilters,
}: EmptyStateProps) {
  const hasFilters = search.trim() || hasTagFilters || hasFavoriteFilter

  return (
    <Card>
      <CardContent className="py-8 text-center">
        {hasFilters ? (
          <>
            <p className="text-muted-foreground">
              Ingen opskrifter matcher dine filtre
            </p>
            <Button
              variant="link"
              onClick={onClearFilters}
              className="mt-2"
            >
              Ryd alle filtre
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">Ingen opskrifter endnu</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tilføj opskrifter fra Tilføj-fanen
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
