'use client'

import { useSwipeWeek } from '@/hooks/use-swipe-week'
import { useEffect } from 'react'

interface WeekSwiperProps {
  children: React.ReactNode[]
  onSlideChange?: (index: number) => void
  onScrollPrev?: () => void
  onScrollNext?: () => void
  onNavigationReady?: (controls: {
    scrollPrev: () => void
    scrollNext: () => void
    canPrev: boolean
    canNext: boolean
  }) => void
}

export function WeekSwiper({
  children,
  onSlideChange,
  onNavigationReady,
}: WeekSwiperProps) {
  const {
    emblaRef,
    scrollPrev,
    scrollNext,
    canPrev,
    canNext,
    selectedIndex,
  } = useSwipeWeek()

  // Notify parent of slide changes
  useEffect(() => {
    onSlideChange?.(selectedIndex)
  }, [selectedIndex, onSlideChange])

  // Expose navigation controls to parent
  useEffect(() => {
    onNavigationReady?.({
      scrollPrev,
      scrollNext,
      canPrev,
      canNext,
    })
  }, [scrollPrev, scrollNext, canPrev, canNext, onNavigationReady])

  return (
    <div
      className="overflow-hidden"
      ref={emblaRef}
    >
      <div className="flex">
        {children}
      </div>
    </div>
  )
}
