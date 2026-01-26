'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  className?: string
  size?: 'sm' | 'md'
}

export function FavoriteButton({ isFavorite, onToggle, className, size = 'md' }: FavoriteButtonProps) {
  const [animating, setAnimating] = useState(false)

  // Trigger animation when favorited (not unfavorited)
  useEffect(() => {
    if (isFavorite) {
      setAnimating(true)
      const timer = setTimeout(() => setAnimating(false), 400)
      return () => clearTimeout(timer)
    }
  }, [isFavorite])

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const padding = size === 'sm' ? 'p-1.5' : 'p-2'

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        padding,
        "rounded-full bg-white/80 backdrop-blur-sm",
        "hover:bg-white transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400",
        className
      )}
      aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
    >
      <Heart
        className={cn(
          iconSize,
          "transition-all duration-200",
          animating && "animate-heart-pulse",
          isFavorite
            ? "fill-terracotta-500 text-terracotta-500"
            : "text-sand-600"
        )}
      />
    </button>
  )
}
