const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bloglistRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
var _ = require('lodash')

app.use(cors())
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
connection(mongoUrl)

app.use('/api/blogs', bloglistRouter)

module.exports = app
