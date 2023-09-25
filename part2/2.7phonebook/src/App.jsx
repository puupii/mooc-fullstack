import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }
  
  function personAlreadyInPhonebook(newPerson){
    let bool = new Boolean(false);
      persons.forEach((person) => {
      if (JSON.stringify(person) === JSON.stringify(newPerson)) {
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
    }
    if (personAlreadyInPhonebook(personObject) === true){
      window.alert(`${personObject.name} already in phonebook`)
      setNewName('');
    } else {
    setPersons(persons.concat(personObject));
    setNewName('');
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
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
    <ul>
    {persons.map(person =>
      <Person key={person.name} name={person.name} />
    )}
    </ul>
    </div>
  )
}

const Person = ({name}) => {
  return (
    <li>
    {name}
    </li>
  )
}

export default App
