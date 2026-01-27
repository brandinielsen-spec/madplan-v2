'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Zod schema for validation
const recipeSchema = z.object({
  titel: z.string().min(1, 'Titel er påkrævet'),
  portioner: z.number().min(1, 'Mindst 1 portion'),
  ingredienser: z
    .array(z.object({ value: z.string().min(1, 'Ingrediens kan ikke være tom') }))
    .min(1, 'Mindst en ingrediens er påkrævet'),
  fremgangsmaade: z.string().optional(),
  billedeUrl: z.string().optional(),
  kilde: z.string().optional(),
  tilberedningstid: z.number().min(1).optional().or(z.literal('')),
  kogetid: z.number().min(1).optional().or(z.literal('')),
})

type RecipeFormValues = z.infer<typeof recipeSchema>

// Output data type (what onSubmit receives)
export interface RecipeFormData {
  titel: string
  portioner: number
  ingredienser: string[]
  fremgangsmaade?: string
  billedeUrl?: string
  kilde?: string
  tilberedningstid?: number
  kogetid?: number
}

interface RecipeFormProps {
  defaultValues?: {
    titel?: string
    portioner?: number
    ingredienser?: string[]
    fremgangsmaade?: string
    billedeUrl?: string
    kilde?: string
    tilberedningstid?: number
    kogetid?: number
  }
  onSubmit: (data: RecipeFormData) => void | Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
  highlightImported?: boolean
}

export function RecipeForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Gem opskrift',
  highlightImported = false,
}: RecipeFormProps) {
  // Transform string[] to {value: string}[] for useFieldArray
  const transformedIngredients = defaultValues?.ingredienser?.map((ing) => ({
    value: ing,
  })) ?? [{ value: '' }]

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      titel: defaultValues?.titel ?? '',
      portioner: defaultValues?.portioner ?? 4,
      ingredienser: transformedIngredients,
      fremgangsmaade: defaultValues?.fremgangsmaade ?? '',
      billedeUrl: defaultValues?.billedeUrl ?? '',
      kilde: defaultValues?.kilde ?? '',
      tilberedningstid: defaultValues?.tilberedningstid ?? '',
      kogetid: defaultValues?.kogetid ?? '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredienser',
  })

  // Transform form data back to output format
  const handleFormSubmit = (data: RecipeFormValues) => {
    const output: RecipeFormData = {
      titel: data.titel,
      portioner: data.portioner,
      ingredienser: data.ingredienser.map((ing) => ing.value),
      fremgangsmaade: data.fremgangsmaade || undefined,
      billedeUrl: data.billedeUrl || undefined,
      kilde: data.kilde || undefined,
      tilberedningstid: typeof data.tilberedningstid === 'number' ? data.tilberedningstid : undefined,
      kogetid: typeof data.kogetid === 'number' ? data.kogetid : undefined,
    }
    return onSubmit(output)
  }

  // Check if a field was pre-filled from import
  const hasImportedValue = (field: keyof NonNullable<typeof defaultValues>) => {
    return highlightImported && defaultValues?.[field]
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Titel */}
      <div>
        <label htmlFor="titel" className="text-sm font-medium">
          Titel *
        </label>
        <Input
          id="titel"
          {...register('titel')}
          placeholder="Opskriftens navn"
          className={cn(hasImportedValue('titel') && 'bg-amber-50')}
          aria-invalid={!!errors.titel}
        />
        {errors.titel && (
          <p className="text-sm text-destructive mt-1">{errors.titel.message}</p>
        )}
      </div>

      {/* Portioner */}
      <div>
        <label htmlFor="portioner" className="text-sm font-medium">
          Antal portioner
        </label>
        <Input
          id="portioner"
          type="number"
          min={1}
          {...register('portioner', { valueAsNumber: true })}
          className={cn('w-24', hasImportedValue('portioner') && 'bg-amber-50')}
          aria-invalid={!!errors.portioner}
        />
        {errors.portioner && (
          <p className="text-sm text-destructive mt-1">{errors.portioner.message}</p>
        )}
      </div>

      {/* Tid (tilberedning + kogetid) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="tilberedningstid" className="text-sm font-medium">
            Tilberedning (min)
          </label>
          <Input
            id="tilberedningstid"
            type="number"
            min={1}
            placeholder="fx 15"
            {...register('tilberedningstid', { valueAsNumber: true })}
            className={cn(hasImportedValue('tilberedningstid') && 'bg-amber-50')}
          />
        </div>
        <div>
          <label htmlFor="kogetid" className="text-sm font-medium">
            Kogetid (min)
          </label>
          <Input
            id="kogetid"
            type="number"
            min={1}
            placeholder="fx 30"
            {...register('kogetid', { valueAsNumber: true })}
            className={cn(hasImportedValue('kogetid') && 'bg-amber-50')}
          />
        </div>
      </div>

      {/* Ingredienser */}
      <div>
        <label className="text-sm font-medium">Ingredienser *</label>
        <div className="space-y-2 mt-1">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`ingredienser.${index}.value`)}
                placeholder={`Ingrediens ${index + 1}`}
                className={cn(
                  'flex-1',
                  highlightImported &&
                    defaultValues?.ingredienser?.[index] &&
                    'bg-amber-50'
                )}
                aria-invalid={!!errors.ingredienser?.[index]?.value}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                aria-label={`Fjern ingrediens ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {errors.ingredienser && (
            <p className="text-sm text-destructive">
              {errors.ingredienser.message || 'Udfyld alle ingredienser'}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: '' })}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Tilføj ingrediens
        </Button>
      </div>

      {/* Fremgangsmaade */}
      <div>
        <label htmlFor="fremgangsmaade" className="text-sm font-medium">
          Fremgangsmåde
        </label>
        <Textarea
          id="fremgangsmaade"
          {...register('fremgangsmaade')}
          placeholder="Beskriv tilberedningen..."
          className={cn(
            'min-h-32',
            hasImportedValue('fremgangsmaade') && 'bg-amber-50'
          )}
        />
      </div>

      {/* Kilde (read-only display if present) */}
      {defaultValues?.kilde && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Kilde</label>
          <p className="text-sm text-muted-foreground truncate">{defaultValues.kilde}</p>
          <input type="hidden" {...register('kilde')} />
        </div>
      )}

      {/* BilledeUrl (read-only display if present) */}
      {defaultValues?.billedeUrl && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Billede</label>
          <div className="mt-1 rounded-md overflow-hidden border max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={defaultValues.billedeUrl}
              alt="Opskriftsbillede"
              className="w-full h-auto"
            />
          </div>
          <input type="hidden" {...register('billedeUrl')} />
        </div>
      )}

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Gemmer...' : submitLabel}
      </Button>
    </form>
  )
}
