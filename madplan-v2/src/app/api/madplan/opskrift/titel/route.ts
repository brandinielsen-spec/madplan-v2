import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = process.env.N8N_WEBHOOK_URL

interface TitelRequest {
  opskriftId: string
  titel: string
}

export async function POST(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  let body: Partial<TitelRequest>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { opskriftId, titel } = body

  if (!opskriftId) {
    return NextResponse.json(
      { error: 'Missing required parameter: opskriftId' },
      { status: 400 }
    )
  }

  if (!titel || typeof titel !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid parameter: titel' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${N8N_BASE}/madplan/opskrift/opdater`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opskriftId,
          fields: { Titel: titel }
        }),
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
    return NextResponse.json({ success: true, data: result.data ?? result })
  } catch (error) {
    console.error('POST /api/madplan/opskrift/titel error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
