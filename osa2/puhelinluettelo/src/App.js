import { useState, useEffect } from 'react'

import personService from './services/personService'
import Notification from './components/notification'

const DeletePersonButton = (props) => {
  return (
    <>
      <button onClick={() => props.deletePerson(props.person)}>
        delete
      </button>
    </>
  )
}

const PhonebookRow = ({ person, deletePerson }) => {
  return (
    <p>
      {person.name} {person.number} <DeletePersonButton
                                      person={person}
                                      deletePerson={deletePerson} 
                                    />
    </p>
  )
}

const PhonebookView = (props) => {
  /* Filter's display logic via nameFilter state and .filter() method.
   Logically a part of filter rather than the renderer but having this in 
   filter module instead would require otherwise superflous state tracking array
   created by the code below saved in the root component. Refactoring in the future
   may be necessary should anything else want to access this. Should be "returned where it
   belongs" and turned into a prop in such case. */
  const personsToShow = props.persons.filter(person => 
    person.name.toLowerCase().includes(props.nameFilter.toLowerCase())
  )

  return (
    <div>
      {personsToShow.map(person => 
        <PhonebookRow 
          key={person.id} 
          person={person}
          deletePerson={props.deletePerson} 
        />
      )}
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}> 
      <div>
        name: <input
                value={props.newName}  
                onChange={props.handleNameChange}
              />
      </div>
      <div>
        number: <input
                  value={props.newNumber}  
                  onChange={props.handleNumberChange}
                />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input
                          value={props.nameFilter}  
                          onChange={props.handleFilterChange}
                        />
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('error')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const delayedMessage = (msg, msgType) => {
    setMessageType(msgType)
    setMessage(msg)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const indexMatch = persons.findIndex(person => person.name === newName)

    if (indexMatch !== -1) {
      if (window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
        )) {
          const personObject = {
            name: newName,
            number: newNumber,
            id: persons[indexMatch].id
          }

          personService
            .update(personObject)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== personObject.id ? person : returnedPerson))
              delayedMessage(`Updated ${returnedPerson.name}`, 'confirm')
            })
            .catch(error => {
              delayedMessage(`${persons[indexMatch].name} has already been removed from the server`, 'error')
              setPersons(persons.filter(p => p.id !== personObject.id))
            })
        }
      setNewName('')
      setNewNumber('')
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        delayedMessage(`Added ${returnedPerson.name}`, 'confirm')
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== person.id))
          delayedMessage(`Deleted ${person.name}`, 'confirm')
        })
        .catch(error => {
          delayedMessage(`${person.name} has already been removed from the server`, 'error')
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType} />
      <Filter nameFilter={nameFilter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber} 
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        setMessage={setMessage}
        setMessageType={setMessageType}
      />
      <h3>Numbers</h3>
      <PhonebookView 
        nameFilter={nameFilter} 
        persons={persons}
        deletePerson={deletePerson} 
      />
    </div>
  )
}

export default App
