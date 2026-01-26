'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, ImageIcon, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react'
import type { ImportResult } from '@/lib/types'

interface ImageImportProps {
  onImportSuccess: (data: ImportResult['data']) => void
  onManualEntry: () => void
}

type ImageState =
  | { status: 'idle' }
  | { status: 'preview'; base64: string }
  | { status: 'loading'; message: string }
  | { status: 'urlDetected'; url: string; ocrData: ImportResult['data'] }
  | { status: 'error'; message: string }

export function ImageImport({ onImportSuccess, onManualEntry }: ImageImportProps) {
  const [state, setState] = useState<ImageState>({ status: 'idle' })
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setState({ status: 'preview', base64: reader.result as string })
    }
    reader.readAsDataURL(file)

    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const handleSubmitImage = async () => {
    if (state.status !== 'preview') return

    const base64 = state.base64
    setState({ status: 'loading', message: 'Læser billede...' })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch('/api/madplan/import-billede', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const result: ImportResult = await response.json()

      if (!result.success || !result.data) {
        setState({
          status: 'error',
          message: result.error || 'Kunne ikke læse billede',
        })
        return
      }

      // Check if URL was detected in the image
      if (result.data.kilde) {
        // If kilde (source URL) is present, treat it as URL detection
        setState({
          status: 'urlDetected',
          url: result.data.kilde,
          ocrData: result.data,
        })
      } else {
        // No URL detected, use OCR data directly
        onImportSuccess(result.data)
      }
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        setState({
          status: 'error',
          message: 'Anmodningen tog for lang tid. Prøv igen.',
        })
      } else {
        setState({
          status: 'error',
          message: 'Netværksfejl. Tjek din forbindelse.',
        })
      }
    }
  }

  const handleFetchFromUrl = async () => {
    if (state.status !== 'urlDetected') return

    const url = state.url
    setState({ status: 'loading', message: 'Henter opskrift fra URL...' })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch('/api/madplan/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const result: ImportResult = await response.json()

      if (!result.success || !result.data) {
        setState({
          status: 'error',
          message: result.error || 'Kunne ikke hente opskrift fra URL',
        })
        return
      }

      onImportSuccess(result.data)
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        setState({
          status: 'error',
          message: 'Anmodningen tog for lang tid. Prøv igen.',
        })
      } else {
        setState({
          status: 'error',
          message: 'Netværksfejl. Tjek din forbindelse.',
        })
      }
    }
  }

  const handleUseOcrData = () => {
    if (state.status !== 'urlDetected') return
    onImportSuccess(state.ocrData)
  }

  const resetToIdle = () => {
    setState({ status: 'idle' })
  }

  // Idle state: Two buttons for camera and gallery
  if (state.status === 'idle') {
    return (
      <div className="space-y-3">
        {/* Hidden file inputs */}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*,application/pdf"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Tag billede med kamera"
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Vælg billede fra galleri"
        />

        <div className="flex gap-3">
          <Button
            onClick={() => cameraRef.current?.click()}
            className="flex-1 py-3"
            aria-label="Tag billede"
          >
            <Camera className="mr-2 h-5 w-5" />
            Tag billede
          </Button>
          <Button
            variant="outline"
            onClick={() => galleryRef.current?.click()}
            className="flex-1 py-3"
            aria-label="Vælg billede"
          >
            <ImageIcon className="mr-2 h-5 w-5" />
            Vælg billede
          </Button>
        </div>
      </div>
    )
  }

  // Preview state: Show captured image with confirm button
  if (state.status === 'preview') {
    return (
      <div className="space-y-4">
        <img
          src={state.base64}
          alt="Valgt billede"
          className="w-full max-h-64 object-contain rounded-lg border"
        />
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={resetToIdle}
            className="py-3"
            aria-label="Vælg andet billede"
          >
            Vælg andet
          </Button>
          <Button
            onClick={handleSubmitImage}
            className="flex-1 py-3"
            aria-label="Brug dette billede"
          >
            Brug dette billede
          </Button>
        </div>
      </div>
    )
  }

  // Loading state: Spinner with message
  if (state.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{state.message}</p>
      </div>
    )
  }

  // URL detected state: Choice dialog
  if (state.status === 'urlDetected') {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LinkIcon className="h-4 w-4" />
          <span className="text-sm">Fandt URL i billedet:</span>
        </div>
        <p className="text-sm text-muted-foreground truncate" title={state.url}>
          {state.url}
        </p>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleFetchFromUrl}
            className="w-full py-3"
            aria-label="Hent opskrift fra URL"
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Hent opskrift fra URL
          </Button>
          <Button
            variant="outline"
            onClick={handleUseOcrData}
            className="w-full py-3"
            aria-label="Brug OCR tekst i stedet"
          >
            Brug OCR tekst i stedet
          </Button>
        </div>
      </div>
    )
  }

  // Error state: Error message with retry and manual entry options
  if (state.status === 'error') {
    return (
      <div className="space-y-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{state.message}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={resetToIdle}
            className="py-3"
            aria-label="Prøv igen"
          >
            Prøv igen
          </Button>
          <Button
            variant="secondary"
            onClick={onManualEntry}
            className="flex-1 py-3"
            aria-label="Tilføj manuelt"
          >
            Tilføj manuelt
          </Button>
        </div>
      </div>
    )
  }

  return null
}
