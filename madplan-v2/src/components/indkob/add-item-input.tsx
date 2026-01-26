'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'

interface AddItemInputProps {
  onAdd: (name: string) => Promise<void>
  isAdding?: boolean
}

export function AddItemInput({ onAdd, isAdding = false }: AddItemInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isAdding) return

    try {
      await onAdd(value.trim())
      setValue('')
      // Keep focus on input for quick multi-add
      inputRef.current?.focus()
    } catch {
      // Error handled by parent via toast
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Tilføj vare..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isAdding}
        className="flex-1"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!value.trim() || isAdding}
        aria-label="Tilføj vare"
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}
