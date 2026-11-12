import { useEffect, useMemo, useState } from 'react'
import { NotificationContext } from './notificationContext.js'
import { loadNotifications } from './notificationStore.js'

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(loadNotifications)

  useEffect(() => {
    function refresh(event) {
      if (!event.key || event.key === 'smartdesk-demo-notifications') {
        setNotifications(loadNotifications())
      }
    }

    window.addEventListener('storage', refresh)
    window.addEventListener('smartdesk:notifications-updated', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('smartdesk:notifications-updated', refresh)
    }
  }, [])

  const value = useMemo(() => ({ notifications }), [notifications])
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
