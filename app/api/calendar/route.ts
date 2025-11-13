import { NextRequest, NextResponse } from 'next/server'
import { getCalendarEvents } from '@/lib/google-calendar'

// GET /api/calendar - Get calendar events
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accessToken = searchParams.get('accessToken')
    const calendarId = searchParams.get('calendarId') || 'primary'

    // Получаем события из Google Calendar (API ключ встроен в функцию)
    const googleEvents = await getCalendarEvents(calendarId, accessToken || undefined)

    // Конвертируем в наш формат
    const events = googleEvents.map((event) => ({
      id: event.id,
      title: event.summary || 'Без названия',
      description: event.description || '',
      startTime: event.start.dateTime || event.start.date || new Date().toISOString(),
      endTime: event.end.dateTime || event.end.date || new Date().toISOString(),
      location: event.location || '',
    }))

    return NextResponse.json({ events })
  } catch (error: any) {
    console.error('Get calendar error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch calendar events' },
      { status: 500 }
    )
  }
}

// POST /api/calendar - Create calendar event
export async function POST(request: NextRequest) {
  try {
    const { title, description, startTime, endTime, location, accessToken, calendarId } =
      await request.json()

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required to create events' },
        { status: 401 }
      )
    }

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Title, startTime, and endTime are required' },
        { status: 400 }
      )
    }

    const { createCalendarEvent } = await import('@/lib/google-calendar')
    
    const googleEvent = await createCalendarEvent(
      {
        summary: title,
        description: description || '',
        location: location || '',
        start: {
          dateTime: startTime,
          timeZone: 'Europe/Moscow',
        },
        end: {
          dateTime: endTime,
          timeZone: 'Europe/Moscow',
        },
      },
      calendarId || 'primary',
      accessToken
    )

    const newEvent = {
      id: googleEvent.id,
      title: googleEvent.summary,
      description: googleEvent.description || '',
      startTime: googleEvent.start.dateTime || googleEvent.start.date || '',
      endTime: googleEvent.end.dateTime || googleEvent.end.date || '',
      location: googleEvent.location || '',
    }

    return NextResponse.json({ event: newEvent }, { status: 201 })
  } catch (error: any) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    )
  }
}





