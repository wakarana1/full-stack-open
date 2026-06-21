import { useAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const actions = useAnecdoteActions()

  const deletable = (anecdote) => {
    if (anecdote.votes === 0) {
      return (
        <button onClick={() => actions.remove(anecdote.id)}>delete</button>
      )
    }
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => actions.vote(anecdote.id)}>vote</button>
            {deletable(anecdote)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
