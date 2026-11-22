import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'

// uses error and message state to display feedback to the user after form submission
export default function LoginPage() {
    // useAuth reads the login function from AuthProvider.
    const { login } = useAuth()
    const navigate = useNavigate()

    // Store the text entered into the form fields.
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Store feedback displayed after submission.
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const submit = (event) => {
        // Prevent the browser from refreshing the page.
        event.preventDefault()
        setError('')
        setMessage('')

        if (!email || !password) {
            setError('Enter both email and password.')
            return
        }

        if (password.length < 6) {
            setError('Password must contain at least 6 characters.')
            return
        }

        // try/catch converts authentication errors into visible feedback.
        try {
            login(email, password)
            setMessage('Login successful.')
            navigate('/')
        } catch (loginError) {
            setError(loginError.message)
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

                <button type="submit">Sign in</button>
            </form>
        </main>
    )
}