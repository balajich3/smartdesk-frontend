import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.js'
import { ROLE_NAVIGATION } from './navigation.js'

function RequireRole({ allowedRole }) {
  const { user } = useAuth()

  if (user.role !== allowedRole) {
    return <Navigate to={ROLE_NAVIGATION[user.role].homePath} replace />
  }

  return <Outlet />
}

export default RequireRole
