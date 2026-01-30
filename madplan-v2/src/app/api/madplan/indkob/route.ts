import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = process.env.N8N_WEBHOOK_URL

// GET /api/madplan/indkob?ejerId=X[&aar=Y&uge=Z]
// If aar/uge omitted, returns ALL items for ejerId
export async function GET(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const ejerId = searchParams.get('ejerId')
  const aar = searchParams.get('aar')
  const uge = searchParams.get('uge')

  if (!ejerId) {
    return NextResponse.json(
      { error: 'Missing required parameter: ejerId' },
      { status: 400 }
    )
  }

  // Build URL - if aar/uge provided, filter by week; otherwise get all
  const url = aar && uge
    ? `${N8N_BASE}/madplan/indkob?ejerId=${ejerId}&aar=${aar}&uge=${uge}`
    : `${N8N_BASE}/madplan/indkob?ejerId=${ejerId}`

  try {
    const response = await fetch(url, { cache: 'no-store' })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Upstream error' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result.data ?? result)
  } catch (error) {
    console.error('GET /api/madplan/indkob error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/madplan/indkob - Add manual item
export async function POST(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()

    const response = await fetch(`${N8N_BASE}/madplan/indkob/tilfoej`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Upstream error' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result.data ?? result)
  } catch (error) {
    console.error('POST /api/madplan/indkob error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/madplan/indkob - Toggle item checked state
export async function PUT(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()

    const response = await fetch(`${N8N_BASE}/madplan/indkob/opdater`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Upstream error' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result.data ?? result)
  } catch (error) {
    console.error('PUT /api/madplan/indkob error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/madplan/indkob - Clear items (all or for specific week)
// If aar/uge omitted, clears ALL items for ejerId
export async function DELETE(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const ejerId = searchParams.get('ejerId')
  const aar = searchParams.get('aar')
  const uge = searchParams.get('uge')

  if (!ejerId) {
    return NextResponse.json(
      { error: 'Missing required parameter: ejerId' },
      { status: 400 }
    )
  }

  // Build body - include aar/uge only if both provided
  const body = aar && uge
    ? { ejerId, aar: Number(aar), uge: Number(uge) }
    : { ejerId }

  try {
    const response = await fetch(`${N8N_BASE}/madplan/indkob/slet-alle`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Upstream error' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result.data ?? result)
  } catch (error) {
    console.error('DELETE /api/madplan/indkob error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
