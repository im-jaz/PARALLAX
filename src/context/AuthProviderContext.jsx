import { useState } from 'react'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  // null means no user is currently authenticated
  //  user stores current users function
 //  setUser updates user info
  const [user, setUser] = useState(null)

  // Provider values become available to every nested component.
  const value = { user, setUser }

//   makes user and setuser available to other components inside Authprovider
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}