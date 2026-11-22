import { useContext } from 'react'
import { AuthContext } from './authContext'

//  custom hook that retreives user information from AuthContext and allows other componenets to call useAuth 
// to access that information
export function useAuth() {
  return useContext(AuthContext)
}