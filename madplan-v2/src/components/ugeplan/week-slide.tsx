'use client'

interface WeekSlideProps {
  children: React.ReactNode
}

export function WeekSlide({ children }: WeekSlideProps) {
  return (
    <div
      className="flex-[0_0_100%] min-w-0 touch-pan-y"
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      {children}
    </div>
  )
}
