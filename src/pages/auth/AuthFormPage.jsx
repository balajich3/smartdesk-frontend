import { useState } from 'react'
import { LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../../features/auth/useAuth.js'
import { ROLE_NAVIGATION } from '../../routes/navigation.js'

function AuthFormPage({ role, mode }) {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const isSignup = mode === 'signup'
  const roleDetails = ROLE_NAVIGATION[role]

  function updateField(event) {
    setError('')
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      if (isSignup) {
        signUp({ ...form, role })
        toast.success('Account created. Welcome to SmartDesk!')
      } else {
        signIn(form.email, form.password, role)
        toast.success(`Welcome back to your ${roleDetails.label} workspace.`)
      }
      navigate(roleDetails.homePath, { replace: true })
    } catch (authError) {
      setError(authError.message)
      if (!isSignup) toast.error('Could not sign in with those details.')
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-neutral-500">{roleDetails.label} workspace</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
      <p className="mt-2 text-sm leading-5 text-neutral-500">
        {isSignup ? 'Create an account to get started.' : `Sign in to continue to your ${roleDetails.label.toLowerCase()} workspace.`}
      </p>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {isSignup && (
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-neutral-700">Full name</span>
            <span className="relative block">
              <UserRound aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input autoComplete="name" className="h-11 w-full rounded-lg border border-neutral-200 pl-10 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400" maxLength={80} name="name" onChange={updateField} placeholder="Your name" required value={form.name} />
            </span>
          </label>
        )}
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-neutral-700">Email address</span>
          <span className="relative block">
            <Mail aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input autoComplete="email" className="h-11 w-full rounded-lg border border-neutral-200 pl-10 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400" name="email" onChange={updateField} placeholder="you@example.com" required type="email" value={form.email} />
          </span>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-neutral-700">Password</span>
          <span className="relative block">
            <LockKeyhole aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input autoComplete={isSignup ? 'new-password' : 'current-password'} className="h-11 w-full rounded-lg border border-neutral-200 pl-10 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400" minLength={8} name="password" onChange={updateField} placeholder={isSignup ? 'At least 8 characters' : 'Your password'} required type="password" value={form.password} />
          </span>
        </label>

        {error && <p aria-live="polite" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <button className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-700" type="submit">
          {isSignup ? 'Create account' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default AuthFormPage
