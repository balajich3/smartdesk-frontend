import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../../features/auth/useAuth.js'
import { ROLE_NAVIGATION } from '../../routes/navigation.js'

function getInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('')
}

function ProfileMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false)
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  function handleLogout() {
    signOut()
    setOpen(false)
    toast.success('You have logged out.')
    navigate('/', { replace: true })
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl p-1.5 text-left hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-200 text-[11px] font-semibold text-neutral-700">
          {getInitials(user.name)}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-36 truncate text-xs font-medium text-neutral-800">{user.name}</span>
          <span className="block text-[10px] text-neutral-500">{ROLE_NAVIGATION[user.role].label}</span>
        </span>
        <ChevronDown aria-hidden="true" className="hidden text-neutral-400 sm:block" size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/10" role="menu">
          <div className="border-b border-neutral-100 p-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
                {getInitials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900">{user.name}</p>
                <p className="truncate text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>
            <p className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
              Role <span className="float-right font-medium text-neutral-900">{ROLE_NAVIGATION[user.role].label}</span>
            </p>
            {user.department && (
              <p className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                Department <span className="float-right font-medium text-neutral-900">{user.department}</span>
              </p>
            )}
          </div>
          <div className="p-2">
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100" onClick={handleLogout} role="menuitem" type="button">
              <LogOut aria-hidden="true" size={16} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
