/**
 * OAuth helper functions for Google and Yandex
 */

interface OAuthTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
}

// Google OAuth URLs
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

// Yandex OAuth URLs
export const YANDEX_AUTH_URL = 'https://oauth.yandex.ru/authorize'
export const YANDEX_TOKEN_URL = 'https://oauth.yandex.ru/token'

/**
 * Generate Google OAuth URL
 */
export function getGoogleAuthUrl(redirectUri: string, clientId: string, state?: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
  })

  // Добавляем state если передан (для передачи дополнительных данных)
  if (state) {
    params.append('state', state)
  }

  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

/**
 * Generate Yandex OAuth URL
 */
export function getYandexAuthUrl(redirectUri: string, clientId: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'login:email login:info mail:imap_full mail:send calendar:read calendar:write',
  })

  return `${YANDEX_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange authorization code for tokens (Google)
 */
export async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string
): Promise<OAuthTokens> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to exchange code: ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Exchange authorization code for tokens (Yandex)
 */
export async function exchangeYandexCode(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<OAuthTokens> {
  const response = await fetch(YANDEX_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to exchange code: ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Refresh Google access token
 */
export async function refreshGoogleToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<OAuthTokens> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Store tokens in localStorage (temporary solution)
 */
export function storeTokens(provider: 'google' | 'yandex', tokens: OAuthTokens) {
  const key = `${provider}_tokens`
  localStorage.setItem(key, JSON.stringify(tokens))
  localStorage.setItem(`${key}_expiry`, (Date.now() + tokens.expires_in * 1000).toString())
}

/**
 * Get tokens from localStorage
 */
export function getTokens(provider: 'google' | 'yandex'): OAuthTokens | null {
  const key = `${provider}_tokens`
  const tokens = localStorage.getItem(key)
  const expiry = localStorage.getItem(`${key}_expiry`)

  if (!tokens || !expiry) return null

  // Check if expired
  if (Date.now() > parseInt(expiry)) {
    localStorage.removeItem(key)
    localStorage.removeItem(`${key}_expiry`)
    return null
  }

  return JSON.parse(tokens)
}

/**
 * Check if provider is connected
 */
export function isProviderConnected(provider: 'google' | 'yandex'): boolean {
  return getTokens(provider) !== null
}

/**
 * Disconnect provider
 */
export function disconnectProvider(provider: 'google' | 'yandex') {
  const key = `${provider}_tokens`
  localStorage.removeItem(key)
  localStorage.removeItem(`${key}_expiry`)
}

