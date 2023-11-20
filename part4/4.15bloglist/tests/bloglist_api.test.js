const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blogs')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
  for (let user of helper.initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }
}, 15000)

mongoose.set('bufferTimeoutMS', 40000)

const api = supertest(app)

describe('connection and formatting', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 15000)

  test('found correct number of blogs in the database', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 15000)

  test('unique identifier for a blog is called id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  }, 15000)
})
describe('fetching a specific blog by id', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0].toJSON()

    const response = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const resultBlog = response.body

    expect(resultBlog).toEqual(blogToView)

  })

  test('fails with statuscode 404 if blog with given id does not exist', async () => {
    const nonExistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${nonExistingId}`)
      .expect(404)
  })
})

describe('saving to the database', () => {
  test('saving a new blog succesfull', async () => {
    const newBlog = {
      title: 'Cute cats and computers',
      author: 'Sipi',
      url: 'http://www.github.com/puupii',
      likes: 10000,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterSaving = await helper.blogsInDb()
    const titles = blogsAfterSaving.map(b => b.title)
    const authors = blogsAfterSaving.map(b => b.author)

    expect(blogsAfterSaving).toHaveLength(helper.initialBlogs.length +1)
    expect(authors).toContain('Sipi')
    expect(titles).toContain('Cute cats and computers')

  }, 15000)

  test('saving a blog without author returns 400', async () => {
    const newBlog = {
      title: 'Sipin perunat',
      url: 'http://www.github.com/puupii',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 15000)

  test('saving a blog without url returns 400', async () => {
    const newBlog = {
      title: 'Sipin suolaset pihvit',
      author: 'Sipi',
      likes: 11000,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 15000)

  test('saving a blog without title returns 400', async () => {
    const newBlog = {
      author: 'Sipi',
      url: 'http://www.github.com/puupii',
      likes: 10000,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)

  }, 15000)

  test('saving a blog without likes defaults to 0 likes', async() => {
    const newBlog = {
      title: 'Cute cats and computers',
      author: 'Sipi',
      url: 'http://www.github.com/puupii',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterSaving = await helper.blogsInDb()
    const blogsWithSipi = await helper.findBlog({ author: 'Sipi' })

    expect(blogsAfterSaving).toHaveLength(helper.initialBlogs.length +1)
    expect(blogsWithSipi[0].likes).toBe(0)
  })
})

describe('deleting blogs from database', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogToDelete = initialBlogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfterDeleting = await helper.blogsInDb()

    expect(blogsAfterDeleting).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAfterDeleting.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 404 if id is invalid', async () => {
    const idToDelete = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .expect(404)

    const blogsAfterDeleting = await helper.blogsInDb()

    expect(blogsAfterDeleting).toHaveLength(helper.initialBlogs.length)

  })
})

describe('updating an existing blog', () => {

  test('succssfully updated the author of a blog', async () => {
    const initialBlogs = await helper.blogsInDb()
    let blogToUpdate = initialBlogs[0].toJSON()
    blogToUpdate.author = 'New Author'

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAfterUpdate = await Blog.findById(blogToUpdate.id)

    expect(blogAfterUpdate.author).toEqual(blogToUpdate.author)
  })

  test('succssfully updated the title of a blog', async () => {
    const initialBlogs = await helper.blogsInDb()
    let blogToUpdate = initialBlogs[0].toJSON()
    blogToUpdate.title = 'New Title'

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAfterUpdate = await Blog.findById(blogToUpdate.id)

    expect(blogAfterUpdate.title).toEqual(blogToUpdate.title)
  })

  test('succssfully updated the likes of a blog', async () => {
    const initialBlogs = await helper.blogsInDb()
    let blogToUpdate = initialBlogs[0].toJSON()
    blogToUpdate.likes += 11

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAfterUpdate = await Blog.findById(blogToUpdate.id)

    expect(blogAfterUpdate.likes).toEqual(blogToUpdate.likes)
  })
})

describe('adding users', () => {
  test('adding a user to database via POST to /api/users', async () => {
    const initialUsers = helper.initialUsers

    const newUser = {
      username: 'newRopo',
      name: 'realerRopo',
      password: 'password123'
    }

    const postResponse = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const addedUser = postResponse.body

    const getResponse = await api
      .get('/api/users')
      .expect(200)

    const listOfUsers = getResponse.body
    expect(listOfUsers.length).toEqual(initialUsers.length +1)
    expect(addedUser.username).toEqual(newUser.username)
    expect(addedUser.name).toEqual(newUser.name)
    //password should not be in the response
    expect(addedUser.password).not.toEqual(newUser.password)
  })
})

describe('getting users', () => {
  test('GET-request to /api/users/ returns list of users', async () => {
    const intialUsers = helper.initialUsers

    const response = await api
      .get('/api/users')
      .expect(200)

    const listOfUsers = response.body

    expect(listOfUsers.length).toEqual(intialUsers.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
