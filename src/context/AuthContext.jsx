import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'tenanttrails:user'
const USERS_KEY = 'tenanttrails:users'

const DEMO_USER = { name: 'Alex', email: 'alex@dal.ca', password: 'password123' }

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const list = raw ? JSON.parse(raw) : []
    if (!list.find((u) => u.email === DEMO_USER.email)) list.push(DEMO_USER)
    return list
  } catch {
    return [DEMO_USER]
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  function signIn(email, password) {
    const users = loadUsers()
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!match) return { ok: false, error: 'Invalid email or password.' }
    setUser({ name: match.name, email: match.email })
    return { ok: true }
  }

  function signUp({ name, email, password }) {
    const users = loadUsers()
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const next = [...users, { name, email, password }]
    localStorage.setItem(USERS_KEY, JSON.stringify(next))
    setUser({ name, email })
    return { ok: true }
  }

  function signOut() {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
