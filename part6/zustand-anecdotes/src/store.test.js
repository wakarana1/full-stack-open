import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
  },
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore from './store'
import { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('anecdote store', () => {
  it('initializes with anecdotes returned by the backend', async () => {
    const anecdotes = [
      { id: '1', content: 'If it hurts, do it more often', votes: 0 },
      { id: '2', content: 'Adding manpower to a late software project makes it later', votes: 3 },
    ]
    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(expect.arrayContaining(anecdotes))
    expect(anecdotesResult.current).toHaveLength(anecdotes.length)
  })

  it('filters anecdotes by content', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: '1', content: 'If it hurts, do it more often', votes: 0 },
        { id: '2', content: 'Adding manpower to a late software project makes it later', votes: 3 },
      ],
      filter: 'manpower',
    })

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].content).toBe('Adding manpower to a late software project makes it later')
  })

  it('voting increases the vote count of an anecdote', async () => {
    useAnecdoteStore.setState({
      anecdotes: [{ id: '1', content: 'test anecdote', votes: 0 }],
    })
    anecdoteService.update.mockResolvedValue({ id: '1', content: 'test anecdote', votes: 1 })

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.vote('1')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
  })
})
