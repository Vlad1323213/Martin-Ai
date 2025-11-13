/**
 * AI Command Parser - парсит команды пользователя
 */

export type CommandType = 
  | 'check_email'
  | 'check_calendar'
  | 'create_event'
  | 'send_email'
  | 'unknown'

export interface ParsedCommand {
  type: CommandType
  intent: string
  params?: {
    unreadOnly?: boolean
    startDate?: Date
    endDate?: Date
    query?: string
  }
}

/**
 * Парсит команду пользователя
 */
export function parseCommand(input: string): ParsedCommand {
  const lower = input.toLowerCase()

  // Email команды
  if (
    lower.includes('почт') ||
    lower.includes('email') ||
    lower.includes('письм') ||
    lower.includes('сообщени')
  ) {
    const unreadOnly = 
      lower.includes('непрочитан') ||
      lower.includes('нов') ||
      lower.includes('unread')

    return {
      type: 'check_email',
      intent: unreadOnly ? 'Проверяю непрочитанные письма...' : 'Проверяю почту...',
      params: { unreadOnly }
    }
  }

  // Календарь команды
  if (
    lower.includes('календарь') ||
    lower.includes('calendar') ||
    lower.includes('событи') ||
    lower.includes('встреч')
  ) {
    return {
      type: 'check_calendar',
      intent: 'Проверяю календарь...',
      params: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    }
  }

  // Создание события
  if (
    lower.includes('созда') && (lower.includes('событи') || lower.includes('встреч'))
  ) {
    return {
      type: 'create_event',
      intent: 'Создаю событие...',
    }
  }

  // Отправка письма
  if (
    lower.includes('отправ') && lower.includes('письм')
  ) {
    return {
      type: 'send_email',
      intent: 'Отправляю письмо...',
    }
  }

  return {
    type: 'unknown',
    intent: 'Обрабатываю запрос...',
  }
}

/**
 * Генерирует ответ на основе результатов
 */
export function generateResponse(command: ParsedCommand, data: any): string {
  switch (command.type) {
    case 'check_email':
      if (!data || !data.emails || data.emails.length === 0) {
        return 'У вас нет писем. Папка "Входящие" пуста.'
      }
      const unreadCount = data.emails.filter((e: any) => e.unread).length
      if (command.params?.unreadOnly) {
        return `Найдено ${unreadCount} непрочитанных писем:`
      }
      return `Последние письма (${unreadCount} непрочитанных):`

    case 'check_calendar':
      if (!data || !data.events || data.events.length === 0) {
        return 'На этой неделе нет предстоящих событий.'
      }
      return `Найдено ${data.events.length} событий на этой неделе:`

    case 'unknown':
    default:
      return 'Я могу помочь вам с:\n\n📧 Почтой - проверка, чтение писем\n📅 Календарем - просмотр событий\n\nПросто скажите что нужно!'
  }
}




