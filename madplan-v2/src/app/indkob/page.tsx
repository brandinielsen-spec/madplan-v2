'use client'

import { useMemo } from 'react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { CategoryGroup } from '@/components/indkob/category-group'
import { AddItemInput } from '@/components/indkob/add-item-input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { useIndkobsliste } from '@/hooks/use-indkobsliste'
import { useEjere } from '@/hooks/use-ejere'
import { getCurrentWeek, formatWeekLabel } from '@/lib/week-utils'

export default function IndkobPage() {
  // Use current week for shopping list
  const { aar, uge } = getCurrentWeek()

  // TODO: ejerId from user context - for now use first ejer
  const { ejere, isLoading: ejereLoading } = useEjere()
  const ejerId = ejere[0]?.id ?? null

  const {
    items,
    isLoading: itemsLoading,
    isError,
    toggleItem,
    addItem,
    isAdding,
  } = useIndkobsliste(ejerId, aar, uge)

  // Split items into checked and unchecked
  const { fromRecipes, manual, checked } = useMemo(() => {
    const unchecked = items.filter((i) => !i.afkrydset)
    const checked = items.filter((i) => i.afkrydset)
    const fromRecipes = unchecked.filter((i) => i.kilde === 'ret')
    const manual = unchecked.filter((i) => i.kilde === 'manuel')
    return { fromRecipes, manual, checked }
  }, [items])

  const handleToggle = async (id: string, afkrydset: boolean) => {
    try {
      await toggleItem(id, afkrydset)
      // No toast on toggle - too noisy for checkbox interaction
    } catch {
      toast.error('Kunne ikke opdatere vare')
    }
  }

  const handleAddItem = async (name: string) => {
    try {
      await addItem(name)
      toast.success(`${name} tilfojet`)
    } catch {
      toast.error('Kunne ikke tilfoeje vare')
      throw new Error('Add item failed') // Re-throw so AddItemInput knows it failed
    }
  }

  const isLoading = ejereLoading || itemsLoading

  return (
    <AppShell title="Indkobsliste">
      {/* Week indicator */}
      <div className="py-2 text-sm text-muted-foreground text-center">
        {formatWeekLabel(aar, uge)}
      </div>

      {/* Add item input - always visible at top */}
      <div className="mb-4">
        <AddItemInput onAdd={handleAddItem} isAdding={isAdding} />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Kunne ikke hente indkobsliste</p>
            <p className="text-sm mt-1">Tjek din forbindelse og proev igen</p>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Ingen varer pa listen endnu</p>
            <p className="text-sm mt-1">Tilfoej retter til ugeplanen eller tilfoej manuelt</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 pb-4">
          {/* Unchecked items - from recipes first, then manual */}
          <CategoryGroup
            title="Fra opskrifter"
            items={fromRecipes}
            onToggle={handleToggle}
          />

          <CategoryGroup
            title="Tilfojet manuelt"
            items={manual}
            onToggle={handleToggle}
          />

          {/* Checked items at bottom */}
          {checked.length > 0 && (
            <CategoryGroup
              title="Kobt"
              items={checked}
              onToggle={handleToggle}
            />
          )}
        </div>
      )}
    </AppShell>
  )
}
