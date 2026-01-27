'use client'

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { FavoriteButton } from '@/components/opskrifter/favorite-button'
import type { Opskrift } from '@/lib/types'

function formatTime(tilberedningstid?: number, kogetid?: number): string | null {
  if (!tilberedningstid && !kogetid) return null
  if (tilberedningstid && kogetid) return `${tilberedningstid} + ${kogetid} min`
  return `${tilberedningstid || kogetid} min`
}

interface RecipeCardProps {
  recipe: Opskrift
  onToggleFavorite?: () => void
}

export function RecipeCard({ recipe, onToggleFavorite }: RecipeCardProps) {
  return (
    <Link href={`/opskrifter/${recipe.id}`}>
      <Card className="overflow-hidden hover:ring-2 hover:ring-terracotta-300 transition-shadow cursor-pointer">
        {/* Show image if available, otherwise placeholder */}
        <div className="relative">
          {recipe.billedeUrl ? (
            <div className="aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recipe.billedeUrl}
                alt={recipe.titel}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-gradient-to-br from-olive-200 to-sand-200 flex items-center justify-center">
              <span className="text-4xl text-olive-600/30 font-heading">
                {recipe.titel.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {onToggleFavorite && (
            <FavoriteButton
              isFavorite={recipe.favorit ?? false}
              onToggle={onToggleFavorite}
              className="absolute top-2 right-2 z-10"
              size="sm"
            />
          )}
        </div>
        <CardContent className="p-3">
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
        </CardContent>
      </Card>
    </Link>
  )
}
