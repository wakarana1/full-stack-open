import { useState } from 'react'
import Filter from './components/Filter'
import NewContact from './components/NewContact'
import Notification from './components/Notification'
import Persons from './components/Persons';
import personServices from './services/persons';
import { useEffect } from 'react';

const App = () => {
  const [people, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personServices
      .getAll()
      .then((response) => {
        setPersons(response)
      })
  }, [])

  const hasNameMatch = (newName) => {
    return people.find((person) => {
      return person.name.toLowerCase() === newName.toLowerCase()
    })
  }

  const showMessage = (type, message) => {
    setMessage({type: type, message: message})
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addOrUpdatePerson = (event) => {
    event.preventDefault();
    const matchedPerson = hasNameMatch(newName)
    if (matchedPerson) {
      if (window.confirm(`${newName} is already added to phonebook. Update number?`)) {
        personServices.updatePerson(matchedPerson.id, { name: newName, number: newNumber })
        .then((response) => {
          setPersons(people.map(person => person.id === response.id ? response : person))
        })
        showMessage('success', `${newName} updated`)
      }
    } else {
      personServices.create({ name: newName, number: newNumber })
      .then((response) => {
        setPersons(people.concat(response))
      })
      showMessage('success', `${newName} added to phonebook`)
    }
    setNewName('');
    setNewNumber('')
  }

  const deletePerson = (id) => {
    const deletedPersonName = people.find(person => person.id === id).name

    personServices
      .deletePerson(id).then(() => {
        setPersons(people.filter(person => person.id !== id))
        showMessage('success', `${deletedPersonName} deleted`)
      })
      .catch(() => {
        showMessage('error', `Information of ${deletedPersonName} has already been removed from server`)
      })
  }

  const filteredPersons = filterName === '' ? people : people.filter((person) => person.name.toLowerCase().includes(filterName.toLowerCase()))

  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  return (
    <div>
      <Notification message={message} />
      <h2>Phonebook</h2>
        <Filter filterName={filterName} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <NewContact
        newName={newName}
        newNumber={newNumber}
        addOrUpdatePerson={addOrUpdatePerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App