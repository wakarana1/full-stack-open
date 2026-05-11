require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')
const errorHandler = require('./middleware/errorHandler')

morgan.token('data', function getParams(params) {
  return JSON.stringify(params.body)
})

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  Person.findById(id).then(person => {
    if(!person) {
      return response.status(404).end()
    }

    person.name = name
    person.number = number

    return person.save().then((updatedPerson) => {
      response.json(updatedPerson)
    })
  })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const currentDate = new Date()

  response.send(`
    <p>Phonebook has info for ${Person.length} people</p>
    <p>${currentDate}</p>
    `)
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if(person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      console.log('inside catch')
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    console.log(result)
    response.status(204).end()
  }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})