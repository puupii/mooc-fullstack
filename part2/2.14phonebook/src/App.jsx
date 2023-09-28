import { useEffect, useState } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showPersons, setShowPersons] = useState(persons)

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

  function personAlreadyInPhonebook(newPerson){
    let bool = new Boolean(false);
      persons.forEach((person) => {
      if (JSON.stringify(person.name) === JSON.stringify(newPerson.name)) {
        bool = true;
      } 
    }
      )
    console.log(bool);
    return (bool); 
  }

  const deleteName = (name, id) => {
    console.log('id', id);
    console.log('name ', name);
    if (window.confirm(`Delete ${name}?`)) {
      personService.deletename(id)
        .then(persons => {
          console.log('persons set')
          console.log(persons)
          setPersons(persons)
          setShowPersons(persons);
    });
    };
  };

  const addName = (event) => {
    event.preventDefault();
    console.log('add button pressed');
    const personObject = {
      name: newName, 
      number: newNumber
    }
    if (personAlreadyInPhonebook(personObject) === true){
      window.alert(`${personObject.name} already in phonebook`)
      setNewName('');
      setNewNumber('');
    } else {
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
          setShowPersons(persons.concat(response.data));
        })
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
      <h2>Phonebook</h2>
    <Filter 
    newfilter={newFilter} 
    handlefilterchange={handleFilterChange} 
    />
      <h1>add new</h1>
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


export default App
