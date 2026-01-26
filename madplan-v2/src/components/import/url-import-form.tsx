'use client'

import { useState, useRef } from 'react'
import { Link as LinkIcon, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { ImportResult } from '@/lib/types'

type ImportState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }

interface UrlImportFormProps {
  onImportSuccess: (data: ImportResult['data']) => void
  onManualEntry: () => void
}

export function UrlImportForm({ onImportSuccess, onManualEntry }: UrlImportFormProps) {
  const [url, setUrl] = useState('')
  const [state, setState] = useState<ImportState>({ status: 'idle' })
  const [validationError, setValidationError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isValidUrl = (value: string): boolean => {
    const trimmed = value.trim()
    return trimmed.startsWith('http://') || trimmed.startsWith('https://')
  }

  const handleImport = async () => {
    // Clear any previous validation error
    setValidationError(null)

    // Validate URL format
    const trimmedUrl = url.trim()
    if (!isValidUrl(trimmedUrl)) {
      setValidationError('Ugyldig URL - skal starte med https://')
      return
    }

    setState({ status: 'loading' })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch('/api/madplan/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
        signal: controller.signal,
      })

      const result: ImportResult = await response.json()

      if (result.success && result.data) {
        // Clear URL on success (parent will show preview)
        setUrl('')
        setState({ status: 'idle' })
        onImportSuccess(result.data)
      } else {
        setState({
          status: 'error',
          message: result.error || 'Kunne ikke importere opskrift',
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setState({
          status: 'error',
          message: 'Import tog for lang tid - prøv igen',
        })
      } else {
        setState({
          status: 'error',
          message: 'Kunne ikke importere opskrift',
        })
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const handleRetry = () => {
    setState({ status: 'idle' })
    setValidationError(null)
    // Focus input for retry
    inputRef.current?.focus()
  }

  const isLoading = state.status === 'loading'
  const isError = state.status === 'error'
  const isButtonDisabled = !url.trim() || isLoading

  return (
    <div className="space-y-4">
      <Input
        ref={inputRef}
        type="url"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value)
          // Clear validation error when user types
          if (validationError) setValidationError(null)
        }}
        placeholder="https://eksempel.dk/opskrift..."
        disabled={isLoading}
        aria-label="Indsæt opskrift URL"
        autoComplete="url"
        inputMode="url"
        className="py-3 text-base"
      />

      {validationError && (
        <p className="text-sm text-destructive">{validationError}</p>
      )}

      {isError ? (
        <>
          <p className="text-sm text-destructive">{state.message}</p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleRetry}
              className="flex-1"
            >
              Prøv igen
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onManualEntry}
              className="flex-1"
            >
              Tilføj manuelt
            </Button>
          </div>
        </>
      ) : (
        <Button
          type="button"
          onClick={handleImport}
          disabled={isButtonDisabled}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Henter opskrift...
            </>
          ) : (
            <>
              <LinkIcon />
              Importer opskrift
            </>
          )}
        </Button>
      )}
    </div>
  )
}
