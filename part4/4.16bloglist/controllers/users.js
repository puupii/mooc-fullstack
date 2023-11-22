
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password are required'
    })
  } else if (username.toString().length < 3 || password.toString().length < 3) {
    return response.status(400).json({
      error: 'username and password must be at least 3 characters long'
    })
  } else {
    const saltRounds = 11
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const userObject = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await userObject.save()

    response.status(201).json(savedUser)
  }
})

usersRouter.get('/', async (request, response) => {
  const userList = await User.find({})
  response.json(userList)
})


module.exports = usersRouter
