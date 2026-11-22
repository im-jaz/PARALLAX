import { createContext } from 'react'

// creates shared authentication state / shared container
// Components will not receive authentication state until a provider uses this context.
export const AuthContext = createContext(null)