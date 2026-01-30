'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { CategoryGroup } from '@/components/indkob/category-group'
import { AddItemInput } from '@/components/indkob/add-item-input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Tags, FolderTree } from 'lucide-react'
import { useIndkobsliste } from '@/hooks/use-indkobsliste'
import { useSelectedEjer } from '@/contexts/ejer-context'
import { KATEGORI_LABELS, type IndkoebKategori } from '@/lib/types'
import { inferKategori } from '@/lib/kategori-utils'

type GroupBy = 'source' | 'category'

export default function IndkobPage() {
  const { selectedEjerId: ejerId, isHydrated } = useSelectedEjer()

  // Fetch ALL items for ejerId (no week filter)
  const {
    items,
    isLoading: itemsLoading,
    isError,
    toggleItem,
    addItem,
    clearAll,
    isAdding,
    isClearing,
  } = useIndkobsliste(ejerId)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [groupBy, setGroupBy] = useState<GroupBy>('source')

  // Group items based on selected mode
  const grouped = useMemo(() => {
    const unchecked = items.filter((i) => !i.afkrydset)
    const checked = items.filter((i) => i.afkrydset)

    if (groupBy === 'source') {
      // Group by source: recipes vs manual
      const fromRecipes = unchecked.filter((i) => i.kilde === 'ret')
      const manual = unchecked.filter((i) => i.kilde === 'manuel')
      return {
        mode: 'source' as const,
        groups: [
          { title: 'Fra opskrifter', items: fromRecipes },
          { title: 'Tilføjet manuelt', items: manual },
        ],
        checked,
      }
    } else {
      // Group by category
      const byCategory: Record<IndkoebKategori, typeof unchecked> = {
        'frugt-og-groent': [],
        'mejeri': [],
        'koed-og-fisk': [],
        'kolonial': [],
        'broed': [],
        'husholdning': [],
        'andet': [],
      }

      for (const item of unchecked) {
        const kategori = inferKategori(item.navn)
        byCategory[kategori].push(item)
      }

      // Convert to array of groups, filtering out empty categories
      const orderedCategories: IndkoebKategori[] = [
        'frugt-og-groent',
        'mejeri',
        'koed-og-fisk',
        'kolonial',
        'broed',
        'husholdning',
        'andet',
      ]

      const groups = orderedCategories
        .filter((cat) => byCategory[cat].length > 0)
        .map((cat) => ({
          title: KATEGORI_LABELS[cat],
          items: byCategory[cat],
        }))

      return {
        mode: 'category' as const,
        groups,
        checked,
      }
    }
  }, [items, groupBy])

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
      toast.success(`${name} tilføjet`)
    } catch {
      toast.error('Kunne ikke tilføje vare')
      throw new Error('Add item failed') // Re-throw so AddItemInput knows it failed
    }
  }

  const handleClearAll = async () => {
    try {
      await clearAll()
      setDialogOpen(false)
      toast.success('Indkøbslisten er ryddet')
    } catch {
      toast.error('Kunne ikke rydde listen')
    }
  }

  const handleGroupByChange = (value: string) => {
    if (value === 'source' || value === 'category') {
      setGroupBy(value)
    }
  }

  const isLoading = !isHydrated || itemsLoading

  return (
    <AppShell title="Indkøbsliste">
      {/* Group toggle */}
      <div className="flex items-center justify-end py-2 mb-2">
        <ToggleGroup
          type="single"
          value={groupBy}
          onValueChange={handleGroupByChange}
          className="border rounded-md"
        >
          <ToggleGroupItem value="source" aria-label="Gruppér efter kilde">
            <Tags className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="category" aria-label="Gruppér efter kategori">
            <FolderTree className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
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
            <p>Kunne ikke hente indkøbsliste</p>
            <p className="text-sm mt-1">Tjek din forbindelse og prøv igen</p>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Ingen varer på listen endnu</p>
            <p className="text-sm mt-1">Tilføj retter til ugeplanen eller tilføj manuelt</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 pb-4">
          {/* Render groups based on selected mode */}
          {grouped.groups.map((group) => (
            <CategoryGroup
              key={group.title}
              title={group.title}
              items={group.items}
              onToggle={handleToggle}
            />
          ))}

          {/* Checked items at bottom */}
          {grouped.checked.length > 0 && (
            <CategoryGroup
              title="Købt"
              items={grouped.checked}
              onToggle={handleToggle}
            />
          )}

          {/* Clear all button */}
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isClearing}
              >
                <Trash2 className="size-4 mr-2" />
                Ryd hele listen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ryd indkøbslisten?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dette sletter alle {items.length} varer fra listen. Handlingen kan ikke fortrydes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuller</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isClearing}
                >
                  {isClearing ? 'Rydder...' : 'Ja, ryd listen'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </AppShell>
  )
}
