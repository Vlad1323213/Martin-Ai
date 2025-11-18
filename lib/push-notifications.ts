// Push уведомления через Telegram Bot API

export async function sendPushNotification(
  userId: string | number,
  title: string,
  message: string,
  type: 'task' | 'event' | 'email' | 'reminder' = 'reminder'
) {
  try {
    // Получаем Telegram WebApp данные
    const webApp = (window as any).Telegram?.WebApp
    
    if (!webApp) {
      console.log('Telegram WebApp not available')
      return false
    }
    
    // Показываем нативное уведомление Telegram
    if (webApp.showAlert) {
      webApp.showAlert(`${title}\n\n${message}`)
    }
    
    // Вибрация для важных уведомлений
    if (type === 'reminder' || type === 'event') {
      webApp.HapticFeedback?.impactOccurred('medium')
    }
    
    // Сохраняем уведомление локально
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      time: 'Только что',
      read: false,
      userId,
      createdAt: new Date().toISOString()
    }
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    notifications.unshift(notification)
    
    // Ограничиваем до 100 уведомлений
    if (notifications.length > 100) {
      notifications.pop()
    }
    
    localStorage.setItem('notifications', JSON.stringify(notifications))
    
    // Обновляем счетчик непрочитанных
    const unreadCount = notifications.filter((n: any) => !n.read).length
    localStorage.setItem('unreadNotifications', unreadCount.toString())
    
    // Триггерим событие для обновления UI
    window.dispatchEvent(new CustomEvent('notification-added', { 
      detail: notification 
    }))
    
    // Показываем значок в Telegram
    if (webApp.MainButton) {
      webApp.MainButton.showProgress()
      setTimeout(() => {
        webApp.MainButton.hideProgress()
      }, 2000)
    }
    
    return true
  } catch (error) {
    console.error('Push notification error:', error)
    return false
  }
}

// Функция для планирования уведомлений
export function scheduleNotification(
  userId: string | number,
  title: string,
  message: string,
  scheduledTime: Date,
  type: 'task' | 'event' | 'email' | 'reminder' = 'reminder'
) {
  const now = new Date()
  const delay = scheduledTime.getTime() - now.getTime()
  
  if (delay <= 0) {
    // Если время уже прошло, отправляем сразу
    sendPushNotification(userId, title, message, type)
    return
  }
  
  // Планируем отправку
  setTimeout(() => {
    sendPushNotification(userId, title, message, type)
  }, delay)
  
  // Сохраняем запланированное уведомление
  const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]')
  scheduled.push({
    userId,
    title,
    message,
    scheduledTime: scheduledTime.toISOString(),
    type
  })
  localStorage.setItem('scheduledNotifications', JSON.stringify(scheduled))
}

// Проверка и отправка запланированных уведомлений при загрузке
export function checkScheduledNotifications() {
  const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]')
  const now = new Date()
  const remaining: any[] = []
  
  scheduled.forEach((notification: any) => {
    const scheduledTime = new Date(notification.scheduledTime)
    
    if (scheduledTime <= now) {
      // Время пришло - отправляем
      sendPushNotification(
        notification.userId,
        notification.title,
        notification.message,
        notification.type
      )
    } else {
      // Еще не время - оставляем в списке
      remaining.push(notification)
      
      // Перепланируем
      const delay = scheduledTime.getTime() - now.getTime()
      setTimeout(() => {
        sendPushNotification(
          notification.userId,
          notification.title,
          notification.message,
          notification.type
        )
      }, delay)
    }
  })
  
  // Сохраняем оставшиеся
  localStorage.setItem('scheduledNotifications', JSON.stringify(remaining))
}
