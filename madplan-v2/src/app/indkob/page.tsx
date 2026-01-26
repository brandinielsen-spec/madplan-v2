'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { CategoryGroup } from '@/components/indkob/category-group'
import { AddItemInput } from '@/components/indkob/add-item-input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Trash2 } from 'lucide-react'
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
    clearAll,
    isAdding,
    isClearing,
  } = useIndkobsliste(ejerId, aar, uge)

  const [dialogOpen, setDialogOpen] = useState(false)

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

  const isLoading = ejereLoading || itemsLoading

  return (
    <AppShell title="Indkøbsliste">
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
          {/* Unchecked items - from recipes first, then manual */}
          <CategoryGroup
            title="Fra opskrifter"
            items={fromRecipes}
            onToggle={handleToggle}
          />

          <CategoryGroup
            title="Tilføjet manuelt"
            items={manual}
            onToggle={handleToggle}
          />

          {/* Checked items at bottom */}
          {checked.length > 0 && (
            <CategoryGroup
              title="Købt"
              items={checked}
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
