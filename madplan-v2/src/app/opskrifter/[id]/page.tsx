'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { FavoriteButton } from '@/components/opskrifter/favorite-button'
import { TagChip } from '@/components/opskrifter/tag-chip'
import { TagInput } from '@/components/opskrifter/tag-input'
import { ArrowLeft, ShoppingCart, Trash2, Pencil, Check, X, Clock } from 'lucide-react'
import Link from 'next/link'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { useSelectedEjer } from '@/contexts/ejer-context'
import { useOpskrifter } from '@/hooks/use-opskrifter'
import { useIndkobsliste } from '@/hooks/use-indkobsliste'
import { useSwipeBack } from '@/hooks/use-swipe-back'
import { getCurrentWeek } from '@/lib/week-utils'

export default function OpskriftDetailPage() {
  const params = useParams()
  const router = useRouter()
  const opskriftId = params.id as string
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Swipe-back navigation
  const { containerRef, handleBack } = useSwipeBack()

  const { selectedEjerId: ejerId, isHydrated } = useSelectedEjer()

  // Get current week for shopping list
  const { aar, uge } = getCurrentWeek()
  const { addItems, isAddingMultiple } = useIndkobsliste(ejerId, aar, uge)

  // Use the opskrifter hook which provides toggleFavorite, allTags, updateTags, updateTitle
  const { opskrifter, isLoading: opskrifterLoading, toggleFavorite, allTags, updateTags, updateTitle } = useOpskrifter(ejerId)

  const opskrift = opskrifter.find((o) => o.id === opskriftId)
  const isLoading = !isHydrated || opskrifterLoading

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

  const handleStartEditTitle = () => {
    if (!opskrift) return
    setEditedTitle(opskrift.titel)
    setIsEditingTitle(true)
  }

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false)
    setEditedTitle('')
  }

  const handleSaveTitle = async () => {
    if (!opskrift || !editedTitle.trim()) return
    const newTitle = editedTitle.trim()
    if (newTitle === opskrift.titel) {
      setIsEditingTitle(false)
      return
    }
    try {
      await updateTitle(opskrift.id, newTitle)
      toast.success('Titel opdateret')
    } catch {
      toast.error('Kunne ikke opdatere titel')
    }
    setIsEditingTitle(false)
  }

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

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
    <div ref={containerRef} className="min-h-full">
      <AppShell
        title=""
        headerLeft={
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
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
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    ref={titleInputRef}
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle()
                      if (e.key === 'Escape') handleCancelEditTitle()
                    }}
                    className="text-xl font-heading font-bold h-auto py-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveTitle}
                    className="shrink-0 text-olive-600 hover:text-olive-700"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancelEditTitle}
                    className="shrink-0 text-muted-foreground"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="group flex items-center gap-2">
                  <h1 className="text-2xl font-heading font-bold">{opskrift.titel}</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleStartEditTitle}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>{opskrift.portioner} portioner</span>
                {(opskrift.tilberedningstid || opskrift.kogetid) && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {opskrift.tilberedningstid && opskrift.kogetid
                      ? `${opskrift.tilberedningstid} + ${opskrift.kogetid} min`
                      : `${opskrift.tilberedningstid || opskrift.kogetid} min`}
                  </span>
                )}
              </div>
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
    </div>
  )
}
