import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = process.env.N8N_WEBHOOK_URL

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
