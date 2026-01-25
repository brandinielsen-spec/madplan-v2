import { NextRequest, NextResponse } from 'next/server'
import type { OpskriftInput } from '@/lib/types'

const N8N_BASE = process.env.N8N_WEBHOOK_URL

export async function POST(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  let body: Partial<OpskriftInput>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { ejerId, titel, ingredienser } = body

  // Validate required fields
  if (!ejerId) {
    return NextResponse.json(
      { error: 'Missing required parameter: ejerId' },
      { status: 400 }
    )
  }

  if (!titel) {
    return NextResponse.json(
      { error: 'Missing required parameter: titel' },
      { status: 400 }
    )
  }

  if (!ingredienser || !Array.isArray(ingredienser) || ingredienser.length === 0) {
    return NextResponse.json(
      { error: 'Missing or empty required parameter: ingredienser' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${N8N_BASE}/madplan/opskrift/opret`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Upstream error' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result.data ?? result)
  } catch (error) {
    console.error('POST /api/madplan/opskrift error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  let body: { opskriftId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { opskriftId } = body

  if (!opskriftId) {
    return NextResponse.json(
      { error: 'Missing required parameter: opskriftId' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${N8N_BASE}/madplan/opskrift/slet`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opskriftId }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Upstream error' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('DELETE /api/madplan/opskrift error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
