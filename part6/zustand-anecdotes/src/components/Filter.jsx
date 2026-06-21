import { useAnecdoteActions } from '../store'
const Filter = () => {
  const actions = useAnecdoteActions()

  const handleChange = (event) => {
    actions.setFilter(event.target.value)  
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter