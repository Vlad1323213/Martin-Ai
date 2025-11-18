export interface Notification {
  id: string
  type: 'task' | 'event' | 'email' | 'system'
  title: string
  message: string
  time: string
  read: boolean
}

export function addNotification(
  type: Notification['type'],
  title: string,
  message: string
) {
  // Получаем существующие уведомления
  const existing = localStorage.getItem('notifications')
  const notifications: Notification[] = existing ? JSON.parse(existing) : []
  
  // Создаем новое уведомление
  const newNotification: Notification = {
    id: Date.now().toString(),
    type,
    title,
    message,
    time: 'Только что',
    read: false
  }
  
  // Добавляем в начало списка
  notifications.unshift(newNotification)
  
  // Ограничиваем до 50 последних
  if (notifications.length > 50) {
    notifications.pop()
  }
  
  // Сохраняем
  localStorage.setItem('notifications', JSON.stringify(notifications))
  
  // Обновляем счетчик непрочитанных
  const unreadCount = notifications.filter(n => !n.read).length
  localStorage.setItem('unreadNotifications', unreadCount.toString())
  
  // Триггерим событие для обновления UI
  window.dispatchEvent(new CustomEvent('notification-added', { 
    detail: newNotification 
  }))
  
  return newNotification
}

export function clearNotifications() {
  localStorage.removeItem('notifications')
  localStorage.setItem('unreadNotifications', '0')
  window.dispatchEvent(new CustomEvent('notifications-cleared'))
}

export function markNotificationAsRead(id: string) {
  const existing = localStorage.getItem('notifications')
  if (!existing) return
  
  const notifications: Notification[] = JSON.parse(existing)
  const notification = notifications.find(n => n.id === id)
  
  if (notification) {
    notification.read = true
    localStorage.setItem('notifications', JSON.stringify(notifications))
    
    const unreadCount = notifications.filter(n => !n.read).length
    localStorage.setItem('unreadNotifications', unreadCount.toString())
    
    window.dispatchEvent(new CustomEvent('notification-read', { detail: id }))
  }
}
