
require('dotenv').config();
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/person')


app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', function getBody (req) {
  return (JSON.stringify(req.body))
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person
    .findById(id)
    .then(person => {
    response.json(person)
  })
})

app.get('/', (request, response) => {
  response.send('<h1>Hello from backend!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(result => {
      response.json(result)
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  if (personAlreadyInPhonebook(person)!='none'){
    return response.status(400).json({ 
      error: 'person already in phonebook' 
    })
  }
  else {
    person
      .save()
      .then(savedPerson => { 
      response.json(savedPerson)
      })
  }
})

function personAlreadyInPhonebook(newPerson){
  var id = 'none';
  Person
    .find({})
    .then(person => {
      if (JSON.stringify(person.name) === JSON.stringify(newPerson.name)) {
        id = person.id;
    } 
  })
  return (id); 
}

const PORT = process.env.PORT 
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
