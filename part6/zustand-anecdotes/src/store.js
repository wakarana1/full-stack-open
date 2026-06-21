
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'
import useNotificationStore from './notificationStore'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    vote: async (id) => {
      const anecdote = useAnecdoteStore.getState().anecdotes.find((a) => a.id === id)
      const updated = await anecdoteService.update(id, { ...anecdote, votes: anecdote.votes + 1 })
      set((state) => ({
        anecdotes: state.anecdotes.map((a) => a.id === id ? updated : a),
      }))
      useNotificationStore.getState().actions.setNotification(`you voted for '${updated.content}'`)
    },
    addAnecdote: (anecdote) => set((state) => ({
      anecdotes: state.anecdotes.concat(anecdote),
    })),
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({ anecdotes: state.anecdotes.filter((anecdote) => anecdote.id !== id)}))
    },
    setFilter: (filter) => set({ filter }),
  },
}))

export default useAnecdoteStore
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  return anecdotes
    .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((a, b) => b.votes - a.votes)
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
