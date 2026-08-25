import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'
import { AnecdoteContext } from '../hooks'

const AnecdoteProvider = ({ children }) => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = async (anecdote) => {
    const created = await anecdoteService.createNew(anecdote)
    setAnecdotes(anecdotes => anecdotes.concat(created))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteAnecdote(id)
    setAnecdotes(anecdotes => anecdotes.filter(a => a.id !== id))
  }

  return (
    <AnecdoteContext.Provider value={{ anecdotes, addAnecdote, deleteAnecdote }}>
      {children}
    </AnecdoteContext.Provider>
  )
}

export default AnecdoteProvider
