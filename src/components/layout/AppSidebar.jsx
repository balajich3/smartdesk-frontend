import { Headset } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth.js'
import { ROLE_NAVIGATION } from '../../routes/navigation.js'

function AppSidebar({ mobileOpen, onNavigate }) {
  const { user } = useAuth()
  const role = user.role
  const navigation = ROLE_NAVIGATION[role]

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onNavigate}
          type="button"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-neutral-200 bg-[#f7f7f8] p-3 transition-transform md:static md:z-auto md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <NavLink
          aria-label="SmartDesk home"
          className="mb-5 flex h-11 items-center gap-2.5 rounded-xl px-2 text-foreground"
          onClick={onNavigate}
          to={navigation.homePath}
        >
          <span className="grid size-8 place-items-center rounded-lg bg-neutral-900 text-white">
            <Headset size={17} strokeWidth={2.2} />
          </span>
          <span className="font-semibold tracking-tight">SmartDesk</span>
        </NavLink>

        <p className="mb-2 px-2 text-xs font-medium text-neutral-500">{navigation.label} workspace</p>
        <nav aria-label="Main navigation" className="space-y-1">
          {navigation.links.map(({ label, path, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                `flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition ${
                  isActive
                    ? 'bg-neutral-200/80 font-medium text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900'
                }`
              }
              end={path === navigation.homePath}
              key={path}
              onClick={onNavigate}
              to={path}
            >
              <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

      </aside>
    </>
  )
}

export default AppSidebar
