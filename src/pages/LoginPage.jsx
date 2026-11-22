import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (authError) {
      setError(
        authError.code?.startsWith('auth/')
          ? authError.code.replace('auth/', '').replaceAll('-', ' ')
          : authError.message,
      )
    } finally {
      setSubmitting(false)
    }
  }

  const google = async () => {
    setError('')
    setSubmitting(true)

    try {
      await loginWithGoogle()
      navigate('/')
    } catch (authError) {
      setError(authError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={submit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Please wait…' : 'Sign in'}
        </button>

        <button type="button" onClick={google} disabled={submitting}>
          Continue with Google
        </button>
      </form>
    </main>
  )
}