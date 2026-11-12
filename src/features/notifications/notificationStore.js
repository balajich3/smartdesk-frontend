const STORAGE_KEY = 'smartdesk-demo-notifications'

function seedNotifications() {
  const now = Date.now()
  return [
    {
      id: 'employee-seed-assignment',
      userEmail: 'employee@smartdesk.com',
      title: 'Your ticket was assigned',
      message: 'Jordan Lee picked up SD-1048 and will take a look.',
      createdAt: new Date(now - 18 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: 'employee-seed-update',
      userEmail: 'employee@smartdesk.com',
      title: 'Support replied to your request',
      message: 'There is a new update on your analytics workspace request.',
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: 'agent-seed-queue',
      userEmail: 'agent@smartdesk.com',
      title: 'New ticket in the queue',
      message: 'A high priority request is waiting for an agent.',
      createdAt: new Date(now - 12 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ]
}

function readAllNotifications() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
    const seeded = seedNotifications()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  } catch {
    return seedNotifications()
  }
}

function saveNotifications(notifications) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  } catch {
    // The notifications still update in the current in-memory session.
  }
  window.dispatchEvent(new CustomEvent('smartdesk:notifications-updated'))
}

export function loadNotifications() {
  return readAllNotifications()
}

export function addMockNotification(notification) {
  const current = readAllNotifications()
  const next = [{
    id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    isRead: false,
    ...notification,
  }, ...current]
  saveNotifications(next)
}

export function markMockNotificationRead(notificationId) {
  const next = readAllNotifications().map((item) => item.id === notificationId ? { ...item, isRead: true } : item)
  saveNotifications(next)
}

export function markAllMockNotificationsRead(userEmail) {
  const next = readAllNotifications().map((item) => item.userEmail === userEmail ? { ...item, isRead: true } : item)
  saveNotifications(next)
}
