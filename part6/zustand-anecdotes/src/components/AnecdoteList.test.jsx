// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import useAnecdoteStore from '../store'
import AnecdoteList from './AnecdoteList'

const anecdotes = [
  { id: '1', content: 'low votes anecdote', votes: 1 },
  { id: '2', content: 'high votes anecdote', votes: 5 },
  { id: '3', content: 'mid votes anecdote', votes: 3 },
]

describe('AnecdoteList', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes, filter: '' })
    vi.clearAllMocks()
  })

  it('displays anecdotes sorted by votes descending', () => {
    render(<AnecdoteList />)

    const body = document.body.textContent
    expect(body.indexOf('high votes anecdote')).toBeLessThan(body.indexOf('mid votes anecdote'))
    expect(body.indexOf('mid votes anecdote')).toBeLessThan(body.indexOf('low votes anecdote'))
  })

  it('renders only anecdotes matching the store filter', () => {
    useAnecdoteStore.setState({ filter: 'mid' })

    render(<AnecdoteList />)

    const body = document.body.textContent
    expect(body).toContain('mid votes anecdote')
    expect(body).not.toContain('low votes anecdote')
    expect(body).not.toContain('high votes anecdote')
  })

})
