import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Stars from '../components/Stars'

describe('<Stars />', () => {
  it('renders 5 stars total', () => {
    render(<Stars rating={3} />)
    const filled = screen.getAllByTestId('star-filled')
    const empty = screen.getAllByTestId('star-empty')
    expect(filled.length + empty.length).toBe(5)
  })

  it('fills the rounded rating', () => {
    render(<Stars rating={3.7} />)
    expect(screen.getAllByTestId('star-filled')).toHaveLength(4)
    expect(screen.getAllByTestId('star-empty')).toHaveLength(1)
  })

  it('renders all empty for rating 0', () => {
    render(<Stars rating={0} />)
    expect(screen.queryAllByTestId('star-filled')).toHaveLength(0)
    expect(screen.getAllByTestId('star-empty')).toHaveLength(5)
  })

  it('exposes an accessible label', () => {
    render(<Stars rating={4} />)
    expect(screen.getByRole('img', { name: '4 out of 5' })).toBeInTheDocument()
  })
})
