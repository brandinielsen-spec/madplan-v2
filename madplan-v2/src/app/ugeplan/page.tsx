'use client'

import { useState, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout/app-shell'
import { WeekNav } from '@/components/ugeplan/week-nav'
import { DayCard } from '@/components/ugeplan/day-card'
import { DayCardList } from '@/components/ugeplan/day-card-list'
import { RecipePicker } from '@/components/ugeplan/recipe-picker'
import { WeekSwiper } from '@/components/ugeplan/week-swiper'
import { WeekSlide } from '@/components/ugeplan/week-slide'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LayoutGrid, List } from 'lucide-react'
import { useUgeplan } from '@/hooks/use-ugeplan'
import { useOpskrifter } from '@/hooks/use-opskrifter'
import { useEjere } from '@/hooks/use-ejere'
import { useIndkobsliste } from '@/hooks/use-indkobsliste'
import { useViewPreference } from '@/hooks/use-view-preference'
import type { Opskrift } from '@/lib/types'
import {
  getCurrentWeek,
  getWeekDates,
  formatDayDate,
  getWeeksInRange,
} from '@/lib/week-utils'
import { DAGE, type DagNavn } from '@/lib/types'
import { getISOWeek, getISOWeekYear } from 'date-fns'

// Week range: current week +/- 4 = 9 weeks total
const WEEK_RANGE = 4

type ViewMode = 'grid' | 'list'

export default function UgeplanPage() {
  // Initial week (center of carousel)
  const initialWeek = useMemo(() => getCurrentWeek(), [])

  // Generate array of 9 weeks for the carousel
  const weeksArray = useMemo(
    () => getWeeksInRange(initialWeek, WEEK_RANGE),
    [initialWeek]
  )

  // Current selected week (updated by carousel or arrow navigation)
  const [week, setWeek] = useState(initialWeek)

  // View mode preference (persisted to localStorage)
  const [viewMode, setViewMode] = useViewPreference('ugeplan-view', 'grid')

  // Carousel navigation controls (set by WeekSwiper via onNavigationReady)
  const [navControls, setNavControls] = useState<{
    scrollPrev: () => void
    scrollNext: () => void
    canPrev: boolean
    canNext: boolean
  } | null>(null)

  // Selected day for recipe picker
  const [selectedDag, setSelectedDag] = useState<DagNavn | null>(null)

  // TODO: In a real app, ejerId would come from user selection/context
  // For now, use first ejer or null
  const { ejere, isLoading: ejereLoading } = useEjere()
  const ejerId = ejere[0]?.id ?? null

  // Data hooks - loads data for currently visible week
  const {
    ugeplan,
    isLoading: ugeplanLoading,
    isError: ugeplanError,
    updateDay,
    deleteDay,
    updateNote,
    addDayToWeek,
    isMutating,
  } = useUgeplan(ejerId, week.aar, week.uge)

  const { opskrifter } = useOpskrifter(ejerId)

  // Shopping list hook for adding ingredients
  const { addItems } = useIndkobsliste(ejerId, week.aar, week.uge)

  // Handle adding ingredients from a recipe to shopping list
  const handleAddToShoppingList = useCallback(
    async (opskriftId: string | undefined) => {
      if (!opskriftId) {
        toast.error('Ingen opskrift tilknyttet denne ret')
        return
      }
      const recipe = opskrifter.find((o) => o.id === opskriftId)
      if (!recipe) {
        toast.error('Kunne ikke finde opskriften')
        return
      }
      if (!recipe.ingredienser || recipe.ingredienser.length === 0) {
        toast.error('Opskriften har ingen ingredienser')
        return
      }

      // Show immediate loading feedback
      const toastId = toast.loading(
        `Tilføjer ${recipe.ingredienser.length} ingredienser...`,
        { duration: Infinity }
      )

      try {
        const { added, failed } = await addItems(recipe.ingredienser, recipe.titel)
        if (failed === 0) {
          toast.success(`${added} ingredienser tilføjet til indkøb`, { id: toastId })
        } else if (added > 0) {
          toast.warning(`${added} af ${added + failed} ingredienser tilføjet (${failed} fejlede)`, { id: toastId })
        } else {
          toast.error('Kunne ikke tilføje ingredienser', { id: toastId })
        }
      } catch (error) {
        toast.error('Kunne ikke tilføje ingredienser', { id: toastId })
      }
    },
    [opskrifter, addItems]
  )

  // Handle slide index change from carousel
  const handleSlideChange = useCallback(
    (index: number) => {
      const newWeek = weeksArray[index]
      if (newWeek && (newWeek.aar !== week.aar || newWeek.uge !== week.uge)) {
        setWeek(newWeek)
      }
    },
    [weeksArray, week]
  )

  // Handle navigation controls ready from WeekSwiper
  const handleNavigationReady = useCallback(
    (controls: {
      scrollPrev: () => void
      scrollNext: () => void
      canPrev: boolean
      canNext: boolean
    }) => {
      setNavControls(controls)
    },
    []
  )

  // Arrow button handlers - delegate to carousel
  const handlePrevWeek = useCallback(() => {
    navControls?.scrollPrev()
  }, [navControls])

  const handleNextWeek = useCallback(() => {
    navControls?.scrollNext()
  }, [navControls])

  // Calculate dates for the current week
  const weekDates = useMemo(
    () => getWeekDates(week.aar, week.uge),
    [week.aar, week.uge]
  )

  // Check if a date is today
  const today = new Date()
  const todayWeek = getISOWeek(today)
  const todayYear = getISOWeekYear(today)
  const todayDayIndex = (today.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0

  // Extract recent meals from current ugeplan
  const recentRetter = useMemo(() => {
    if (!ugeplan?.dage) return []
    return Object.values(ugeplan.dage)
      .map((entry) => entry?.ret)
      .filter((ret): ret is string => !!ret && ret.trim() !== '')
  }, [ugeplan])

  // Handlers
  const handleAddMeal = (dag: DagNavn) => {
    setSelectedDag(dag)
  }

  const handleSelectMeal = async (
    ret: string,
    opskriftId: string | undefined,
    selectedWeek: { aar: number; uge: number }
  ) => {
    if (!selectedDag) return
    try {
      // Check if adding to current displayed week or a different week
      const isSameWeek =
        selectedWeek.aar === week.aar && selectedWeek.uge === week.uge

      if (isSameWeek) {
        await updateDay(selectedDag, ret, opskriftId)
        toast.success(`${ret} tilfojet`)
      } else {
        await addDayToWeek(selectedWeek, selectedDag, ret, opskriftId)
        toast.success(`${ret} tilfojet til uge ${selectedWeek.uge}`)
      }
    } catch (error) {
      toast.error('Kunne ikke tilfoeje ret')
    } finally {
      setSelectedDag(null)
    }
  }

  const handleDeleteMeal = async (dag: DagNavn) => {
    try {
      await deleteDay(dag)
      toast.success('Ret fjernet')
    } catch (error) {
      toast.error('Kunne ikke fjerne ret')
    }
  }

  // Handle note change - called from DayCard when user edits note
  const handleNoteChange = useCallback(
    async (dag: DagNavn, note: string) => {
      try {
        await updateNote(dag, note)
        toast.success('Note gemt', { duration: 1500 })
      } catch (error) {
        toast.error('Kunne ikke gemme note')
      }
    },
    [updateNote]
  )

  const isLoading = ejereLoading || ugeplanLoading

  // Handle view mode change
  const handleViewModeChange = useCallback((value: string) => {
    if (value === 'grid' || value === 'list') {
      setViewMode(value)
    }
  }, [setViewMode])

  return (
    <AppShell title="Ugeplan">
      <div className="flex items-center justify-between mb-3">
        <WeekNav
          aar={week.aar}
          uge={week.uge}
          onPrev={handlePrevWeek}
          onNext={handleNextWeek}
          canPrev={navControls?.canPrev ?? true}
          canNext={navControls?.canNext ?? true}
          isLoading={isLoading}
        />
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={handleViewModeChange}
          className="border rounded-md"
        >
          <ToggleGroupItem value="grid" aria-label="Vis som kort">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Vis som liste">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <WeekSwiper
        onSlideChange={handleSlideChange}
        onNavigationReady={handleNavigationReady}
      >
        {weeksArray.map((slideWeek) => (
          <WeekSlide key={`${slideWeek.aar}-${slideWeek.uge}`}>
            <WeekContent
              week={slideWeek}
              currentWeek={week}
              ejerId={ejerId}
              ugeplan={ugeplan}
              opskrifter={opskrifter}
              isLoading={isLoading}
              isError={ugeplanError}
              isMutating={isMutating}
              weekDates={weekDates}
              todayWeek={todayWeek}
              todayYear={todayYear}
              todayDayIndex={todayDayIndex}
              viewMode={viewMode}
              onAddMeal={handleAddMeal}
              onDeleteMeal={handleDeleteMeal}
              onAddToShoppingList={handleAddToShoppingList}
              onNoteChange={handleNoteChange}
            />
          </WeekSlide>
        ))}
      </WeekSwiper>

      {/* Recipe picker drawer - controlled by selectedDag */}
      <RecipePicker
        opskrifter={opskrifter}
        recentRetter={recentRetter}
        onSelect={handleSelectMeal}
        open={selectedDag !== null}
        onOpenChange={(open) => !open && setSelectedDag(null)}
        trigger={<span />}
      />
    </AppShell>
  )
}

// Separate component for week content to handle loading states per slide
interface WeekContentProps {
  week: { aar: number; uge: number }
  currentWeek: { aar: number; uge: number }
  ejerId: string | null
  ugeplan: ReturnType<typeof useUgeplan>['ugeplan']
  opskrifter: Opskrift[]
  isLoading: boolean
  isError: boolean
  isMutating: boolean
  weekDates: Date[]
  todayWeek: number
  todayYear: number
  todayDayIndex: number
  viewMode: ViewMode
  onAddMeal: (dag: DagNavn) => void
  onDeleteMeal: (dag: DagNavn) => void
  onAddToShoppingList: (opskriftId: string | undefined) => void
  onNoteChange: (dag: DagNavn, note: string) => void
}

function WeekContent({
  week,
  currentWeek,
  ugeplan,
  opskrifter,
  isLoading,
  isError,
  isMutating,
  todayWeek,
  todayYear,
  todayDayIndex,
  viewMode,
  onAddMeal,
  onDeleteMeal,
  onAddToShoppingList,
  onNoteChange,
}: WeekContentProps) {
  // Only show data for the currently selected week
  // Other slides show skeleton or placeholder
  const isActiveWeek =
    week.aar === currentWeek.aar && week.uge === currentWeek.uge

  // Calculate dates for this specific slide's week
  const slideWeekDates = useMemo(
    () => getWeekDates(week.aar, week.uge),
    [week.aar, week.uge]
  )

  if (!isActiveWeek) {
    // Placeholder for non-active slides - show skeleton structure
    return viewMode === 'grid' ? (
      <div className="space-y-3 pb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    ) : (
      <Card className="divide-y divide-sand-200">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </Card>
    )
  }

  if (isLoading) {
    return viewMode === 'grid' ? (
      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    ) : (
      <Card className="divide-y divide-sand-200">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </Card>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Kunne ikke hente ugeplan</p>
        <p className="text-sm mt-1">Tjek din forbindelse og prøv igen</p>
      </div>
    )
  }

  // Render day items
  const renderDayItems = () =>
    DAGE.map((dag, index) => {
      const isToday =
        week.aar === todayYear &&
        week.uge === todayWeek &&
        index === todayDayIndex

      const entry = ugeplan?.dage?.[dag] ?? null
      const recipe = entry?.opskriftId
        ? opskrifter.find((o) => o.id === entry.opskriftId)
        : undefined

      const commonProps = {
        key: dag,
        dag,
        dato: formatDayDate(slideWeekDates[index]),
        entry,
        opskriftId: entry?.opskriftId,
        onAdd: () => onAddMeal(dag),
        onDelete: () => onDeleteMeal(dag),
        onAddToShoppingList: entry?.opskriftId
          ? () => onAddToShoppingList(entry.opskriftId)
          : undefined,
        onNoteChange: (note: string) => onNoteChange(dag, note),
        isToday,
        isMutating,
        billedeUrl: recipe?.billedeUrl,
      }

      return viewMode === 'grid' ? (
        <DayCard {...commonProps} />
      ) : (
        <DayCardList {...commonProps} />
      )
    })

  return viewMode === 'grid' ? (
    <div className="space-y-3 pb-4">{renderDayItems()}</div>
  ) : (
    <Card className="mb-4">{renderDayItems()}</Card>
  )
}
