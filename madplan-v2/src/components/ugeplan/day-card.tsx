'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, X, ShoppingCart } from 'lucide-react'
import type { DagEntry, DagNavn } from '@/lib/types'
import { cn } from '@/lib/utils'

// Danish day names for display
const DAG_LABELS: Record<DagNavn, string> = {
  mandag: 'Mandag',
  tirsdag: 'Tirsdag',
  onsdag: 'Onsdag',
  torsdag: 'Torsdag',
  fredag: 'Fredag',
  loerdag: 'Lørdag',
  soendag: 'Søndag',
}

interface DayCardProps {
  dag: DagNavn
  dato: string          // Formatted date string e.g. "24. jan"
  entry: DagEntry | null
  opskriftId?: string   // Recipe ID for linking to recipe page
  onAdd: () => void     // Opens recipe picker
  onDelete: () => void
  onAddToShoppingList?: () => void  // Add ingredients to shopping list
  onNoteChange?: (note: string) => void  // Update note on meal entry
  isToday?: boolean
  isMutating?: boolean
  billedeUrl?: string | null  // Recipe image URL
}

export function DayCard({
  dag,
  dato,
  entry,
  opskriftId,
  onAdd,
  onDelete,
  onAddToShoppingList,
  onNoteChange,
  isToday = false,
  isMutating = false,
  billedeUrl,
}: DayCardProps) {
  const hasRet = entry?.ret && entry.ret.trim() !== ''
  const [noteValue, setNoteValue] = useState(entry?.note ?? '')
  const lastSavedNote = useRef(entry?.note ?? '')

  // Update local state when entry changes (e.g., after fetch)
  const entryNote = entry?.note ?? ''
  if (entryNote !== lastSavedNote.current) {
    setNoteValue(entryNote)
    lastSavedNote.current = entryNote
  }

  const handleNoteBlur = useCallback(() => {
    const trimmedNote = noteValue.trim()
    // Only save if changed
    if (trimmedNote !== lastSavedNote.current && onNoteChange) {
      onNoteChange(trimmedNote)
      lastSavedNote.current = trimmedNote
    }
  }, [noteValue, onNoteChange])

  const handleNoteKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur()
      }
    },
    []
  )

  // Image section with day badge overlay
  const ImageSection = () => {
    const imageContent = hasRet && billedeUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={billedeUrl}
        alt={entry?.ret || ''}
        className="w-full h-full object-cover"
      />
    ) : hasRet ? (
      // Gradient placeholder with first letter when meal exists but no image
      <div className="w-full h-full bg-gradient-to-br from-olive-200 to-sand-200 flex items-center justify-center">
        <span className="text-4xl text-olive-600/30 font-heading">
          {entry?.ret?.charAt(0).toUpperCase()}
        </span>
      </div>
    ) : (
      // Empty state - subtle gradient with plus icon
      <div className="w-full h-full bg-gradient-to-br from-sand-100 to-sand-200 flex items-center justify-center">
        <Plus className="h-8 w-8 text-sand-400" />
      </div>
    )

    return (
      <div className="relative aspect-[16/9] overflow-hidden">
        {imageContent}
        {/* Day badge overlay */}
        <Badge
          variant="secondary"
          className={cn(
            'absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-foreground shadow-sm',
            isToday && 'bg-terracotta-500 text-white'
          )}
        >
          {DAG_LABELS[dag]} {dato}
        </Badge>
        {/* Action buttons overlay - at bottom */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {hasRet && onAddToShoppingList && (
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToShoppingList()
              }}
              disabled={isMutating}
              aria-label={`Tilfoej ingredienser fra ${entry?.ret} til indkoebsliste`}
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
          {hasRet && (
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete()
              }}
              disabled={isMutating}
              aria-label={`Fjern ${entry?.ret} fra ${DAG_LABELS[dag]}`}
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground shadow-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Wrapper that makes the card clickable
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (hasRet && opskriftId) {
      return (
        <Link href={`/opskrifter/${opskriftId}`} className="block">
          {children}
        </Link>
      )
    }
    if (!hasRet) {
      return (
        <button
          onClick={onAdd}
          disabled={isMutating}
          className="block w-full text-left"
        >
          {children}
        </button>
      )
    }
    return <>{children}</>
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      isToday && 'ring-2 ring-terracotta-500 ring-offset-2',
      isMutating && 'opacity-50',
      (hasRet && opskriftId) || !hasRet ? 'hover:ring-2 hover:ring-terracotta-300 cursor-pointer' : ''
    )}>
      <CardWrapper>
        <ImageSection />
        <CardContent className="p-3">
          {hasRet ? (
            <>
              <h3 className="font-medium text-foreground line-clamp-2 leading-tight">
                {entry?.ret}
              </h3>
              {entry?.note && (
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {entry.note}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Tilføj ret
            </p>
          )}
        </CardContent>
      </CardWrapper>

      {/* Note input - only shown when there's a meal */}
      {hasRet && onNoteChange && (
        <div className="px-3 pb-3">
          <Input
            type="text"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            onBlur={handleNoteBlur}
            onKeyDown={handleNoteKeyDown}
            placeholder="Tilfoej note..."
            maxLength={50}
            disabled={isMutating}
            className="h-7 text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Card>
  )
}
