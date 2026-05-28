import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignUp() {
  const { user, signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  if (user) return <Navigate to="/dashboard" replace />

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Full name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!emailPattern.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (!form.confirm) next.confirm = 'Please confirm your password.'
    else if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    const res = signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password })
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
        <p className="auth-tagline">Create your account to submit reviews and comments.</p>

        <label className="auth-label" htmlFor="signup-name">Full name</label>
        <input
          id="signup-name"
          type="text"
          className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
          placeholder="Your name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          autoComplete="name"
        />
        {errors.name && <span className="auth-error">{errors.name}</span>}

        <label className="auth-label" htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          autoComplete="email"
        />
        {errors.email && <span className="auth-error">{errors.email}</span>}

        <label className="auth-label" htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
          placeholder="At least 6 characters"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          autoComplete="new-password"
        />
        {errors.password && <span className="auth-error">{errors.password}</span>}

        <label className="auth-label" htmlFor="signup-confirm">Confirm password</label>
        <input
          id="signup-confirm"
          type="password"
          className={`auth-input ${errors.confirm ? 'auth-input-error' : ''}`}
          placeholder="Repeat password"
          value={form.confirm}
          onChange={(e) => update('confirm', e.target.value)}
          autoComplete="new-password"
        />
        {errors.confirm && <span className="auth-error">{errors.confirm}</span>}

        {formError && <div className="auth-form-error">{formError}</div>}

        <button type="submit" className="auth-submit">Create Account</button>

        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
