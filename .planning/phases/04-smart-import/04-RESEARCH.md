# Phase 4: Smart Import - Research

**Researched:** 2026-01-25
**Domain:** Recipe import (URL scraping, image OCR, form handling)
**Confidence:** HIGH

## Summary

This phase implements recipe import from three sources: URLs, images, and manual entry. The technical stack is well-established with existing n8n workflows that use proven patterns.

**URL Import:** Recipe websites commonly include JSON-LD structured data (Schema.org/Recipe) which provides reliable extraction. The existing `madplan-import-opskrift-url` workflow already implements this pattern with fallback HTML parsing for sites without structured data.

**Image Import:** The existing `madplan-import-opskrift-billede` workflow uses OpenRouter with Claude vision (claude-sonnet-4) to extract recipe data from images as structured JSON. This approach handles OCR and data structuring in one step.

**Frontend:** Next.js App Router handles file uploads natively via `formData()`. Camera/gallery access uses standard HTML5 input with capture attribute. The existing shadcn/ui components (Sheet, Drawer, Dialog) provide mobile-friendly modal patterns for the preview/edit flow.

**Primary recommendation:** Enhance existing n8n workflows with URL detection in OCR output and image URL saving, while building a new recipe form component for preview/edit that's reused for manual entry.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15 | File upload API routes | Native formData() support in App Router |
| OpenRouter | - | AI vision API gateway | Already configured in existing workflow |
| Claude Sonnet 4 | anthropic/claude-sonnet-4 | Image OCR + structuring | Existing workflow uses this |
| Airtable | - | Recipe storage | Existing backend |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | 7.x | Form state management | Preview/edit form |
| zod | 3.x | Schema validation | Form validation |
| sonner | - | Toast notifications | Error/success feedback |

### Already Available (shadcn/ui)
| Component | Purpose | When to Use |
|-----------|---------|-------------|
| Sheet | Bottom sheet modal | Preview/edit on mobile |
| Drawer | Alternative modal | Preview/edit option |
| Input | Text input | URL field, form fields |
| Button | Actions | Import triggers |
| Card | Content container | Import method cards |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| OpenRouter | Direct Anthropic API | OpenRouter already configured, simpler |
| Claude vision | Google Vision + LLM | Two-step vs one-step, more complex |
| Sheet modal | Full page | Sheet better for mobile, consistent |

**Installation:**
```bash
npm install react-hook-form zod @hookform/resolvers
```
Note: react-hook-form and zod may already be installed for shadcn/ui form components.

## Architecture Patterns

### Recommended Project Structure
```
src/
  app/
    tilfoej/
      page.tsx              # Main import page (3 options)
    api/
      madplan/
        import-url/
          route.ts          # Proxy to n8n URL import
        import-billede/
          route.ts          # Proxy to n8n image import + base64
        opskrift/
          route.ts          # POST to create recipe
  components/
    import/
      url-import-form.tsx   # URL input with button
      image-import.tsx      # Camera/gallery with preview
      recipe-form.tsx       # Preview/edit form (shared)
      import-loading.tsx    # Loading state component
    ui/
      textarea.tsx          # May need to add for ingredients
```

### Pattern 1: File Upload to Base64
**What:** Convert image to base64 on client, send to API route
**When to use:** Image import - the existing n8n workflow expects base64
**Example:**
```typescript
// Client-side conversion
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Usage
const base64 = await fileToBase64(selectedFile);
// base64 format: "data:image/jpeg;base64,/9j/4AAQ..."
```

### Pattern 2: HTML5 Camera/Gallery Access
**What:** Use input type="file" with accept and capture attributes
**When to use:** Mobile image capture
**Example:**
```tsx
// Camera only
<input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={handleCapture}
/>

// Gallery only (no capture attribute)
<input
  type="file"
  accept="image/*"
  onChange={handleGallery}
/>
```
**Important:** On Android 14/15 Chrome, camera option may be missing. Workaround: use `accept="image/*,application/pdf"` to force camera option to appear.

### Pattern 3: Controlled Form State for Recipe
**What:** Use react-hook-form with zod for type-safe form handling
**When to use:** Preview/edit recipe form
**Example:**
```typescript
// Schema
const recipeSchema = z.object({
  titel: z.string().min(1, "Titel er paakraevet"),
  portioner: z.number().min(1).default(4),
  ingredienser: z.array(z.string()).min(1, "Mindst en ingrediens"),
  fremgangsmaade: z.string().optional(),
  billedeUrl: z.string().url().optional().or(z.literal('')),
  kilde: z.string().url().optional().or(z.literal('')),
});

// Form initialization with imported data
const form = useForm<RecipeFormData>({
  resolver: zodResolver(recipeSchema),
  defaultValues: importedRecipe ?? emptyRecipe,
});
```

### Pattern 4: Import State Machine
**What:** Manage import flow states explicitly
**When to use:** URL/image import UX
**Example:**
```typescript
type ImportState =
  | { status: 'idle' }
  | { status: 'loading'; message: string }
  | { status: 'preview'; data: RecipeData; source: 'url' | 'image' | 'manual' }
  | { status: 'error'; message: string; canRetry: boolean }
  | { status: 'urlDetected'; url: string; ocrText: string };
```

### Anti-Patterns to Avoid
- **Auto-import on paste:** User decided explicit button click required
- **Partial data fallback:** User decided clear success or clear failure
- **Auto-decide on URL detection:** User wants explicit choice when URL found in image
- **Complex camera preview:** Keep it simple, just show captured image

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON-LD extraction | Custom parser | Existing n8n Code node | Regex + JSON.parse already works |
| Image to text | Local OCR lib | Claude vision via OpenRouter | One-step extraction + structuring |
| Form validation | Manual checks | zod + react-hook-form | Type-safe, declarative |
| Base64 encoding | Fetch + ArrayBuffer | FileReader.readAsDataURL | Simpler, browser standard |
| URL extraction from text | Complex regex | Simple pattern | `/https?:\/\/[^\s]+/g` sufficient |

**Key insight:** The existing n8n workflows already solve the hard problems (JSON-LD parsing, AI vision). The frontend work is primarily UX flow and form handling.

## Common Pitfalls

### Pitfall 1: Android Camera Access on Android 14/15
**What goes wrong:** Chrome on Android 14/15 hides camera option in file input
**Why it happens:** Browser behavior change in recent Android versions
**How to avoid:** Add workaround to accept attribute: `accept="image/*,application/pdf"`
**Warning signs:** Users report they can only pick from gallery on Android

### Pitfall 2: Base64 Size Limits
**What goes wrong:** Large images create huge base64 strings, slow uploads
**Why it happens:** Base64 is ~33% larger than binary, high-res photos are megabytes
**How to avoid:** Consider client-side image compression before base64 conversion, or set max dimensions
**Warning signs:** Slow upload times, timeouts on mobile networks

### Pitfall 3: Form State Reset
**What goes wrong:** Imported data persists after navigation or error
**Why it happens:** React state not properly reset
**How to avoid:** Clear form state on navigation away, reset on new import start
**Warning signs:** Old recipe data appears when starting new import

### Pitfall 4: Ingredient Array Editing
**What goes wrong:** Users can't add/remove ingredients easily
**Why it happens:** Array fields need special UX (add row, remove row, reorder)
**How to avoid:** Use useFieldArray from react-hook-form, provide clear add/remove buttons
**Warning signs:** Users confused about how to modify ingredient list

### Pitfall 5: Missing Error Handling for n8n
**What goes wrong:** Generic "something went wrong" messages
**Why it happens:** Not parsing n8n response structure properly
**How to avoid:** n8n returns `{ success: false, error: "..." }` - show that error message
**Warning signs:** Unhelpful error messages, no way to know what failed

## Code Examples

Verified patterns from existing codebase and official sources:

### API Route Pattern (existing pattern from codebase)
```typescript
// src/app/api/madplan/import-url/route.ts
import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = process.env.N8N_WEBHOOK_URL

export async function POST(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()

    const response = await fetch(
      `${N8N_BASE}/madplan/opskrift/import-url`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/madplan/import-url error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Image Capture with Preview
```tsx
// Source: Standard HTML5 + React pattern
'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Image as ImageIcon } from 'lucide-react'

interface ImageCaptureProps {
  onImageReady: (base64: string) => void
}

export function ImageCapture({ onImageReady }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleConfirm = () => {
    if (preview) {
      onImageReady(preview)
    }
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="flex gap-2">
          <input
            ref={cameraRef}
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <Button
            onClick={() => cameraRef.current?.click()}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            Tag billede
          </Button>
          <Button
            variant="outline"
            onClick={() => galleryRef.current?.click()}
            className="flex-1"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Vaelg billede
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-lg max-h-64 object-contain"
          />
          <div className="flex gap-2">
            <Button onClick={() => setPreview(null)} variant="outline">
              Vaelg andet
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Brug dette billede
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### URL Extraction from OCR Text
```typescript
// For n8n Code node - extract URL from OCR text
function extractUrl(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    // Clean trailing punctuation
    let url = urlMatch[0];
    url = url.replace(/[.,;:!?)]+$/, '');
    return url;
  }
  return null;
}
```

### Recipe Form with react-hook-form
```tsx
// src/components/import/recipe-form.tsx
'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'

const recipeSchema = z.object({
  titel: z.string().min(1, 'Titel er paakraevet'),
  portioner: z.coerce.number().min(1).default(4),
  ingredienser: z.array(z.object({ value: z.string() }))
    .min(1, 'Mindst en ingrediens'),
  fremgangsmaade: z.string().optional(),
  billedeUrl: z.string().optional(),
  kilde: z.string().optional(),
})

type RecipeFormData = z.infer<typeof recipeSchema>

interface RecipeFormProps {
  defaultValues?: Partial<RecipeFormData>
  onSubmit: (data: RecipeFormData) => void
  isSubmitting?: boolean
  highlightImported?: boolean
}

export function RecipeForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  highlightImported
}: RecipeFormProps) {
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      titel: '',
      portioner: 4,
      ingredienser: [{ value: '' }],
      fremgangsmaade: '',
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredienser',
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="text-sm font-medium">Titel *</label>
        <Input {...form.register('titel')} />
        {form.formState.errors.titel && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.titel.message}
          </p>
        )}
      </div>

      {/* Portions */}
      <div>
        <label className="text-sm font-medium">Portioner</label>
        <Input type="number" {...form.register('portioner')} />
      </div>

      {/* Ingredients */}
      <div>
        <label className="text-sm font-medium">Ingredienser *</label>
        <div className="space-y-2 mt-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...form.register(`ingredienser.${index}.value`)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: '' })}
          >
            <Plus className="h-4 w-4 mr-1" /> Tilfoej ingrediens
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <label className="text-sm font-medium">Fremgangsmaade</label>
        <textarea
          {...form.register('fremgangsmaade')}
          className="w-full min-h-32 p-3 border rounded-md"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Gemmer...' : 'Gem opskrift'}
      </Button>
    </form>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tesseract.js | AI vision models | 2023-2024 | One-step OCR + structuring |
| Custom HTML scraping | JSON-LD first | 2020+ | More reliable extraction |
| Formidable file parsing | Native formData() | Next.js 13+ | Simpler file handling |

**Deprecated/outdated:**
- Separate OCR then LLM parsing: Modern vision models do both in one call
- getServerSideProps file handling: App Router uses native Web APIs

## Open Questions

Things that couldn't be fully resolved:

1. **Image compression before upload**
   - What we know: Large images may cause slow uploads
   - What's unclear: Optimal max dimensions for Claude vision quality
   - Recommendation: Start without compression, add if needed

2. **Recipe image saving**
   - What we know: Need to save recipe image from URL
   - What's unclear: Where to store images (Airtable attachment vs external)
   - Recommendation: Use Airtable attachment field, n8n can download and attach

3. **Timeout handling for slow imports**
   - What we know: AI calls can take 10-30 seconds
   - What's unclear: Best UX for long waits
   - Recommendation: Show spinner with message, consider streaming updates

## Sources

### Primary (HIGH confidence)
- Existing codebase: madplan-import-opskrift-url.json, madplan-import-opskrift-billede.json
- Existing Next.js API routes: src/app/api/madplan/*
- [React Hook Form - shadcn/ui](https://ui.shadcn.com/docs/forms/react-hook-form)
- [Schema.org Recipe type](https://schema.org/Recipe)
- [Google Recipe Structured Data](https://developers.google.com/search/docs/appearance/structured-data/recipe)

### Secondary (MEDIUM confidence)
- [HTML5 Camera Access in PWA](https://simicart.com/blog/pwa-camera-access/)
- [n8n Cheerio HTML parsing](https://webscraping.ai/faq/scraping-for-n8n/how-do-i-use-cheerio-in-n8n-for-html-parsing)
- [Claude Vision Documentation](https://docs.claude.com/en/docs/build-with-claude/vision)
- [Next.js 15 File Upload](https://strapi.io/blog/epic-next-js-15-tutorial-part-5-file-upload-using-server-actions)

### Tertiary (LOW confidence)
- [Android 14/15 Camera Fix](https://blog.addpipe.com/html-file-input-accept-video-camera-option-is-missing-android-14-15/)
- [n8n Claude Vision Community Node](https://www.npmjs.com/package/n8n-nodes-claude-vision-v2)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - existing workflows and codebase patterns
- Architecture: HIGH - straightforward extension of existing patterns
- Pitfalls: MEDIUM - some edge cases need validation
- n8n workflow enhancements: HIGH - existing patterns, minor additions

**Research date:** 2026-01-25
**Valid until:** 2026-02-25 (stable domain, established patterns)
