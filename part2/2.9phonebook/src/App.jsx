import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showPersons, setShowPersons] = useState([])

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

  function personAlreadyInPhonebook(newPerson){
    let bool = new Boolean(false);
      persons.forEach((person) => {
      if (JSON.stringify(person.name) === JSON.stringify(newPerson.name)) {
        console.log('haloo');
        bool = true;
      } 
    }
      )
    console.log(bool);
    return (bool); 
  }

  const addName = (event) => {
    event.preventDefault();
    console.log('button pressed');
    const personObject = {
      name: newName, 
      number: newNumber
    }
    if (personAlreadyInPhonebook(personObject) === true){
      window.alert(`${personObject.name} already in phonebook`)
      setNewName('');
      setNewNumber('');
    } else {
    setPersons(persons.concat(personObject));
    setNewName('');
    setNewNumber('');
    }
  }
  
  const personsToShow = (newFilter) => {

    setShowPersons(persons.filter(function (person){
      return (
        person.name.toUpperCase().includes(newFilter.toUpperCase()));
      }
      )
      )
    console.log(showPersons);
  }
  
    

  return (
    <div>
      <h2>Phonebook</h2>
    <div>
    filter phonebook <input value={newFilter} onChange={handleFilterChange} />
    </div>
      <h1>add new</h1>
      <form onSubmit={addName}>
        <div>
          name: <input 
                value={newName} 
                onChange={handleChange} />
        </div>
        <div>
          number: <input 
          value= {newNumber}
          onChange= {handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
    <ul>
    {showPersons.map(person =>
      <Person key={person.name} name={person.name} number={person.number}/>
    )}
    </ul>
    </div>
  )
}

const Person = ({name, number}) => {
  return (
    <li>
    {name}, {number}
    </li>
  )
}


export default App
