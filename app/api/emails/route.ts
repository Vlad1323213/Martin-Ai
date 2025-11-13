import { NextRequest, NextResponse } from 'next/server'
import { getGmailMessages } from '@/lib/gmail'

// GET /api/emails - Get emails
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accessToken = searchParams.get('accessToken')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const maxResults = parseInt(searchParams.get('maxResults') || '10')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      )
    }

    const emails = await getGmailMessages(accessToken, maxResults, unreadOnly)

    return NextResponse.json({ emails })
  } catch (error) {
    console.error('Get emails error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}

// PATCH /api/emails - Mark email as read
export async function PATCH(request: NextRequest) {
  try {
    const { id, accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Email ID required' },
        { status: 400 }
      )
    }

    const { markAsRead } = await import('@/lib/gmail')
    await markAsRead(accessToken, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update email error:', error)
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    )
  }
}





