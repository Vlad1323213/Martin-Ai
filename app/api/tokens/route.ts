import { NextRequest, NextResponse } from 'next/server'
import { getTokens, disconnect, saveTokens } from '@/lib/token-storage'

/**
 * GET /api/tokens?userId=123&provider=google
 * Get tokens for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const provider = searchParams.get('provider') as 'google' | 'yandex'

    if (!userId || !provider) {
      return NextResponse.json(
        { error: 'userId and provider are required' },
        { status: 400 }
      )
    }

    const tokens = await getTokens(userId, provider)

    if (!tokens) {
      return NextResponse.json(
        { connected: false },
        { status: 200 }
      )
    }

    return NextResponse.json({
      connected: true,
      tokens: tokens,
    })
  } catch (error) {
    console.error('Get tokens error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tokens
 * Save tokens for a user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, provider, tokens } = body

    if (!userId || !provider || !tokens) {
      return NextResponse.json(
        { error: 'userId, provider and tokens are required' },
        { status: 400 }
      )
    }

    await saveTokens(userId, provider, tokens)

    return NextResponse.json({
      success: true,
      message: 'Tokens saved successfully'
    })
  } catch (error) {
    console.error('Save tokens error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tokens?userId=123&provider=google
 * Disconnect provider for a user
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const provider = searchParams.get('provider') as 'google' | 'yandex'

    if (!userId || !provider) {
      return NextResponse.json(
        { error: 'userId and provider are required' },
        { status: 400 }
      )
    }

    await disconnect(userId, provider)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete tokens error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


