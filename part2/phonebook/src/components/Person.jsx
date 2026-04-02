import personServices from '../services/persons'
import Notification from './Notification'

const Person = ({ person, deletePerson }) => {
  
  return (
    <div>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></div>
  )
}

export default Person