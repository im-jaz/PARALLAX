import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { firebaseApp, firebaseConfigured } from '../services/firebase'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  // Restore demo authentication if Firebase is not configured.
  const [user, setUser] = useState(() =>
    firebaseConfigured
      ? null
      : JSON.parse(localStorage.getItem('parallax-user') || 'null'),
  )

  const [loading, setLoading] = useState(firebaseConfigured)

  // Listen for Firebase authentication changes.
  useEffect(() => {
    if (!firebaseConfigured) return

    const auth = getAuth(firebaseApp)

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(
        firebaseUser
          ? {
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                'User',
              email: firebaseUser.email,
              provider: 'firebase',
            }
          : null,
      )

      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Email/password login.
  const login = async (email, password) => {
    if (!email || password.length < 6) {
      throw new Error(
        'Enter a valid email and a password of at least 6 characters.',
      )
    }

    if (firebaseConfigured) {
      await signInWithEmailAndPassword(
        getAuth(firebaseApp),
        email,
        password,
      )
      return
    }

    const authenticatedUser = {
      name: email.split('@')[0],
      email,
      provider: 'local',
    }

    localStorage.setItem(
      'parallax-user',
      JSON.stringify(authenticatedUser),
    )

    setUser(authenticatedUser)
  }

  // Registration.
  const register = async (name, email, password) => {
    if (!name || !email || password.length < 6) {
      throw new Error(
        'Complete every field. Passwords need at least 6 characters.',
      )
    }

    if (firebaseConfigured) {
      const auth = getAuth(firebaseApp)
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )

      await updateProfile(credential.user, {
        displayName: name,
      })

      return
    }

    const authenticatedUser = {
      name,
      email,
      provider: 'local',
    }

    localStorage.setItem(
      'parallax-user',
      JSON.stringify(authenticatedUser),
    )

    setUser(authenticatedUser)
  }

  // Google login.
  const loginWithGoogle = async () => {
    if (firebaseConfigured) {
      await signInWithPopup(
        getAuth(firebaseApp),
        new GoogleAuthProvider(),
      )
      return
    }

    const googleUser = {
      name: 'Google Planner',
      email: 'planner@gmail.com',
      provider: 'google-demo',
    }

    localStorage.setItem(
      'parallax-user',
      JSON.stringify(googleUser),
    )

    setUser(googleUser)
  }

  // Logout.
  const logout = async () => {
    if (firebaseConfigured) {
      await signOut(getAuth(firebaseApp))
      return
    }

    localStorage.removeItem('parallax-user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    firebaseConfigured,
    login,
    register,
    loginWithGoogle,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}