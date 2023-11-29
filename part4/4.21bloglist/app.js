const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const bloglistRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

var _ = require('lodash')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const mongoUrl = config.MONGODB_URI
async function connection(Url){
  try {
    await mongoose.connect(Url)
    logger.info('connected to MongoDB')
  } catch (err) {
    logger.error(err)
  }
}


mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

connection(mongoUrl)

app.use(middleware.extractToken)

app.use('/api/blogs', bloglistRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(middleware.requestLogger)


module.exports = app
