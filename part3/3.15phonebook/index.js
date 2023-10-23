
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

app.get('/', (request, response) => {
  response.send('<h1>Hello from backend!</h1>')
})

app.get('/api/persons', (request, response) => {
  console.log('hello');
  Person
    .find({})
    .then(result => {
      response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person
    .findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id.toString())
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body
  console.log(body.id);
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(body.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
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
