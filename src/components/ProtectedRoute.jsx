
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Redirect unauthenticated users away from protected pages.
export default function ProtectedRoute({ children }) {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}