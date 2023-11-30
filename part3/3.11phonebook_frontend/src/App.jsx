import { useEffect, useState } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showPersons, setShowPersons] = useState(persons)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService 
      .getAll()
      .then(initialPersons => {
        console.log('persons set')
        console.log(initialPersons)
        setPersons(initialPersons)
        setShowPersons(initialPersons)
      })
  }, []);

  console.log('render', persons.length, 'humans');

  const handleChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  const handleFilterChange = (event) => {
    console.log('filter', event.target.value);
    setNewFilter(event.target.value);
    personsToShow(event.target.value);
  }
  
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  }


  const deleteName = (name, id) => {
    console.log('id', id);
    console.log('name ', name);
    if (window.confirm(`Delete ${name}?`)) {
      personService.deletename(id)
        .then(persons => {
          console.log(persons)
          setPersons(persons)
          setShowPersons(persons);
          setErrorMessage(
            `Name '${name}' was removed from server`
          )        
          setTimeout(() => {          
            setErrorMessage(null)
          }, 5000)
    })
    }
  }
  
  function personAlreadyInPhonebook(newPerson){
    var id = 'none';
    persons.forEach((person) => {
      if (JSON.stringify(person.name) === JSON.stringify(newPerson.name)) {
        id = person.id;
      } 
    })
    return (id); 
  }

  const addName = (event) => {
    event.preventDefault();
    console.log('add button pressed');
    const personObject = {
      name: newName, 
      number: newNumber
    }
    let id  = (personAlreadyInPhonebook(personObject))
    console.log(id)
    if (id === 'none'){
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
          setShowPersons(persons.concat(response.data));
          setErrorMessage(
            `Name '${personObject.name}' was added`
          )        
          setTimeout(() => {          
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data.error);
          setErrorMessage(error.response.data.error.toString());
        
          setTimeout(() => {          
            setErrorMessage(null)
          }, 5000)
        })
    } else {
      if (window.confirm(
        `${personObject.name} already in phonebook. Replace old number with ${personObject.number}?`)) {
        personService
          .update(id, personObject)
          .then(response => {
            personService
            .getAll()
            .then(response => {
            console.log(response)
            setPersons(response);
            setNewName('');
            setNewNumber('');
            setShowPersons(response);
            setErrorMessage(
              `Number for  '${personObject.name}' was changed`
            )        
            setTimeout(() => {          
              setErrorMessage(null)
            }, 5000)
            })
            setPersons(persons.filter(n => n.id !==id))
            setShowPersons(persons.filter(n => n.id !==id))
          })
          .catch(error => {
            console.log(error.response.data.error);
            setErrorMessage(
              `Number must be at least 8 digits and format XXX-XXXXX` 
            );
            setTimeout(() => {          
              setErrorMessage(null)
            }, 5000)
            return
          })
      }
  }
}
  
  const personsToShow = (newFilter) => {
    setShowPersons(persons.filter(function (person){
      return (
        person.name.toUpperCase().includes(newFilter.toUpperCase()));
      }))
    console.log(showPersons);
  }
  

  return (
    <div>
      <h1>Phonebook</h1>
    <Notification message={errorMessage}/>
    <Filter 
    newfilter={newFilter} 
    handlefilterchange={handleFilterChange} 
    />
      <h2>add new</h2>
    <PersonForm 
    addname={addName} 
    newname={newName} 
    newnumber={newNumber} 
    handlechange={handleChange} 
    handlenumberchange={handleNumberChange} 
    />
      <h2>Numbers</h2>
    <Persons 
    persons={showPersons} 
    deletename={deleteName} />
    </div>
  )
}

const Filter = ({newfilter, handlefilterchange}) => {
return (
  <div>
  filter phonebook <input value={newfilter} onChange={handlefilterchange} />
  </div>
)
}

const PersonForm = ({addname, newname, newnumber, handlechange, handlenumberchange}) => {
return (
  <form onSubmit={addname}>
  <div>
  name: <input 
  value={newname} 
  onChange={handlechange} />
  </div>
  <div>
  number: <input 
  value= {newnumber}
  onChange= {handlenumberchange}/>
  </div>
  <div>
  <button type="submit">add</button>
  </div>
  </form>
)
}

const Persons = ({persons, deletename}) => {
  return (
    <ul>
    {persons.map(person =>
      <Person 
      key={person.id} 
      name={person.name} 
      number={person.number} 
      deletename={deletename} 
      id={person.id} />
    )}
    </ul>
  )}


const Person = ({name, number, deletename, id}) => {
  return (
    <li>
    {name}, {number} 
    <button 
    type="button" 
    onClick={() => {deletename(name, id)}}>
    delete
    </button>
    </li>
  )
}
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

export default App
