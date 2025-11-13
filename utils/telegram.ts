/**
 * Utility functions for working with Telegram Mini Apps
 */

/**
 * Validates Telegram WebApp init data
 * @param initData - The init data string from Telegram
 * @param botToken - Your bot token from BotFather
 * @returns boolean - true if data is valid
 */
export function validateTelegramWebAppData(
  initData: string,
  botToken: string
): boolean {
  // TODO: Implement validation logic
  // See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
  return true
}

/**
 * Parses Telegram WebApp init data
 * @param initData - The init data string
 * @returns Object with parsed data
 */
export function parseTelegramInitData(initData: string): Record<string, any> {
  const params = new URLSearchParams(initData)
  const result: Record<string, any> = {}

  params.forEach((value, key) => {
    try {
      result[key] = JSON.parse(value)
    } catch {
      result[key] = value
    }
  })

  return result
}

/**
 * Shows Telegram alert
 * @param message - Alert message
 */
export function showTelegramAlert(message: string): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message)
  } else {
    alert(message)
  }
}

/**
 * Shows Telegram confirm dialog
 * @param message - Confirmation message
 * @returns Promise<boolean> - true if confirmed
 */
export function showTelegramConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm(message, resolve)
    } else {
      resolve(confirm(message))
    }
  })
}

/**
 * Triggers haptic feedback
 * @param type - Type of haptic feedback
 */
export function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' = 'light'
): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const haptic = window.Telegram.WebApp.HapticFeedback

    if (type === 'success' || type === 'error' || type === 'warning') {
      haptic.notificationOccurred(type)
    } else {
      haptic.impactOccurred(type)
    }
  }
}

/**
 * Opens link in Telegram or external browser
 * @param url - URL to open
 * @param tryInstantView - Try to open in Telegram instant view
 */
export function openLink(url: string, tryInstantView = false): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.openLink(url, { try_instant_view: tryInstantView })
  } else {
    window.open(url, '_blank')
  }
}

/**
 * Closes the Mini App
 */
export function closeMiniApp(): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.close()
  }
}

/**
 * Gets user ID from Telegram
 * @returns User ID or null
 */
export function getTelegramUserId(): number | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe.user?.id || null
  }
  return null
}

/**
 * Gets user info from Telegram
 * @returns User info or null
 */
export function getTelegramUser(): {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
} | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe.user || null
  }
  return null
}

/**
 * Checks if app is running in Telegram
 * @returns boolean
 */
export function isInTelegram(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.Telegram?.WebApp !== undefined &&
    window.Telegram.WebApp.initData !== ''
  )
}

