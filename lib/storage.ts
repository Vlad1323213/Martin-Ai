// Управление локальным хранилищем данных

export interface StoredTask {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export interface StoredEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  location?: string
  createdAt: string
}

export interface ChatHistory {
  messages: any[]
  lastUpdated: string
}

// Задачи
export function saveTasks(tasks: StoredTask[]) {
  localStorage.setItem('userTasks', JSON.stringify(tasks))
}

export function getTasks(): StoredTask[] {
  const saved = localStorage.getItem('userTasks')
  return saved ? JSON.parse(saved) : []
}

export function addTask(text: string): StoredTask {
  const tasks = getTasks()
  const newTask: StoredTask = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  }
  tasks.push(newTask)
  saveTasks(tasks)
  return newTask
}

export function toggleTask(id: string) {
  const tasks = getTasks()
  const task = tasks.find(t => t.id === id)
  if (task) {
    task.completed = !task.completed
    saveTasks(tasks)
  }
}

export function deleteTask(id: string) {
  const tasks = getTasks()
  const filtered = tasks.filter(t => t.id !== id)
  saveTasks(filtered)
}

// События календаря
export function saveEvents(events: StoredEvent[]) {
  localStorage.setItem('calendarEvents', JSON.stringify(events))
}

export function getEvents(): StoredEvent[] {
  const saved = localStorage.getItem('calendarEvents')
  return saved ? JSON.parse(saved) : []
}

export function addEvent(event: Omit<StoredEvent, 'id' | 'createdAt'>): StoredEvent {
  const events = getEvents()
  const newEvent: StoredEvent = {
    ...event,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  events.push(newEvent)
  saveEvents(events)
  return newEvent
}

export function deleteEvent(id: string) {
  const events = getEvents()
  const filtered = events.filter(e => e.id !== id)
  saveEvents(filtered)
}

// История чата
export function saveChatHistory(messages: any[]) {
  const history: ChatHistory = {
    messages: messages.slice(-100), // Сохраняем последние 100 сообщений
    lastUpdated: new Date().toISOString()
  }
  localStorage.setItem('chatHistory', JSON.stringify(history))
}

export function getChatHistory(): any[] {
  const saved = localStorage.getItem('chatHistory')
  if (!saved) return []
  
  const history: ChatHistory = JSON.parse(saved)
  
  // Проверяем, не устарела ли история (больше 7 дней)
  const lastUpdated = new Date(history.lastUpdated)
  const now = new Date()
  const daysDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  
  if (daysDiff > 7) {
    localStorage.removeItem('chatHistory')
    return []
  }
  
  return history.messages
}

// Сессия пользователя
export function saveUserSession(userData: any) {
  localStorage.setItem('userSession', JSON.stringify({
    ...userData,
    lastLogin: new Date().toISOString()
  }))
}

export function getUserSession() {
  const saved = localStorage.getItem('userSession')
  return saved ? JSON.parse(saved) : null
}

export function clearUserSession() {
  // Очищаем только данные сессии, но не задачи и события
  localStorage.removeItem('userSession')
  localStorage.removeItem('chatHistory')
  localStorage.removeItem('googleTokens')
}

// AI память (контекст между сессиями)
export function saveAIMemory(memory: Record<string, any>) {
  const existing = getAIMemory()
  const updated = { ...existing, ...memory }
  localStorage.setItem('aiMemory', JSON.stringify(updated))
}

export function getAIMemory(): Record<string, any> {
  const saved = localStorage.getItem('aiMemory')
  return saved ? JSON.parse(saved) : {}
}

// Полная очистка (при выходе)
export function clearAllData() {
  // Сохраняем важные настройки
  const tasks = localStorage.getItem('userTasks')
  const events = localStorage.getItem('calendarEvents')
  const profile = localStorage.getItem('userProfile')
  
  // Очищаем всё
  localStorage.clear()
  
  // Восстанавливаем важные данные
  if (tasks) localStorage.setItem('userTasks', tasks)
  if (events) localStorage.setItem('calendarEvents', events)
  if (profile) localStorage.setItem('userProfile', profile)
}
