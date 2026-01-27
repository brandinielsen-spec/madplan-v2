'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UrlImportForm } from '@/components/import/url-import-form'
import { ImageImport } from '@/components/import/image-import'
import { RecipeForm, type RecipeFormData } from '@/components/import/recipe-form'
import { useSelectedEjer } from '@/contexts/ejer-context'
import { Link as LinkIcon, Camera, FileText, ArrowLeft, Search, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { ImportResult, OpskriftInput } from '@/lib/types'

type PageState =
  | { mode: 'select' }
  | { mode: 'preview'; data: ImportResult['data']; source: 'url' | 'image' | 'manual' }
  | { mode: 'saving'; data: ImportResult['data']; source: 'url' | 'image' | 'manual' }

export default function TilfoejPage() {
  const [state, setState] = useState<PageState>({ mode: 'select' })
  const [recipeSearch, setRecipeSearch] = useState('')
  const router = useRouter()
  const { selectedEjerId: ejerId } = useSelectedEjer()

  const handleGoogleSearch = () => {
    if (!recipeSearch.trim()) return
    const query = encodeURIComponent(`opskrift ${recipeSearch.trim()}`)
    window.open(`https://www.google.com/search?q=${query}`, '_blank')
  }

  const handleImportSuccess = (data: ImportResult['data'], source: 'url' | 'image') => {
    setState({
      mode: 'preview',
      data,
      source,
    })
  }

  const handleManualEntry = () => {
    setState({
      mode: 'preview',
      data: {
        titel: '',
        ingredienser: [],
        portioner: 4,
        fremgangsmaade: '',
      },
      source: 'manual',
    })
  }

  const handleSave = async (formData: RecipeFormData) => {
    if (!ejerId) {
      toast.error('Kunne ikke finde bruger')
      return
    }

    const currentData = state.mode !== 'select' ? state.data : undefined
    const currentSource = state.mode !== 'select' ? state.source : 'manual'

    setState({ mode: 'saving', data: currentData, source: currentSource })

    try {
      const payload: OpskriftInput = {
        ejerId,
        titel: formData.titel,
        portioner: formData.portioner,
        ingredienser: formData.ingredienser,
        fremgangsmaade: formData.fremgangsmaade || '',
        billedeUrl: formData.billedeUrl,
        kilde: formData.kilde,
        tags: ['Hverdag'],
        tilberedningstid: formData.tilberedningstid,
        kogetid: formData.kogetid,
      }

      const response = await fetch('/api/madplan/opskrift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Kunne ikke gemme opskrift')
      }

      toast.success('Opskrift gemt!')

      // Navigate to the new recipe's detail page
      const newId = result.id || result.data?.id
      if (newId) {
        router.push(`/opskrifter/${newId}`)
      } else {
        router.push('/opskrifter')
      }
    } catch (error) {
      console.error('Save recipe error:', error)
      toast.error(error instanceof Error ? error.message : 'Kunne ikke gemme opskrift')
      // Return to preview mode
      setState({ mode: 'preview', data: currentData, source: currentSource })
    }
  }

  const handleBack = () => {
    setState({ mode: 'select' })
  }

  // Determine page title based on state
  const getPageTitle = () => {
    if (state.mode === 'select') return 'Tilføj opskrift'
    if (state.mode === 'saving') return 'Gemmer...'
    if (state.mode === 'preview') {
      return state.source === 'manual' ? 'Ny opskrift' : 'Gennemse opskrift'
    }
    return 'Tilføj opskrift'
  }

  // Select mode: Show import options
  if (state.mode === 'select') {
    return (
      <AppShell title={getPageTitle()}>
        <div className="space-y-6">
          {/* URL Import Card - Primary */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <LinkIcon className="size-5 text-primary" />
                Importer fra URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Indsæt et link til en opskrift, så importerer vi den automatisk
              </p>
              <UrlImportForm
                onImportSuccess={(data) => handleImportSuccess(data, 'url')}
                onManualEntry={handleManualEntry}
              />

              {/* Google search helper */}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  Mangler du en opskrift? Find en på Google:
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleGoogleSearch()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    type="text"
                    placeholder="Søg efter opskrift..."
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    className="flex-1 h-9 text-sm"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={!recipeSearch.trim()}
                    className="gap-1.5"
                  >
                    <Search className="size-3.5" />
                    Søg
                    <ExternalLink className="size-3" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Image Import Card - Secondary */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Camera className="size-5 text-primary" />
                Upload billede
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tag et billede af en opskrift, og vi læser indholdet
              </p>
              <ImageImport
                onImportSuccess={(data) => handleImportSuccess(data, 'image')}
                onManualEntry={handleManualEntry}
              />
            </CardContent>
          </Card>

          {/* Manual Entry Card - Tertiary */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                Manuel oprettelse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Opret en opskrift fra bunden ved at udfylde alle detaljer
              </p>
              <Button variant="outline" onClick={handleManualEntry} className="w-full">
                Opret ny opskrift
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  // Preview/Saving mode: Show recipe form
  const isSubmitting = state.mode === 'saving'
  const isImported = state.source !== 'manual'

  return (
    <AppShell title={getPageTitle()}>
      <div className="space-y-4">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          disabled={isSubmitting}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Tilbage
        </Button>

        {/* Source indicator for imported recipes */}
        {isImported && (
          <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
            {state.source === 'url' && 'Importeret fra URL'}
            {state.source === 'image' && 'Importeret fra billede'}
          </div>
        )}

        {/* Recipe form */}
        <RecipeForm
          defaultValues={{
            titel: state.data?.titel,
            portioner: state.data?.portioner ?? 4,
            ingredienser: state.data?.ingredienser,
            fremgangsmaade: state.data?.fremgangsmaade,
            billedeUrl: state.data?.billedeUrl,
            kilde: state.data?.kilde,
          }}
          onSubmit={handleSave}
          isSubmitting={isSubmitting}
          submitLabel={isImported ? 'Gem importeret opskrift' : 'Gem opskrift'}
          highlightImported={isImported}
        />
      </div>
    </AppShell>
  )
}
