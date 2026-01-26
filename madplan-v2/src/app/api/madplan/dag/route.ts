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
    const { action, ...data } = body

    // Route to appropriate n8n endpoint based on action
    // 'note' action uses the same endpoint as 'opdater' - the workflow handles note field
    const endpoint = action === 'slet' ? '/madplan/dag/slet' : '/madplan/dag/opdater'

    const response = await fetch(`${N8N_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: 'Upstream error', details: errorText },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result.data ?? result)
  } catch (error) {
    console.error('POST /api/madplan/dag error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
