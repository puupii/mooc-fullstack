const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bloglistRouter = require('./controllers/blogs')

app.use(cors())
app.use(express.json())

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(() => {
    logger.info('connected to MongoDB')
  })

app.use('/api/blogs', bloglistRouter)

module.exports = app
