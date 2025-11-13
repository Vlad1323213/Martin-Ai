import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/oauth'

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback'
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') // Telegram user ID

  if (!clientId) {
    return NextResponse.json(
      { error: 'Google OAuth not configured' },
      { status: 500 }
    )
  }

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    )
  }

  // Используем state parameter для передачи userId (стандартный способ OAuth)
  const state = userId
  
  const authUrl = getGoogleAuthUrl(redirectUri, clientId, state)
  
  return NextResponse.redirect(authUrl)
}

