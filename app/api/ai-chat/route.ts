import { NextRequest, NextResponse } from 'next/server'

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
 * AI Agent - Умный ассистент Mortis
 * Автоматизирует создание задач и событий
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

    // Анализируем намерение
    const action = analyzeIntent(message.toLowerCase())
    
    // Выполняем действие
    const result = await executeAction(action, message, userId)
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ AI Agent error:', error)
    
    if (requestBody) {
      return NextResponse.json({
        text: 'Извините, произошла ошибка. Попробуйте еще раз.',
        error: String(error)
      }, { status: 200 })
    }
    
    return NextResponse.json(
      { text: 'Ошибка обработки запроса' },
      { status: 500 }
    )
  }
}

/**
 * Анализирует намерение пользователя
 */
function analyzeIntent(message: string): string {
  // Создать задачу + событие
  if (/добав.*задач/.test(message) && /и\s+(забронир|заблокир)/.test(message)) {
    return 'create_task_and_event'
  }
  
  // Создать задачу
  if (/добав.*задач|создай.*задач/.test(message)) {
    return 'create_task'
  }
  
  // Показать задачи
  if (/покажи.*дел|список.*дел|мои.*задач/.test(message)) {
    return 'show_tasks'
  }
  
  // Создать событие
  if (/забронир|заблокир|создай встречу/.test(message)) {
    return 'create_event'
  }
  
  // Напоминание
  if (/напомн/.test(message)) {
    return 'create_reminder'
  }
  
  return 'general'
}

/**
 * Выполняет действие
 */
async function executeAction(action: string, message: string, userId: string) {
  switch (action) {
    case 'create_task_and_event': {
      const task = extractTaskText(message)
      const time = extractTime(message)
      const eventTitle = extractEventTitle(message)
      const location = extractLocation(message)
      
      return {
        text: `✅ Добавил задачу "${task}" и заблокировал ${formatTime(time.start, time.end)} для "${eventTitle}". Готово!`,
        todos: [{ id: '1', text: task, completed: false }],
        todoTitle: task,
        events: [{
          id: '1',
          title: eventTitle,
          startTime: time.start,
          endTime: time.end,
          location
        }]
      }
    }
    
    case 'create_task': {
      const task = extractTaskText(message)
      
      return {
        text: `✅ Добавил задачу "${task}". Что еще?`,
        todos: [{ id: '1', text: task, completed: false }],
        todoTitle: task
      }
    }
    
    case 'show_tasks': {
      return {
        text: 'Вот ваш список дел:',
        todos: [
          { id: '1', text: 'Проверить квартальные отчеты', completed: true },
          { id: '2', text: 'Подготовить презентацию', completed: false },
          { id: '3', text: 'Позвонить в страховую', completed: false },
          { id: '4', text: 'Купить продукты', completed: false },
        ],
        todoTitle: 'Мои задачи'
      }
    }
    
    case 'create_event': {
      const time = extractTime(message)
      const title = extractEventTitle(message)
      const location = extractLocation(message)
      
      return {
        text: `✅ Заблокировал ${formatTime(time.start, time.end)} для "${title}". Событие в календаре!`,
        events: [{
          id: '1',
          title,
          startTime: time.start,
          endTime: time.end,
          location
        }]
      }
    }
    
    case 'create_reminder': {
      const time = extractTime(message)
      
      if (!time.start) {
        return { text: 'Во сколько вам напомнить? Укажите время (например: 10:00, 15:30)' }
      }
      
      const reminderText = message.replace(/напомн.*/i, '').trim()
      
      return {
        text: `✅ Напоминание установлено. Вы получите уведомление!`,
        events: [{
          id: '1',
          title: `🔔 Напоминание: ${reminderText || 'Важное дело'}`,
          startTime: time.start,
          endTime: time.end
        }]
      }
    }
    
    default: {
      return {
        text: 'Я могу помочь с задачами, календарем и напоминаниями. Что вам нужно?'
      }
    }
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
  if (/работ/i.test(message)) return 'Работа'
  
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
  if (/дом/i.test(message)) return 'Дома'
  if (/zoom/i.test(message)) return 'Zoom'
  
  return undefined
}

function formatTime(start: string | null, end: string | null): string {
  if (!start || !end) return ''
  
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  return `${startDate.getHours()}:${String(startDate.getMinutes()).padStart(2, '0')} - ${endDate.getHours()}:${String(endDate.getMinutes()).padStart(2, '0')}`
}

