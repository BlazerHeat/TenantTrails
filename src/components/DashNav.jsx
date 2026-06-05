import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashNav({ query, onQueryChange }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const controlled = typeof onQueryChange === 'function'
  const [localQ, setLocalQ] = useState('')

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function handleSignOut() {
    signOut()
    navigate('/', { replace: true })
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (controlled) return
    navigate('/dashboard', { state: { q: localQ } })
  }

  return (
    <nav className="dash-nav">
      <Link to="/dashboard" className="dash-logo">TenantTrails</Link>
      <form className="dash-search" onSubmit={handleSearchSubmit}>
        <span className="dash-search-icon" aria-hidden>🔍</span>
        <input
          type="search"
          placeholder="Search apartments by address or neighbourhood..."
          value={controlled ? (query ?? '') : localQ}
          onChange={(e) => (controlled ? onQueryChange(e.target.value) : setLocalQ(e.target.value))}
        />
      </form>
      <div className="dash-user">
        <Link to="/profile" className="dash-user-link" title="View your profile">
          <span className="dash-avatar">{initials}</span>
          <span className="dash-username">{user.name.split(' ')[0]}</span>
        </Link>
        <button type="button" className="dash-signout" onClick={handleSignOut}>Sign out</button>
      </div>
    </nav>
  )
}
