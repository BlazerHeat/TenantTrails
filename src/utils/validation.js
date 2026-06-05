export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSignIn({ email, password }) {
  const errors = {}
  if (!email || !email.trim()) errors.email = 'Email is required.'
  else if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export function validateSignUp({ name, email, password, confirm }) {
  const errors = {}
  if (!name || !name.trim()) errors.name = 'Full name is required.'
  if (!email || !email.trim()) errors.email = 'Email is required.'
  else if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (!confirm) errors.confirm = 'Please confirm your password.'
  else if (confirm !== password) errors.confirm = 'Passwords do not match.'
  return errors
}

export function validateReview({ rating, text }) {
  const errors = {}
  if (!rating || rating < 1 || rating > 5) errors.rating = 'Please choose a rating.'
  if (!text || !text.trim()) errors.text = 'Please write a review.'
  else if (text.trim().length < 10) errors.text = 'Review must be at least 10 characters.'
  return errors
}
