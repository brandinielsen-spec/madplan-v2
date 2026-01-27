'use client'

import Link from 'next/link'
import { ChevronRight, Clock } from 'lucide-react'
import { FavoriteButton } from '@/components/opskrifter/favorite-button'
import type { Opskrift } from '@/lib/types'

function formatTime(tilberedningstid?: number, kogetid?: number): string | null {
  if (!tilberedningstid && !kogetid) return null
  if (tilberedningstid && kogetid) return `${tilberedningstid} + ${kogetid} min`
  return `${tilberedningstid || kogetid} min`
}

interface RecipeListItemProps {
  recipe: Opskrift
  onToggleFavorite?: () => void
}

export function RecipeListItem({ recipe, onToggleFavorite }: RecipeListItemProps) {
  return (
    <Link
      href={`/opskrifter/${recipe.id}`}
      className="flex items-center gap-3 py-3 px-4 hover:bg-sand-100 transition-colors cursor-pointer"
    >
      {/* Thumbnail image or letter avatar */}
      {recipe.billedeUrl ? (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.billedeUrl}
            alt={recipe.titel}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-olive-200 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-medium text-olive-700">
            {recipe.titel.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">
          {recipe.titel}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{recipe.portioner} port.</span>
          {formatTime(recipe.tilberedningstid, recipe.kogetid) && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(recipe.tilberedningstid, recipe.kogetid)}
              </span>
            </>
          )}
        </div>
      </div>

      {onToggleFavorite && (
        <FavoriteButton
          isFavorite={recipe.favorit ?? false}
          onToggle={onToggleFavorite}
          size="sm"
        />
      )}

      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </Link>
  )
}
