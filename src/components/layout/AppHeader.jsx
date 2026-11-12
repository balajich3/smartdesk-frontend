import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { ROLES } from '../../context/roles.js'
import { useAuth } from '../../features/auth/useAuth.js'
import NotificationPanel from './NotificationPanel.jsx'
import ProfileMenu from './ProfileMenu.jsx'
import { ROLE_NAVIGATION } from '../../routes/navigation.js'

function AppHeader({ onMenuClick }) {
  const { user } = useAuth()
  const role = user.role
  const { pathname } = useLocation()
  const currentLink = ROLE_NAVIGATION[role].links.find((link) => (
    link.path === pathname || (link.path !== ROLE_NAVIGATION[role].homePath && pathname.startsWith(`${link.path}/`))
  ))

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open navigation"
          className="grid size-9 shrink-0 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100 md:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={19} />
        </button>
        <div className="hidden items-center gap-2 text-sm text-neutral-400 sm:flex">
          <span>Workspace</span>
          <span aria-hidden="true">/</span>
        </div>
        <h1 className="truncate text-sm font-medium text-neutral-800">
          {currentLink?.label || ROLE_NAVIGATION[role].label}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {(role === ROLES.EMPLOYEE || role === ROLES.AGENT) && <NotificationPanel />}
        <ProfileMenu />
      </div>
    </header>
  )
}

export default AppHeader
