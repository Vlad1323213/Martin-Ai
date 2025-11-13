/**
 * Server-side token storage for Telegram Mini App
 * Uses Vercel KV (Redis) for production or in-memory for development
 */

import { kv } from '@vercel/kv'

interface OAuthTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  expires_at: number
}

// Fallback to in-memory storage for local development (if KV is not configured)
const tokenStore = new Map<string, OAuthTokens>()
const isKvAvailable = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN

/**
 * Save tokens for a user
 */
export async function saveTokens(userId: string, provider: 'google' | 'yandex', tokens: OAuthTokens) {
  const key = `tokens:${userId}:${provider}`
  const tokensWithExpiry = {
    ...tokens,
    expires_at: Date.now() + tokens.expires_in * 1000,
  }

  if (isKvAvailable) {
    // Use Vercel KV (Redis)
    await kv.set(key, tokensWithExpiry, {
      ex: tokens.expires_in, // Auto-expire in Redis
    })
    console.log(`✅ Tokens saved to KV for user ${userId} (${provider})`)
  } else {
    // Fallback to in-memory
    tokenStore.set(key, tokensWithExpiry)
    console.log(`✅ Tokens saved to memory for user ${userId} (${provider})`)
  }
}

/**
 * Get tokens for a user
 */
export async function getTokens(userId: string, provider: 'google' | 'yandex'): Promise<OAuthTokens | null> {
  const key = `tokens:${userId}:${provider}`

  if (isKvAvailable) {
    // Use Vercel KV (Redis)
    const tokens = await kv.get<OAuthTokens>(key)

    if (!tokens) {
      console.log(`❌ No tokens found in KV for user ${userId} (${provider})`)
      return null
    }

    // Check if expired (Redis should auto-delete, but double-check)
    if (Date.now() > tokens.expires_at) {
      console.log(`⏰ Tokens expired in KV for user ${userId} (${provider})`)
      await kv.del(key)
      return null
    }

    console.log(`✅ Tokens retrieved from KV for user ${userId} (${provider})`)
    return tokens
  } else {
    // Fallback to in-memory
    const tokens = tokenStore.get(key)

    if (!tokens) {
      console.log(`❌ No tokens found in memory for user ${userId} (${provider})`)
      return null
    }

    // Check if expired
    if (Date.now() > tokens.expires_at) {
      console.log(`⏰ Tokens expired in memory for user ${userId} (${provider})`)
      tokenStore.delete(key)
      return null
    }

    console.log(`✅ Tokens retrieved from memory for user ${userId} (${provider})`)
    return tokens
  }
}

/**
 * Check if user has connected provider
 */
export async function isConnected(userId: string, provider: 'google' | 'yandex'): Promise<boolean> {
  const tokens = await getTokens(userId, provider)
  return tokens !== null
}

/**
 * Disconnect provider for a user
 */
export async function disconnect(userId: string, provider: 'google' | 'yandex') {
  const key = `tokens:${userId}:${provider}`

  if (isKvAvailable) {
    await kv.del(key)
    console.log(`🗑️ Tokens deleted from KV for user ${userId} (${provider})`)
  } else {
    tokenStore.delete(key)
    console.log(`🗑️ Tokens deleted from memory for user ${userId} (${provider})`)
  }
}


