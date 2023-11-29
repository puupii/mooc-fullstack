const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blogs')
const User = require('../models/user')

const api = supertest(app)
mongoose.set('bufferTimeoutMS', 40000)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    blogObject.user = (await helper.usersInDb())[0].id
    await blogObject.save()
  }
}, 15000)

describe('adding users', () => {
  test('adding a user to database via POST to /api/users', async () => {
    const newUser = {
      username: 'newRopo',
      name: 'realerRopo',
      password: 'password123'
    }

    const postResponse = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const addedUser = postResponse.body
    const usersAfter = await helper.usersInDb()

    expect(usersAfter.length).toEqual(helper.initialUsers.length + 1)
    expect(addedUser.username).toEqual(newUser.username)
    expect(addedUser.name).toEqual(newUser.name)
    //password should not be in the response
    expect(addedUser.password).not.toEqual(newUser.password)
  })

  test('not accepting password that is less than 3 characters', async () => {
    const invalidUser = {
      username: 'roppana',
      name: 'shouldnotbeadded',
      password: 'pa'
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).not.toContainEqual(invalidUser)
  })

  test('not accepting username that is less than 3 characters', async () => {
    const invalidUser = {
      username: 'ro',
      name: 'shouldnotbeadded',
      password: 'password123'
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).not.toContainEqual(invalidUser)
  })
})

describe('getting users', () => {
  test('GET-request to /api/users/ returns list of users', async () => {
    const intialUsers = helper.initialUsers

    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const listOfUsers = response.body

    expect(listOfUsers.length).toEqual(intialUsers.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
