import { NextRequest, NextResponse } from 'next/server'
import { getYandexAuthUrl } from '@/lib/oauth'

export async function GET(request: NextRequest) {
  const clientId = process.env.YANDEX_CLIENT_ID
  const redirectUri = process.env.YANDEX_REDIRECT_URI || 'http://localhost:3001/api/auth/yandex/callback'

  if (!clientId) {
    return NextResponse.json(
      { error: 'Yandex OAuth not configured' },
      { status: 500 }
    )
  }

  const authUrl = getYandexAuthUrl(redirectUri, clientId)
  
  return NextResponse.redirect(authUrl)
}




