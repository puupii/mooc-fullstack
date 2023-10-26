
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/person')


app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', function getBody (req) {
  return (JSON.stringify(req.body))
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
  response.send('<h1>Hello from backend!</h1>')
})

app.get('/api/info', (request, response) => {
  Person
    .find({})
    .then(result => {
      const number = result.length
      const date = new Date()
      response.send(
        `<p>Phonebook has info for ${number} people </p> 
          <p> ${date} </p>`
      )
    })
})

app.get('/api/persons', (request, response) => {
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
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

  if (personAlreadyInPhonebook(person)!=='none'){
    return response.status(400).json({
      error: 'person already in phonebook'
    })
  } else {
    person
      .save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(request.params.id)
  const id = request.params.id.toString()
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      console.log('name is too short')
      next(error)
    })
})

function personAlreadyInPhonebook(newPerson){
  var id = 'none'
  Person
    .find({})
    .then(person => {
      if (JSON.stringify(person.name) === JSON.stringify(newPerson.name)) {
        id = person.id
      }
    })
  return (id)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
