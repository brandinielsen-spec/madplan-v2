import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = process.env.N8N_WEBHOOK_URL

// GET: Fetch week data
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

  if (!ejerId || !aar || !uge) {
    return NextResponse.json(
      { error: 'Missing required parameters: ejerId, aar, uge' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${N8N_BASE}/madplan/uge?ejerId=${ejerId}&aar=${aar}&uge=${uge}`,
      { cache: 'no-store' }
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
    console.error('GET /api/madplan/uge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new week
export async function POST(request: NextRequest) {
  if (!N8N_BASE) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { ejerId, aar, uge } = body

    if (!ejerId || !aar || !uge) {
      return NextResponse.json(
        { error: 'Missing required parameters: ejerId, aar, uge' },
        { status: 400 }
      )
    }

    const response = await fetch(`${N8N_BASE}/madplan/uge/opret`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ejerId, aar, uge }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: 'Upstream error', details: errorText },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/madplan/uge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
