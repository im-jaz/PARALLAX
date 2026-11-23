
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
          : authError.message
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
      setError(
        authError.code?.startsWith('auth/')
          ? authError.code.replace('auth/', '').replaceAll('-', ' ')
          : authError.message
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#edf1f3] lg:grid lg:grid-cols-[58%_42%]">

      {/* Left branding panel */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#111923] p-10 text-white lg:flex lg:flex-col lg:justify-between">

        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: '44px 44px'
          }}
        />

        <div className="absolute left-[18%] top-[23%] h-32 w-32 rounded-full border border-[#ed6a45]/30" />
        <div className="absolute left-[38%] top-[32%] h-[240px] w-[240px] rounded-full border border-white/10" />
        <div className="absolute bottom-[8%] right-[8%] h-44 w-44 rounded-full border border-[#58a6ba]/30" />

        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 800 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-50 590 C180 420 260 650 430 430 S650 260 850 320"
            fill="none"
            stroke="#58a6ba"
            strokeWidth="3"
            strokeDasharray="10 12"
          />
          <path
            d="M160 100 C260 260 140 430 360 760"
            fill="none"
            stroke="#ed6a45"
            strokeWidth="2"
            strokeDasharray="8 14"
          />
        </svg>

        <div className="relative z-10 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ed6a45] text-lg font-black">
            P
          </span>

          <div>
            <strong className="block text-sm tracking-[.22em]">
              PARALLAX
            </strong>
            <small className="text-[9px] uppercase tracking-[.28em] text-slate-500">
              Scenario systems
            </small>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[.3em] text-[#f4a56c]">
            Decision intelligence / 01
          </p>

          <h1 className="text-6xl font-black leading-[.98] tracking-[-.045em] text-white xl:text-7xl">
            Test the consequence.
          </h1>

          <p className="mt-7 max-w-md text-sm leading-7 text-slate-400">
            Build a model, change one variable, and inspect how a city
            responds before resources are committed.
          </p>
        </div>

        <div className="relative z-10 grid max-w-lg grid-cols-3 gap-3">
          <div className="border-l border-white/15 pl-3">
            <strong className="block text-lg">4</strong>
            <span className="text-[9px] uppercase tracking-[.18em] text-slate-500">
              City zones
            </span>
          </div>

          <div className="border-l border-white/15 pl-3">
            <strong className="block text-lg">Live</strong>
            <span className="text-[9px] uppercase tracking-[.18em] text-slate-500">
              Deterministic
            </span>
          </div>

          <div className="border-l border-white/15 pl-3">
            <strong className="block text-lg">One</strong>
            <span className="text-[9px] uppercase tracking-[.18em] text-slate-500">
              Shared model
            </span>
          </div>
        </div>
      </section>

      {/* Login form */}
      <section className="flex min-h-screen items-center justify-center p-5 sm:p-8">
        <form onSubmit={submit} className="w-full max-w-md">

          <div className="mb-8 lg:hidden">
            <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-[#ed6a45] text-lg font-black text-white">
              P
            </span>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[.24em] text-[#ed6a45]">
              PARALLAX / Scenario systems
            </p>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-slate-400">
            Secure workspace
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-[-.035em] text-slate-900">
            Continue the model.
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Sign in to access saved investigations.
          </p>

          <label className="mt-7 block text-xs font-bold text-slate-700">
            Email

            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="mt-4 block text-xs font-bold text-slate-700">
            Password

            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && (
            <p
              role="alert"
              className="mt-4 border-l-2 border-red-500 bg-red-50 px-3 py-2 text-xs capitalize text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-xl bg-[#111923] py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(17,25,35,.12)] transition hover:bg-[#263747] disabled:opacity-60"
          >
            {submitting ? 'Opening workspace…' : 'Enter workspace'}
          </button>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={google}
            className="w-full rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-[#ed6a45] hover:underline"
            >
              Create one
            </Link>
          </p>

        </form>
      </section>
    </main>
  )
}
