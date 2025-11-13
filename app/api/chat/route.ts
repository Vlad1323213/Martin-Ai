import { NextRequest, NextResponse } from 'next/server'

// POST /api/chat - Send message to AI
export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // TODO: Интегрировать с реальным AI API (OpenAI, Claude, etc.)
    // Пример интеграции с OpenAI:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are Martin, a helpful personal AI assistant for managing calendar, emails, and tasks.'
          },
          {
            role: 'user',
            content: message
          }
        ],
      }),
    })
    
    const data = await response.json()
    const aiResponse = data.choices[0].message.content
    */

    // Временная заглушка
    const aiResponse = getSimpleResponse(message)

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getSimpleResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('calendar') || lowerMessage.includes('календарь')) {
    return "I've checked your calendar. You have 3 upcoming events this week."
  }

  if (lowerMessage.includes('email') || lowerMessage.includes('почта')) {
    return "You have 5 unread emails. Would you like me to summarize them?"
  }

  if (lowerMessage.includes('todo') || lowerMessage.includes('задач')) {
    return "Here's your to-do list for today. You have 4 pending tasks."
  }

  return "I'm here to help! I can manage your calendar, emails, and tasks. What would you like to do?"
}








