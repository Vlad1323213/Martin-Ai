import { NextRequest, NextResponse } from 'next/server'
import { getTokens } from '@/lib/token-storage'

/**
 * GET /api/debug?userId=123
 * Debug endpoint to check connection status
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        error: 'userId is required',
        example: '/api/debug?userId=123'
      }, { status: 400 })
    }

    // Проверяем Redis
    const redisStatus = process.env.REDIS_URL ? '✅ Configured' : '❌ Not configured'
    
    // Проверяем токены
    const googleTokens = await getTokens(userId, 'google')
    const yandexTokens = await getTokens(userId, 'yandex')

    return NextResponse.json({
      debug: {
        userId: userId,
        redis: {
          status: redisStatus,
          url: process.env.REDIS_URL ? 'Set (hidden)' : 'Not set'
        },
        google: {
          connected: googleTokens !== null,
          hasAccessToken: googleTokens?.access_token ? 'Yes' : 'No',
          hasRefreshToken: googleTokens?.refresh_token ? 'Yes' : 'No',
          expiresAt: googleTokens?.expires_at ? new Date(googleTokens.expires_at).toISOString() : 'N/A'
        },
        yandex: {
          connected: yandexTokens !== null
        },
        environment: {
          hasGoogleClientId: process.env.GOOGLE_CLIENT_ID ? 'Yes' : 'No',
          hasGoogleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Yes' : 'No',
          hasRedirectUri: process.env.GOOGLE_REDIRECT_URI ? process.env.GOOGLE_REDIRECT_URI : 'No',
          hasCalendarApiKey: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY ? 'Yes' : 'No'
        }
      }
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}


