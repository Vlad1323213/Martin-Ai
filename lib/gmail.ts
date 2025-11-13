/**
 * Gmail API integration
 */

import { EmailItem } from '@/types'

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

interface GmailMessage {
  id: string
  threadId: string
  labelIds?: string[]
  snippet: string
  payload: {
    headers: Array<{ name: string; value: string }>
  }
  internalDate: string
}

/**
 * Get Gmail messages
 */
export async function getGmailMessages(
  accessToken: string,
  maxResults: number = 10,
  unreadOnly: boolean = false
): Promise<EmailItem[]> {
  try {
    // Get message IDs
    const query = unreadOnly ? 'is:unread' : 'in:inbox'
    const listUrl = `${GMAIL_API_BASE}/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`
    
    const listResponse = await fetch(listUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!listResponse.ok) {
      throw new Error(`Gmail API error: ${listResponse.statusText}`)
    }

    const listData = await listResponse.json()
    const messageIds = listData.messages || []

    if (messageIds.length === 0) {
      return []
    }

    // Fetch full message details
    const messages = await Promise.all(
      messageIds.map(async ({ id }: { id: string }) => {
        const messageUrl = `${GMAIL_API_BASE}/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`
        const response = await fetch(messageUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        
        if (!response.ok) {
          return null
        }
        
        return await response.json()
      })
    )

    // Convert to EmailItem format
    return messages
      .filter((msg): msg is GmailMessage => msg !== null)
      .map((msg) => {
        const headers = msg.payload.headers
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown'
        const subject = headers.find(h => h.name === 'Subject')?.value || '(No subject)'
        const date = headers.find(h => h.name === 'Date')?.value || msg.internalDate
        
        return {
          id: msg.id,
          from: from.replace(/<.*>/, '').trim(), // Remove email address, keep name
          subject,
          preview: msg.snippet,
          unread: msg.labelIds?.includes('UNREAD') || false,
          timestamp: new Date(parseInt(msg.internalDate)),
        }
      })
  } catch (error) {
    console.error('Gmail fetch error:', error)
    throw error
  }
}

/**
 * Mark message as read
 */
export async function markAsRead(accessToken: string, messageId: string): Promise<void> {
  const url = `${GMAIL_API_BASE}/messages/${messageId}/modify`
  
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      removeLabelIds: ['UNREAD'],
    }),
  })
}

/**
 * Send email
 */
export async function sendGmail(
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<void> {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body,
  ].join('\n')

  const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const url = `${GMAIL_API_BASE}/messages/send`
  
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedEmail,
    }),
  })
}




