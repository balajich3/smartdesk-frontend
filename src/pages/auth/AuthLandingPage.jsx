import { useState } from 'react'
import { BriefcaseBusiness, ChartNoAxesCombined, Headset, Shield } from 'lucide-react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth.js'
import AuthFormPage from './AuthFormPage.jsx'
import { ROLES } from '../../context/roles.js'
import { ROLE_NAVIGATION } from '../../routes/navigation.js'

const ROLE_OPTIONS = [
  { role: ROLES.EMPLOYEE, label: 'Employee', icon: BriefcaseBusiness },
  { role: ROLES.AGENT, label: 'Support Agent', icon: Headset },
  { role: ROLES.MANAGER, label: 'Manager', icon: ChartNoAxesCombined },
  { role: ROLES.ADMIN, label: 'Admin', icon: Shield },
]
const VALID_ROLES = Object.values(ROLES)

function AuthLandingPage({ initialMode = 'login' }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { role: routeRole } = useParams()
  const { user } = useAuth()
  const [role, setRole] = useState(VALID_ROLES.includes(routeRole) ? routeRole : ROLES.EMPLOYEE)
  const activeRole = VALID_ROLES.includes(routeRole) ? routeRole : role
  const mode = pathname.startsWith('/signup/') ? 'signup' : initialMode

  if (user) return <Navigate replace to={ROLE_NAVIGATION[user.role].homePath} />

  function selectRole(nextRole) {
    setRole(nextRole)
    navigate(authPath(mode, nextRole), { replace: true })
  }

  function selectMode(nextMode) {
    navigate(authPath(nextMode, activeRole), { replace: true })
  }

  return (
    <main className="grid min-h-svh place-items-center bg-[#f7f7f8] px-4 py-8 sm:px-8">
      <div className="w-full max-w-lg">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-neutral-900 text-white"><Headset size={18} /></span>
            <span className="text-base font-semibold tracking-tight text-neutral-900">SmartDesk</span>
          </div>
        </header>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div>
            <p className="text-sm font-medium text-neutral-500">Welcome to SmartDesk</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">Choose your workspace</h1>
          </div>

          <div aria-label="Choose account role" className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1 sm:grid-cols-4" role="tablist">
            {ROLE_OPTIONS.map(({ role: optionRole, label, icon: Icon }) => (
              <button
                aria-selected={role === optionRole}
                className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1.5 text-[11px] font-medium transition sm:gap-2 sm:px-3 sm:text-xs ${activeRole === optionRole ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}
                key={optionRole}
                onClick={() => selectRole(optionRole)}
                role="tab"
                type="button"
              >
                <Icon aria-hidden="true" size={15} /> {label}
              </button>
            ))}
          </div>

          <div aria-label="Choose login or signup" className="mt-5 grid grid-cols-2 border-b border-neutral-200" role="tablist">
            {[
              { value: 'login', label: 'Login' },
              { value: 'signup', label: 'Sign Up' },
            ].map((option) => (
              <button
                aria-selected={mode === option.value}
                className={`border-b-2 px-3 py-2.5 text-sm font-medium transition ${mode === option.value ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
                key={option.value}
                onClick={() => selectMode(option.value)}
                role="tab"
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="pt-5">
            <AuthFormPage key={`${activeRole}-${mode}`} mode={mode} role={activeRole} />
          </div>
        </section>

      </div>
    </main>
  )
}

function authPath(mode, role) {
  return `/${mode}/${role}`
}

export default AuthLandingPage
