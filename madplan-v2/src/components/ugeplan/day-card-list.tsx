'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, X, ShoppingCart } from 'lucide-react'
import type { DagEntry, DagNavn } from '@/lib/types'
import { cn } from '@/lib/utils'

// Danish day names for display (short version for list view)
const DAG_LABELS_SHORT: Record<DagNavn, string> = {
  mandag: 'Man',
  tirsdag: 'Tir',
  onsdag: 'Ons',
  torsdag: 'Tor',
  fredag: 'Fre',
  loerdag: 'Lor',
  soendag: 'Son',
}

interface DayCardListProps {
  dag: DagNavn
  dato: string          // Formatted date string e.g. "24. jan"
  entry: DagEntry | null
  opskriftId?: string   // Recipe ID for linking to recipe page
  onAdd: () => void     // Opens recipe picker
  onDelete: () => void
  onAddToShoppingList?: () => void  // Add ingredients to shopping list
  onNoteChange?: (note: string) => void  // Update note (not editable in list view, for interface compatibility)
  isToday?: boolean
  isMutating?: boolean
  billedeUrl?: string | null  // Recipe image URL
}

export function DayCardList({
  dag,
  dato,
  entry,
  opskriftId,
  onAdd,
  onDelete,
  onAddToShoppingList,
  onNoteChange: _onNoteChange,  // Received for interface compatibility but not used in list view
  isToday = false,
  isMutating = false,
  billedeUrl,
}: DayCardListProps) {
  void _onNoteChange  // Suppress unused warning
  const hasRet = entry?.ret && entry.ret.trim() !== ''
  const isLinked = hasRet && opskriftId

  // Meal content with optional note (used in both linked and non-linked versions)
  const mealContent = hasRet ? (
    <div className="flex flex-col min-w-0">
      <span className="text-sm truncate">{entry.ret}</span>
      {entry.note && (
        <span className="text-xs text-muted-foreground truncate">{entry.note}</span>
      )}
    </div>
  ) : (
    <span className="text-sm text-muted-foreground italic">Ingen ret</span>
  )

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 border-b border-sand-200 last:border-b-0 transition-opacity',
        isToday && 'bg-terracotta-50 ring-1 ring-terracotta-500 rounded-md mx-1 my-0.5',
        isMutating && 'opacity-50'
      )}
    >
      {/* Day indicator */}
      <div className="w-12 flex-shrink-0">
        <span className="font-medium text-sm">{DAG_LABELS_SHORT[dag]}</span>
        <span className="text-xs text-muted-foreground ml-1">{dato.split('.')[0]}</span>
      </div>

      {/* Thumbnail */}
      {hasRet ? (
        billedeUrl ? (
          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={billedeUrl}
              alt={entry.ret || ''}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-md bg-olive-200 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-olive-700">
              {entry.ret?.charAt(0).toUpperCase()}
            </span>
          </div>
        )
      ) : (
        <div className="w-10 h-10 flex-shrink-0" />
      )}

      {/* Meal name - clickable if linked to recipe */}
      {isLinked ? (
        <Link
          href={`/opskrifter/${opskriftId}`}
          className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity"
        >
          {mealContent}
        </Link>
      ) : (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {mealContent}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {hasRet && onAddToShoppingList ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddToShoppingList}
            disabled={isMutating}
            aria-label={`Tilføj ingredienser fra ${entry.ret} til indkøbsliste`}
            className="h-7 w-7 text-muted-foreground hover:text-primary"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        ) : null}

        {hasRet ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={isMutating}
            aria-label={`Fjern ${entry.ret}`}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        ) : null}

        <Button
          variant="ghost"
          size="icon"
          onClick={onAdd}
          disabled={isMutating}
          aria-label={`Tilføj ret til ${DAG_LABELS_SHORT[dag]}`}
          className="h-7 w-7"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
