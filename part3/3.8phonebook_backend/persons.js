const http = require('http')
const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json());

morgan.token('body', function getBody (req) {
  return (JSON.stringify(req.body))
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const number = persons.length; 
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${number} people </p> 
     <p> ${date} </p>`
  )

})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const generateId = () => {
  const maxId = 10000
  const newId = Math.floor(Math.random() * maxId);
  return newId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  if (personAlreadyInPhonebook(person)!='none'){
    return response.status(400).json({ 
      error: 'person already in phonebook' 
    })
  }
  else{
    persons = persons.concat(person)
    response.json(person)
  }
})

function personAlreadyInPhonebook(newPerson){
  var id = 'none';
  persons.forEach((person) => {
    if (JSON.stringify(person.name) === JSON.stringify(newPerson.name)) {
      id = person.id;
    } 
  })
  return (id); 
}

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
