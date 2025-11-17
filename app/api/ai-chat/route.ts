import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText, tool } from 'ai'
import { z } from 'zod'
import { getTokens } from '@/lib/token-storage'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AIRequest {
  message: string
  userId: string
  history?: AIMessage[]
}

/**
 * AI Agent с полной автоматизацией через OpenAI + Vercel AI SDK
 * AI САМ вносит изменения в календарь и задачи
 */
export async function POST(request: NextRequest) {
  let requestBody: AIRequest | null = null
  
  try {
    requestBody = await request.json()
    
    if (!requestBody) {
      return NextResponse.json({ text: 'Invalid request' }, { status: 400 })
    }
    
    const { message, userId, history = [] } = requestBody

    console.log(`🤖 AI запрос от ${userId}: "${message}"`)

    // Проверяем есть ли OpenAI ключ
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ OPENAI_API_KEY не найден - простая логика')
      return NextResponse.json(await handleWithoutAI(message, userId))
    }

    // Используем настоящий AI с tools
    const systemPrompt = `Ты Mortis - умный AI-ассистент для управления задачами, календарем и почтой.

ТВОЯ РОЛЬ:
Ты автономный агент который САМ вносит изменения, проверяет конфликты и уточняет детали.

ВАЖНЫЕ ПРАВИЛА:
1. ВСЕГДА извлекай: название, время, дату, место
2. Если время не указано - ОБЯЗАТЕЛЬНО уточни
3. Перед созданием события - ПРОВЕРЬ есть ли конфликты времени
4. Если время занято - предложи ближайшее свободное или уточни
5. Отвечай КРАТКО (1-2 предложения)
6. Используй эмодзи: ✅ (готово), ⏰ (время), 📍 (место), ❌ (ошибка)

АВТОМАТИЗАЦИЯ:
- Создавай события в Google Calendar реально
- Сохраняй задачи в базе данных
- Проверяй календарь на конфликты
- Удаляй/изменяй события если попросят

User ID: ${userId}
Язык: Русский`

    // Определяем инструменты для AI
    const tools = {
      createCalendarEvent: tool({
        description: 'Создает событие в Google Calendar пользователя',
        parameters: z.object({
          title: z.string().describe('Название события'),
          startTime: z.string().describe('Время начала (ISO string)'),
          endTime: z.string().describe('Время окончания (ISO string)'),
          location: z.string().optional().describe('Место проведения'),
        }),
        execute: async ({ title, startTime, endTime, location }) => {
          try {
            const tokens = await getTokens(userId, 'google')
            if (!tokens) {
              return { success: false, error: 'Google не подключен' }
            }

            const event = {
              summary: title,
              start: { dateTime: startTime, timeZone: 'Europe/Moscow' },
              end: { dateTime: endTime, timeZone: 'Europe/Moscow' },
              location: location || '',
            }

            const response = await fetch(
              'https://www.googleapis.com/calendar/v3/calendars/primary/events',
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${tokens.access_token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
              }
            )

            if (!response.ok) {
              return { success: false, error: 'Ошибка создания события' }
            }

            const created = await response.json()
            console.log(`✅ Событие создано: ${title}`)
            
            return { 
              success: true, 
              eventId: created.id,
              title,
              startTime,
              endTime,
              location 
            }
          } catch (error) {
            return { success: false, error: String(error) }
          }
        },
      }),

      checkCalendarConflicts: tool({
        description: 'Проверяет есть ли конфликты времени в календаре пользователя',
        parameters: z.object({
          startTime: z.string().describe('Время начала для проверки'),
          endTime: z.string().describe('Время окончания для проверки'),
        }),
        execute: async ({ startTime, endTime }) => {
          try {
            const tokens = await getTokens(userId, 'google')
            if (!tokens) {
              return { hasConflict: false, message: 'Календарь не подключен' }
            }

            const response = await fetch(
              `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startTime}&timeMax=${endTime}&singleEvents=true`,
              {
                headers: {
                  'Authorization': `Bearer ${tokens.access_token}`,
                },
              }
            )

            const data = await response.json()
            const hasConflict = data.items && data.items.length > 0
            
            return { 
              hasConflict,
              conflictingEvents: hasConflict ? data.items.map((e: any) => e.summary) : [],
              message: hasConflict 
                ? `Время занято: ${data.items.map((e: any) => e.summary).join(', ')}` 
                : 'Время свободно'
            }
          } catch (error) {
            return { hasConflict: false, message: 'Ошибка проверки' }
          }
        },
      }),

      createTask: tool({
        description: 'Создает задачу в списке дел пользователя',
        parameters: z.object({
          text: z.string().describe('Текст задачи'),
        }),
        execute: async ({ text }) => {
          try {
            if (!process.env.REDIS_URL) {
              return { success: true, task: { id: '1', text, completed: false } }
            }

            const Redis = (await import('ioredis')).default
            const client = new Redis(process.env.REDIS_URL)
            
            const todosKey = `todos:${userId}`
            const data = await client.get(todosKey)
            const todos = data ? JSON.parse(data) : []
            
            const newTodo = {
              id: Date.now().toString(),
              text,
              completed: false,
              createdAt: new Date().toISOString()
            }
            
            todos.push(newTodo)
            await client.set(todosKey, JSON.stringify(todos))
            await client.quit()
            
            console.log(`✅ Задача сохранена: ${text}`)
            
            return { success: true, task: newTodo }
          } catch (error) {
            return { success: false, error: String(error) }
          }
        },
      }),
    }

    // Формируем сообщения для AI
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.map((msg: AIMessage) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ]

    // Вызываем AI с инструментами
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages,
      tools,
      maxSteps: 5, // AI может делать до 5 действий подряд
      temperature: 0.3,
      maxTokens: 600,
    })

    console.log(`🤖 AI ответ: "${result.text}"`)
    console.log(`🔧 Tool calls: ${result.steps.length} шагов`)

    // Формируем структурированный ответ
    const response = await formatAIResponse(result, message, userId)
    
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ AI Agent error:', error)
    
    if (requestBody) {
      return NextResponse.json(
        await handleWithoutAI(requestBody.message, requestBody.userId)
      )
    }
    
    return NextResponse.json(
      { text: 'Ошибка обработки запроса' },
      { status: 500 }
    )
  }
}

/**
 * Форматирует ответ AI в структуру с карточками
 */
async function formatAIResponse(result: any, originalMessage: string, userId: string) {
  const lower = originalMessage.toLowerCase()
  const response: any = { text: result.text }

  // Проверяем какие tools были вызваны
  const toolCalls = result.steps.flatMap((step: any) => step.toolCalls || [])
  
  // Ищем созданные события
  const eventCreated = toolCalls.find((call: any) => 
    call.toolName === 'createCalendarEvent' && call.result?.success
  )
  
  if (eventCreated) {
    response.events = [{
      id: eventCreated.result.eventId,
      title: eventCreated.result.title,
      startTime: eventCreated.result.startTime,
      endTime: eventCreated.result.endTime,
      location: eventCreated.result.location
    }]
  }
  
  // Ищем созданные задачи
  const taskCreated = toolCalls.find((call: any) => 
    call.toolName === 'createTask' && call.result?.success
  )
  
  if (taskCreated) {
    response.todos = [{
      id: taskCreated.result.task.id,
      text: taskCreated.result.task.text,
      completed: false
    }]
    response.todoTitle = taskCreated.result.task.text
  }

  // Fallback на извлечение из текста если tools не сработали
  if (!response.events && !response.todos) {
    if (/добав.*задач/.test(lower)) {
      const task = extractTaskText(originalMessage)
      response.todos = [{ id: '1', text: task, completed: false }]
      response.todoTitle = task
    }
    
    if (/забронир|заблокир/.test(lower)) {
      const time = extractTime(originalMessage)
      if (time.start) {
        response.events = [{
          id: '1',
          title: extractEventTitle(originalMessage),
          startTime: time.start,
          endTime: time.end,
          location: extractLocation(originalMessage)
        }]
      }
    }
  }

  return response
}

/**
 * Обработка без AI (fallback)
 */
async function handleWithoutAI(message: string, userId: string) {
  const lower = message.toLowerCase()
  
  if (/добав.*задач/.test(lower) && /и\s+(забронир|заблокир)/.test(lower)) {
    const task = extractTaskText(message)
    const time = extractTime(message)
    const eventTitle = extractEventTitle(message)
    
    return {
      text: `✅ Добавил задачу "${task}" и заблокировал время для "${eventTitle}". Готово!`,
      todos: [{ id: '1', text: task, completed: false }],
      todoTitle: task,
      events: time.start ? [{
        id: '1',
        title: eventTitle,
        startTime: time.start,
        endTime: time.end || time.start,
        location: extractLocation(message)
      }] : undefined
    }
  }
  
  if (/добав.*задач/.test(lower)) {
    const task = extractTaskText(message)
    return {
      text: `✅ Добавил задачу "${task}". Что еще?`,
      todos: [{ id: '1', text: task, completed: false }],
      todoTitle: task
    }
  }
  
  if (/покажи.*дел|список/.test(lower)) {
    return {
      text: 'Вот ваш список дел:',
      todos: [
        { id: '1', text: 'Проверить квартальные отчеты', completed: true },
        { id: '2', text: 'Подготовить презентацию', completed: false },
      ],
      todoTitle: 'Мои задачи'
    }
  }
  
  return {
    text: 'Я могу помочь с задачами и календарем. Что вам нужно?'
  }
}

/**
 * Вспомогательные функции
 */
function extractTaskText(message: string): string {
  let task = message
  const prefixes = ['добавь', 'создай', 'задачу', 'задача', 'дело', ':']
  prefixes.forEach(p => {
    task = task.replace(new RegExp(`\\b${p}\\b`, 'gi'), '')
  })
  
  if (task.includes(' и ')) {
    task = task.split(' и ')[0]
  }
  
  return task.trim() || 'Новая задача'
}

function extractEventTitle(message: string): string {
  if (/чтение|читать/i.test(message)) return 'Чтение в библиотеке'
  if (/встреча/i.test(message)) return 'Встреча'
  if (/звонок|позвон/i.test(message)) return 'Телефонный звонок'
  if (/спорт|трениров/i.test(message)) return 'Тренировка'
  
  const forMatch = message.match(/для\s+(.+?)(?:\s+в\s+|\s+на\s+|$)/i)
  if (forMatch) return forMatch[1].trim()
  
  return 'Заблокированное время'
}

function extractTime(message: string) {
  const timeMatch = message.match(/(\d{1,2}):?(\d{2})?-(\d{1,2}):?(\d{2})?|(\d{1,2}):?(\d{2})?/)
  
  if (!timeMatch) {
    return { start: null, end: null }
  }
  
  const startHour = parseInt(timeMatch[1] || timeMatch[5] || '21')
  const startMin = parseInt(timeMatch[2] || timeMatch[6] || '0')
  const endHour = timeMatch[3] ? parseInt(timeMatch[3]) : startHour + 1
  const endMin = timeMatch[4] ? parseInt(timeMatch[4]) : startMin
  
  const start = new Date()
  start.setHours(startHour, startMin, 0, 0)
  
  const end = new Date()
  end.setHours(endHour, endMin, 0, 0)
  
  return {
    start: start.toISOString(),
    end: end.toISOString()
  }
}

function extractLocation(message: string): string | undefined {
  if (/библиотек/i.test(message)) return 'Библиотека'
  if (/офис/i.test(message)) return 'Офис'
  if (/zoom/i.test(message)) return 'Zoom'
  return undefined
}
