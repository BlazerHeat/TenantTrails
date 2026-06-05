import { describe, it, expect } from 'vitest'
import { validateSignIn, validateSignUp, validateReview } from '../utils/validation'

describe('validateSignIn', () => {
  it('flags missing email and password', () => {
    const errors = validateSignIn({ email: '', password: '' })
    expect(errors.email).toBe('Email is required.')
    expect(errors.password).toBe('Password is required.')
  })

  it('rejects malformed emails', () => {
    expect(validateSignIn({ email: 'not-an-email', password: 'x' }).email)
      .toBe('Enter a valid email address.')
  })

  it('returns no errors for valid input', () => {
    expect(validateSignIn({ email: 'a@b.co', password: 'x' })).toEqual({})
  })
})

describe('validateSignUp', () => {
  it('requires all four fields', () => {
    const errors = validateSignUp({ name: '', email: '', password: '', confirm: '' })
    expect(Object.keys(errors).sort()).toEqual(['confirm', 'email', 'name', 'password'])
  })

  it('enforces 6-char password minimum', () => {
    const errors = validateSignUp({ name: 'A', email: 'a@b.co', password: '123', confirm: '123' })
    expect(errors.password).toBe('Password must be at least 6 characters.')
  })

  it('catches password / confirm mismatch', () => {
    const errors = validateSignUp({ name: 'A', email: 'a@b.co', password: 'abcdef', confirm: 'abcdeg' })
    expect(errors.confirm).toBe('Passwords do not match.')
  })

  it('passes a fully-valid form', () => {
    expect(validateSignUp({ name: 'Alex', email: 'a@b.co', password: 'abcdef', confirm: 'abcdef' }))
      .toEqual({})
  })
})

describe('validateReview', () => {
  it('requires a rating between 1 and 5', () => {
    expect(validateReview({ rating: 0, text: 'long enough text' }).rating)
      .toBe('Please choose a rating.')
  })

  it('rejects short text', () => {
    expect(validateReview({ rating: 4, text: 'too short' }).text)
      .toBe('Review must be at least 10 characters.')
  })

  it('accepts a complete review', () => {
    expect(validateReview({ rating: 4, text: 'A long enough review.' })).toEqual({})
  })
})
