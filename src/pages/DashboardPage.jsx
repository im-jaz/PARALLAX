import { useAuth } from '../context/useAuth'

export default function DashboardPage() {
  const { logout } = useAuth()

  return (
    <main>
      <h1>Dashboard</h1>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </main>
  )
}