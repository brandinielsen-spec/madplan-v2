import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = process.env.N8N_WEBHOOK_URL

export async function POST(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  let body: { image?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { image } = body

  if (!image) {
    return NextResponse.json(
      { error: 'Missing required parameter: image' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${N8N_BASE}/madplan/opskrift/import-billede`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Upstream error' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result.data ?? result)
  } catch (error) {
    console.error('POST /api/madplan/import-billede error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
