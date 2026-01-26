'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FavoriteButton } from '@/components/opskrifter/favorite-button'
import { TagChip } from '@/components/opskrifter/tag-chip'
import { TagInput } from '@/components/opskrifter/tag-input'
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { useEjere } from '@/hooks/use-ejere'
import { useOpskrifter } from '@/hooks/use-opskrifter'
import { useIndkobsliste } from '@/hooks/use-indkobsliste'
import { getCurrentWeek } from '@/lib/week-utils'

export default function OpskriftDetailPage() {
  const params = useParams()
  const router = useRouter()
  const opskriftId = params.id as string
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // TODO: ejerId from user context
  const { ejere, isLoading: ejereLoading } = useEjere()
  const ejerId = ejere[0]?.id ?? null

  // Get current week for shopping list
  const { aar, uge } = getCurrentWeek()
  const { addItems, isAddingMultiple } = useIndkobsliste(ejerId, aar, uge)

  // Use the opskrifter hook which provides toggleFavorite, allTags, updateTags
  const { opskrifter, isLoading: opskrifterLoading, toggleFavorite, allTags, updateTags } = useOpskrifter(ejerId)

  const opskrift = opskrifter.find((o) => o.id === opskriftId)
  const isLoading = ejereLoading || opskrifterLoading

  const handleAddTag = (tag: string) => {
    if (!opskrift) return
    const currentTags = opskrift.tags ?? []
    if (!currentTags.includes(tag)) {
      updateTags(opskrift.id, [...currentTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    if (!opskrift) return
    const currentTags = opskrift.tags ?? []
    updateTags(opskrift.id, currentTags.filter((t) => t !== tag))
  }

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

  const handleDelete = async () => {
    if (!opskriftId) return

    setIsDeleting(true)
    try {
      const response = await fetch('/api/madplan/opskrift', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opskriftId }),
      })

      if (!response.ok) {
        throw new Error('Kunne ikke slette opskrift')
      }

      toast.success('Opskrift slettet')
      // Invalidate cache and redirect
      mutate(`/api/madplan/opskrifter?ejerId=${ejerId}`)
      router.push('/opskrifter')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Kunne ikke slette opskrift')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <AppShell
      title={opskrift?.titel ?? 'Opskrift'}
      headerLeft={
        <Link href="/opskrifter">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : !opskrift ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Opskrift ikke fundet</p>
            <Link href="/opskrifter" className="text-primary underline mt-2 inline-block">
              Tilbage til opskrifter
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 pb-4">
          {/* Title and portions */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl font-heading font-bold">{opskrift.titel}</h1>
              <p className="text-muted-foreground">{opskrift.portioner} portioner</p>
            </div>
            <FavoriteButton
              isFavorite={opskrift.favorit ?? false}
              onToggle={() => toggleFavorite(opskriftId)}
            />
          </div>

          {/* Recipe image if available */}
          {opskrift.billedeUrl && (
            <div className="rounded-lg overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={opskrift.billedeUrl}
                alt={opskrift.titel}
                className="w-full h-auto max-h-64 object-cover"
              />
            </div>
          )}

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingredienser</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {opskrift.ingredienser.map((ingrediens, i) => (
                  <li key={i} className="text-foreground">
                    {ingrediens}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Add to shopping list button */}
          <Button
            onClick={handleAddToShoppingList}
            disabled={isAddingMultiple || !opskrift?.ingredienser?.length}
            className="w-full"
            variant="outline"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Tilfoej til indkobsliste
          </Button>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fremgangsmaade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">
                {opskrift.fremgangsmaade}
              </p>
            </CardContent>
          </Card>

          {/* Source link if available */}
          {opskrift.kilde && (
            <div className="text-sm text-muted-foreground">
              <span>Kilde: </span>
              <a
                href={opskrift.kilde}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {new URL(opskrift.kilde).hostname}
              </a>
            </div>
          )}

          {/* Tags section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {(opskrift.tags ?? []).map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  onRemove={() => handleRemoveTag(tag)}
                />
              ))}
              <TagInput
                existingTags={allTags}
                currentTags={opskrift.tags ?? []}
                onAddTag={handleAddTag}
              />
            </div>
          </div>

          {/* Delete button */}
          <div className="pt-4 border-t">
            {showConfirm ? (
              <div className="space-y-2">
                <p className="text-sm text-destructive">
                  Er du sikker på at du vil slette denne opskrift?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    {isDeleting ? 'Sletter...' : 'Ja, slet'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    Annuller
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
                onClick={() => setShowConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Slet opskrift
              </Button>
            )}
          </div>
        </div>
      )}
    </AppShell>
  )
}
