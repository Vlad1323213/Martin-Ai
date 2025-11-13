/**
 * Google Calendar API Integration
 */

export interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  location?: string
  status: string
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3'

/**
 * Получить события календаря
 */
export async function getCalendarEvents(
  calendarId: string = 'primary',
  accessToken?: string
): Promise<GoogleCalendarEvent[]> {
  try {
    const now = new Date()
    const timeMin = now.toISOString()
    const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 дней

    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '20',
    })

    // Используем либо OAuth токен, либо API ключ
    if (accessToken) {
      params.append('access_token', accessToken)
    } else if (API_KEY) {
      params.append('key', API_KEY)
    } else {
      throw new Error('No API key or access token provided')
    }

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${calendarId}/events?${params.toString()}`
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Google Calendar API Error:', error)
      throw new Error(`Google Calendar API Error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Failed to fetch calendar events:', error)
    throw error
  }
}

/**
 * Создать событие в календаре
 */
export async function createCalendarEvent(
  event: {
    summary: string
    description?: string
    location?: string
    start: { dateTime: string; timeZone?: string }
    end: { dateTime: string; timeZone?: string }
  },
  calendarId: string = 'primary',
  accessToken: string
): Promise<GoogleCalendarEvent> {
  try {
    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${calendarId}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Google Calendar API Error:', error)
      throw new Error(`Failed to create event: ${error.error?.message}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to create calendar event:', error)
    throw error
  }
}

/**
 * Получить список календарей пользователя
 */
export async function getCalendarList(accessToken: string) {
  try {
    const response = await fetch(
      `${CALENDAR_API_BASE}/users/me/calendarList`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch calendar list')
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Failed to fetch calendar list:', error)
    throw error
  }
}
