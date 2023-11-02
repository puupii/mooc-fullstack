const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blogs')

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('clearedDB')

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
  console.log('done')
}, 100000)

mongoose.set('bufferTimeoutMS', 30000)

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('found correct number of blogs in the database', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('unique identifier for a blog is called by id', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  expect(response.body[0].id).toBeDefined()
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})
