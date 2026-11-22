import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Firebase is checking the current session.
  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <p>Loading workspace…</p>
      </main>
    )
  }

  // No authenticated user means redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // A authenticated user can view the protected component.
  return children
}