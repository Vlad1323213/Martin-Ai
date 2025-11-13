import { NextRequest, NextResponse } from 'next/server'
import { isConnected } from '@/lib/token-storage'

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

    const googleConnected = await isConnected(userId, 'google')
    const yandexConnected = await isConnected(userId, 'yandex')

    console.log(`✅ Connection check for user ${userId}: Google=${googleConnected}, Yandex=${yandexConnected}`)

    return NextResponse.json({
      google: googleConnected,
      yandex: yandexConnected,
    })
  } catch (error) {
    console.error('Check tokens error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

