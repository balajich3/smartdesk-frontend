import { useState } from 'react'
import { AuthContext } from './authStore.js'
import { authenticate, clearSession, createDemoAccount, getSession } from './authService.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession)

  function signIn(email, password, role) {
    const authenticatedUser = authenticate(email, password, role)
    setUser(authenticatedUser)
    return authenticatedUser
  }

  function signUp(values) {
    const newUser = createDemoAccount(values)
    setUser(newUser)
    return newUser
  }

  function signOut() {
    clearSession()
    setUser(null)
  }

  const value = { user, signIn, signUp, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
