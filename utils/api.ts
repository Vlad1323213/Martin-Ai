/**
 * API utility functions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

/**
 * Fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

/**
 * Chat API
 */
export const chatAPI = {
  sendMessage: async (message: string, userId?: number) => {
    return fetchAPI('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, userId }),
    })
  },
}

/**
 * Todos API
 */
export const todosAPI = {
  getAll: async (userId?: number) => {
    const params = userId ? `?userId=${userId}` : ''
    return fetchAPI(`/todos${params}`, {
      method: 'GET',
    })
  },

  create: async (
    title: string,
    userId?: number,
    dueDate?: Date
  ) => {
    return fetchAPI('/todos', {
      method: 'POST',
      body: JSON.stringify({
        title,
        userId,
        dueDate: dueDate?.toISOString(),
      }),
    })
  },

  update: async (
    id: string,
    updates: { completed?: boolean; title?: string }
  ) => {
    return fetchAPI('/todos', {
      method: 'PATCH',
      body: JSON.stringify({ id, ...updates }),
    })
  },

  delete: async (id: string) => {
    return fetchAPI(`/todos?id=${id}`, {
      method: 'DELETE',
    })
  },
}

/**
 * Calendar API
 */
export const calendarAPI = {
  getEvents: async (
    userId?: number,
    startDate?: Date,
    endDate?: Date
  ) => {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId.toString())
    if (startDate) params.append('startDate', startDate.toISOString())
    if (endDate) params.append('endDate', endDate.toISOString())

    const query = params.toString() ? `?${params.toString()}` : ''
    return fetchAPI(`/calendar${query}`, {
      method: 'GET',
    })
  },

  createEvent: async (event: {
    title: string
    description?: string
    startTime: Date
    endTime: Date
    location?: string
    userId?: number
  }) => {
    return fetchAPI('/calendar', {
      method: 'POST',
      body: JSON.stringify({
        ...event,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
      }),
    })
  },
}

/**
 * Emails API
 */
export const emailsAPI = {
  getAll: async (userId?: number, unreadOnly = false) => {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId.toString())
    if (unreadOnly) params.append('unreadOnly', 'true')

    const query = params.toString() ? `?${params.toString()}` : ''
    return fetchAPI(`/emails${query}`, {
      method: 'GET',
    })
  },

  markAsRead: async (id: string, unread = false) => {
    return fetchAPI('/emails', {
      method: 'PATCH',
      body: JSON.stringify({ id, unread }),
    })
  },
}








