'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

export function useSwipeWeek() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,           // Hard stop at boundaries per CONTEXT.md
    dragFree: false,       // Snap to weeks, not momentum scroll
    startIndex: 4,         // Current week at center of 9 week range (-4 to +4)
    containScroll: 'keepSnaps',
  })

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(4)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return {
    emblaRef,
    emblaApi,
    scrollPrev,
    scrollNext,
    scrollTo,
    canPrev,
    canNext,
    selectedIndex,
  }
}
