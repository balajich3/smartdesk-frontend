import { useContext, useMemo } from 'react'
import { NotificationContext } from './notificationContext.js'
import { markAllMockNotificationsRead, markMockNotificationRead } from './notificationStore.js'

export function useNotifications(userEmail) {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider')

  const items = useMemo(() => context.notifications
    .filter((item) => item.userEmail === userEmail)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [context.notifications, userEmail])

  return {
    items,
    unreadCount: items.filter((item) => !item.isRead).length,
    markRead: markMockNotificationRead,
    markAllRead: () => markAllMockNotificationsRead(userEmail),
  }
}
