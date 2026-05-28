import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignIn() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  if (user) return <Navigate to="/dashboard" replace />

  function validate() {
    const next = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!emailPattern.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    const res = signIn(email.trim(), password)
    if (!res.ok) {
      setFormError(res.error)
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-logo">TenantTrails</h1>
        <p className="auth-tagline">See what past tenants had to say, before you sign.</p>

        <label className="auth-label" htmlFor="signin-email">Email</label>
        <input
          id="signin-email"
          type="email"
          className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {errors.email && <span className="auth-error">{errors.email}</span>}

        <label className="auth-label" htmlFor="signin-password">Password</label>
        <input
          id="signin-password"
          type="password"
          className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {errors.password && <span className="auth-error">{errors.password}</span>}

        {formError && <div className="auth-form-error">{formError}</div>}

        <button type="submit" className="auth-submit">Sign In</button>

        <p className="auth-switch">
          Don&rsquo;t have an account? <Link to="/signup">Create one</Link>
        </p>

        <div className="auth-demo">
          Demo: <strong>alex@dal.ca</strong> / <strong>password123</strong>
        </div>
      </form>
    </div>
  )
}
