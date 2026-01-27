'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UseSwipeBackOptions {
  /** Minimum swipe distance in pixels to trigger navigation (default: 100) */
  threshold?: number
  /** Maximum starting X position from left edge in pixels (default: 50) */
  edgeWidth?: number
  /** Whether swipe-back is enabled (default: true) */
  enabled?: boolean
}

/**
 * Hook that enables swipe-from-left-edge to navigate back.
 * Returns a ref to attach to the container element.
 */
export function useSwipeBack(options: UseSwipeBackOptions = {}) {
  const { threshold = 100, edgeWidth = 50, enabled = true } = options
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const isSwipingRef = useRef(false)

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      // Only track if starting from left edge
      if (touch.clientX <= edgeWidth) {
        touchStartRef.current = { x: touch.clientX, y: touch.clientY }
        isSwipingRef.current = false
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)

      // If horizontal movement is dominant and moving right
      if (deltaX > 20 && deltaX > deltaY * 2) {
        isSwipingRef.current = true
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x

      // If swiped right past threshold, go back
      if (isSwipingRef.current && deltaX >= threshold) {
        handleBack()
      }

      touchStartRef.current = null
      isSwipingRef.current = false
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, threshold, edgeWidth, handleBack])

  return { containerRef, handleBack }
}
