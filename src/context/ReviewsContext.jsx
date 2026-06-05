import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedReviews } from '../data/seedReviews'

const ReviewsContext = createContext(null)
const STORAGE_KEY = 'tenanttrails:reviews'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to seed
  }
  return seedReviews
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  }, [reviews])

  const addReview = useCallback(({ apartmentId, user, rating, text }) => {
    const review = {
      id: makeId('r'),
      apartmentId,
      userEmail: user.email,
      userName: user.name,
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      comments: [],
    }
    setReviews((prev) => [review, ...prev])
    return review
  }, [])

  const updateReview = useCallback((id, { rating, text }) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rating, text: text.trim() } : r))
    )
  }, [])

  const deleteReview = useCallback((id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const addComment = useCallback((reviewId, { user, text }) => {
    const comment = {
      id: makeId('c'),
      userEmail: user.email,
      userName: user.name,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, comments: [...r.comments, comment] } : r))
    )
    return comment
  }, [])

  const value = useMemo(
    () => ({ reviews, addReview, updateReview, deleteReview, addComment }),
    [reviews, addReview, updateReview, deleteReview, addComment]
  )

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider')
  return ctx
}

export function statsForApartment(reviews, apartmentId) {
  const list = reviews.filter((r) => r.apartmentId === apartmentId)
  if (list.length === 0) return { count: 0, avg: 0, breakdown: [0, 0, 0, 0, 0] }
  const sum = list.reduce((s, r) => s + r.rating, 0)
  const breakdown = [0, 0, 0, 0, 0]
  for (const r of list) breakdown[5 - r.rating]++
  return { count: list.length, avg: sum / list.length, breakdown }
}

export function userStats(reviews, email) {
  if (!email) return { reviews: 0, comments: 0 }
  let r = 0
  let c = 0
  for (const rev of reviews) {
    if (rev.userEmail === email) r++
    for (const com of rev.comments) if (com.userEmail === email) c++
  }
  return { reviews: r, comments: c }
}
