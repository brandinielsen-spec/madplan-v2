'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Opskrift } from '@/lib/types'

interface RecipeCardProps {
  recipe: Opskrift
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/opskrifter/${recipe.id}`}>
      <Card className="overflow-hidden hover:ring-2 hover:ring-terracotta-300 transition-shadow cursor-pointer">
        {/* Placeholder for image - will show colored background */}
        <div className="aspect-[4/3] bg-gradient-to-br from-olive-200 to-sand-200 flex items-center justify-center">
          <span className="text-4xl text-olive-600/30 font-heading">
            {recipe.titel.charAt(0).toUpperCase()}
          </span>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-foreground truncate">
            {recipe.titel}
          </h3>
          <p className="text-sm text-muted-foreground">
            {recipe.portioner} portioner
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
