export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: ActionCard[]
  emails?: EmailItem[]
  events?: CalendarEvent[]
  todos?: Array<{id: string, text: string, completed: boolean}>
  todoTitle?: string
  emailDraft?: {to: string, subject: string, body: string}
  sms?: {to: string, body: string}
}

export interface ActionCard {
  id: string
  title: string
  subtitle?: string
  icon: ActionIcon
  type: ActionType
  data?: any
}

export type ActionIcon = 
  | 'calendar'
  | 'email'
  | 'todo'
  | 'message'
  | 'reminder'
  | 'integrate'
  | 'settings'

export type ActionType =
  | 'calendar'
  | 'email'
  | 'todo'
  | 'message'
  | 'reminder'
  | 'integrate'
  | 'settings'

export interface TodoItem {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  dueDate?: Date
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
}

export interface EmailItem {
  id: string
  from: string
  subject: string
  preview: string
  unread: boolean
  timestamp: Date
}

export interface ChatState {
  messages: Message[]
  isTyping: boolean
  inputValue: string
}

