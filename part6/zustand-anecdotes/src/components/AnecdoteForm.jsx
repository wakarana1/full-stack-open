import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const addNote = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    await add(content)
    e.target.reset()
  }

  return (
    <div>
      <h2>create new anecdote</h2>
      <form onSubmit={addNote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
