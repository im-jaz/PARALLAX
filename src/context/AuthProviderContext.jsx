import { useState } from 'react'
import { AuthContext } from './authContext'

// This provider stores the signed-in user for every route.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Login receives credentials and updates global authentication state.
  const login = (email, password) => {
    // Guard against invalid values.
    if (!email || !password) {
      throw new Error('Enter both email and password.')
    }

    // Throwing an error lets the login page display feedback.
    if (password.length < 6) {
      throw new Error('Password must contain at least 6 characters.')
    }

    // Temporary local authentication.
    setUser({
      name: email.split('@')[0],
      email,
      provider: 'local',
    })
  }

  const value = {
    user,
    login,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}