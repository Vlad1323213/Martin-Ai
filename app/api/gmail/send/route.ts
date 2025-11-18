import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getTokens } from '@/lib/oauth'

export async function POST(request: Request) {
  try {
    const { userId, to, subject, body, cc, bcc, replyTo } = await request.json()

    if (!userId || !to || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
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

    // Создаем email в формате RFC 2822
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
    const messageParts = [
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 8bit',
    ]

    if (cc) messageParts.push(`Cc: ${cc}`)
    if (bcc) messageParts.push(`Bcc: ${bcc}`)
    if (replyTo) messageParts.push(`In-Reply-To: ${replyTo}`, `References: ${replyTo}`)

    messageParts.push('', body)

    const message = messageParts.join('\r\n')
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    // Отправляем письмо
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    })

    return NextResponse.json({
      success: true,
      messageId: response.data.id,
      threadId: response.data.threadId,
    })

  } catch (error) {
    console.error('Gmail send error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
