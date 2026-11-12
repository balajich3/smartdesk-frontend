import { useState } from 'react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { useAuth } from '../../features/auth/useAuth.js'
import { useNotifications } from '../../features/notifications/useNotifications.js'

function formatTime(value) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function NotificationPanel() {
  const { user } = useAuth()
  const { items, unreadCount, markRead, markAllRead } = useNotifications(user.email)
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        className="relative grid size-9 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[9px] font-semibold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button aria-label="Close notifications" className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} type="button" />
          <section aria-label="Notifications" className="absolute right-0 top-full z-40 mt-2 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/10">
            <header className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Notifications</h2>
                <p className="text-[11px] text-neutral-500">{unreadCount ? `${unreadCount} unread` : 'All caught up'}</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40" disabled={!unreadCount} onClick={markAllRead} type="button">
                <CheckCheck size={14} /> Mark all read
              </button>
            </header>
            <div className="max-h-[min(26rem,65vh)] overflow-y-auto">
              {items.length ? items.map((item) => (
                <article className={`border-b border-neutral-100 px-4 py-3 last:border-b-0 ${item.isRead ? 'bg-white' : 'bg-blue-50/50'}`} key={item.id}>
                  <div className="flex items-start gap-3">
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.isRead ? 'bg-neutral-200' : 'bg-blue-600'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-semibold text-neutral-900">{item.title}</h3>
                        <time className="shrink-0 text-[10px] text-neutral-400">{formatTime(item.createdAt)}</time>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-neutral-600">{item.message}</p>
                    </div>
                    {!item.isRead && (
                      <button aria-label={`Mark ${item.title} as read`} className="grid size-7 shrink-0 place-items-center rounded-md text-neutral-400 hover:bg-white hover:text-neutral-700" onClick={() => markRead(item.id)} type="button">
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </article>
              )) : (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm font-medium text-neutral-700">No notifications yet</p>
                  <p className="mt-1 text-xs text-neutral-500">Updates for this account will appear here.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default NotificationPanel
