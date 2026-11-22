import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function RegisterPage() {
  // Controlled form state.
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    // Temporary local registration validation.
    if (!name || !email || password.length < 6) {
      setError('Complete every field. Passwords need at least 6 characters.')
      return
    }

    try {
      register(name, email, password)
      setMessage('Registration successful.')
      navigate('/')
    } catch (registrationError) {
      setError(registrationError.message)
    }
  }

  return (
    <main>
      <h1>Register</h1>

      <form onSubmit={submit}>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}

        <button type="submit">Create account</button>
      </form>
    </main>
  )
}