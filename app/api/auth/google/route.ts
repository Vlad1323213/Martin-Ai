import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  // Формируем URL для OAuth с правильными параметрами
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '350876804363-jkfjp6hdu4b17sedlldt4rcu6or7c9rn.apps.googleusercontent.com'
  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`
  const scope = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.events email profile'
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    access_type: 'offline',
    prompt: 'consent',
    state: userId
  })

  // Перенаправляем на Google OAuth
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  
  return NextResponse.redirect(authUrl)
}