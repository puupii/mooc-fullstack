import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', 
      number: '050123456' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
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

  return (
    <div>
      <h2>Phonebook</h2>
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
    {persons.map(person =>
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
