/**
 * Server-side token storage for Telegram Mini App
 * Uses Redis for production or in-memory for development
 */

import Redis from 'ioredis'

interface OAuthTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  expires_at: number
}

// Redis client
let redis: Redis | null = null
if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL)
    console.log('✅ Redis client created')
    
    // Проверяем подключение
    redis.on('connect', () => {
      console.log('✅ Redis connected successfully')
    })
    
    redis.on('error', (err) => {
      console.error('❌ Redis connection error:', err)
    })
  } catch (error) {
    console.error('❌ Failed to create Redis client:', error)
    redis = null
  }
} else {
  console.log('⚠️ REDIS_URL not found - using in-memory storage')
}

// Fallback to in-memory storage for local development (if Redis is not configured)
const tokenStore = new Map<string, OAuthTokens>()
const isRedisAvailable = redis !== null

/**
 * Save tokens for a user
 */
export async function saveTokens(userId: string, provider: 'google' | 'yandex', tokens: OAuthTokens) {
  const key = `tokens:${userId}:${provider}`
  const tokensWithExpiry = {
    ...tokens,
    expires_at: Date.now() + tokens.expires_in * 1000,
  }

  if (isRedisAvailable && redis) {
    // Use Redis
    await redis.set(key, JSON.stringify(tokensWithExpiry), 'EX', tokens.expires_in)
    console.log(`✅ Tokens saved to Redis for user ${userId} (${provider})`)
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

  if (isRedisAvailable && redis) {
    // Use Redis
    const data = await redis.get(key)

    if (!data) {
      console.log(`❌ No tokens found in Redis for user ${userId} (${provider})`)
      return null
    }

    const tokens = JSON.parse(data) as OAuthTokens

    // Check if expired (Redis should auto-delete, but double-check)
    if (Date.now() > tokens.expires_at) {
      console.log(`⏰ Tokens expired in Redis for user ${userId} (${provider})`)
      await redis.del(key)
      return null
    }

    console.log(`✅ Tokens retrieved from Redis for user ${userId} (${provider})`)
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

  if (isRedisAvailable && redis) {
    await redis.del(key)
    console.log(`🗑️ Tokens deleted from Redis for user ${userId} (${provider})`)
  } else {
    tokenStore.delete(key)
    console.log(`🗑️ Tokens deleted from memory for user ${userId} (${provider})`)
  }
}


