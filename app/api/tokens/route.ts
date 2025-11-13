import { NextRequest, NextResponse } from 'next/server'
import { getTokens, disconnect, isConnected } from '@/lib/token-storage'

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

/**
 * POST /api/tokens/check
 * Check if user has connected providers
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      google: await isConnected(userId, 'google'),
      yandex: await isConnected(userId, 'yandex'),
    })
  } catch (error) {
    console.error('Check tokens error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



