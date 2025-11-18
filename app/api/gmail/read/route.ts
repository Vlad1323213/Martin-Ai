import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getTokens } from '@/lib/oauth'

export async function POST(request: Request) {
  try {
    const { userId, query = 'is:unread -category:promotions -category:social', maxResults = 10 } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const tokens = await getTokens(userId)
    if (!tokens?.access_token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const auth = new google.auth.OAuth2()
    auth.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    })

    const gmail = google.gmail({ version: 'v1', auth })

    // Получаем список писем
    const messagesResponse = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    })

    const messages = messagesResponse.data.messages || []
    
    // Получаем детали каждого письма
    const emailDetails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
        })

        const headers = detail.data.payload?.headers || []
        const from = headers.find(h => h.name === 'From')?.value || ''
        const subject = headers.find(h => h.name === 'Subject')?.value || ''
        const date = headers.find(h => h.name === 'Date')?.value || ''
        
        // Извлекаем текст письма
        let body = ''
        const parts = detail.data.payload?.parts || []
        
        const findTextPart = (parts: any[]): string => {
          for (const part of parts) {
            if (part.mimeType === 'text/plain' && part.body?.data) {
              return Buffer.from(part.body.data, 'base64').toString('utf-8')
            }
            if (part.parts) {
              const text = findTextPart(part.parts)
              if (text) return text
            }
          }
          return ''
        }

        if (detail.data.payload?.body?.data) {
          body = Buffer.from(detail.data.payload.body.data, 'base64').toString('utf-8')
        } else {
          body = findTextPart(parts)
        }

        // Определяем категорию (спам, важное и т.д.)
        const labels = detail.data.labelIds || []
        const isSpam = labels.includes('SPAM')
        const isImportant = labels.includes('IMPORTANT')
        const isUnread = labels.includes('UNREAD')

        return {
          id: msg.id,
          from,
          subject,
          date,
          body: body.substring(0, 500), // Ограничиваем длину
          labels,
          isSpam,
          isImportant,
          isUnread,
        }
      })
    )

    return NextResponse.json({ 
      emails: emailDetails,
      total: messages.length 
    })

  } catch (error) {
    console.error('Gmail read error:', error)
    return NextResponse.json(
      { error: 'Failed to read emails' },
      { status: 500 }
    )
  }
}
