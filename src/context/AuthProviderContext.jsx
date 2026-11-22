import { useState } from 'react'
import { AuthContext } from './authContext'

// This provider stores the signed-in user for every route.
export function AuthProvider({ children }) {
  // Read the saved user when the application starts.
  const [user, setUser] = useState(() => {
    // localStorage retains data after refresh.
    const savedUser = localStorage.getItem('parallax-user')

    // JSON.parse converts saved text back into an object.
    return savedUser ? JSON.parse(savedUser) : null
  })

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

    const authenticatedUser = {
      name: email.split('@')[0],
      email,
      provider: 'local',
    }

    // Save the user after login.
    localStorage.setItem(
      'parallax-user',
      // JSON.stringify converts a user object into text.
      JSON.stringify(authenticatedUser)
    )

    setUser(authenticatedUser)
  }

  // Remove the currently signed-in user.
  const logout = () => {
    setUser(null)
  }

  const register = (name, email, password) => {
    if (!name || !email || password.length < 6) {
      throw new Error('Complete every field.')
    }

    // Create and save the authenticated user.
    const newUser = { name, email, provider: 'local' }
    localStorage.setItem('parallax-user', JSON.stringify(newUser))

    // This is the line that must update global authentication.
    setUser(newUser)
  }

  const value = {
    user,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}