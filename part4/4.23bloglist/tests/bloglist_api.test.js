const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blogs')
const User = require('../models/user')
const api = supertest(app)
mongoose.set('bufferTimeoutMS', 40000)

let logintoken = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    const userId = (await helper.usersInDb())[0].id
    blogObject.user = userId
    await blogObject.save()
  }
  const response= await api
    .post('/api/login')
    .send({
      username: 'ropo',
      password: 'superSecretPassword'
    })
  logintoken = 'Bearer ' + response.body.token

}, 15000)

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
    delete blogToView.user[0].blogs

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
  test('saving a new blog without token returns 401', async () => {
    const userId = (await helper.usersInDb())[0].id
    const newBlog = {
      title: 'Cute cats and computers',
      author: 'Sipi',
      url: 'http://www.github.com/puupii',
      likes: 10000,
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAfterSaving = await helper.blogsInDb()
    const titles = blogsAfterSaving.map(b => b.title)
    const authors = blogsAfterSaving.map(b => b.author)

    expect(blogsAfterSaving).toHaveLength(helper.initialBlogs.length)
    expect(authors).not.toContain('Sipi')
    expect(titles).not.toContain('Cute cats and computers')

  }, 15000)

  test('saving a new blog succesfull', async () => {
    const userId = (await helper.usersInDb())[0].id
    const newBlog = {
      title: 'Cute cats and computers',
      author: 'Sipi',
      url: 'http://www.github.com/puupii',
      likes: 10000,
      userId: userId,
    }

    console.log(logintoken)
    await api
      .post('/api/blogs')
      .set('Authorization', logintoken)
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
    const userId = (await helper.usersInDb())[0].id
    const newBlog = {
      title: 'Sipin perunat',
      url: 'http://www.github.com/puupii',
      likes: 0,
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', logintoken)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 15000)

  test('saving a blog without url returns 400', async () => {
    const userId = (await helper.usersInDb())[0].id
    const newBlog = {
      title: 'Sipin suolaset pihvit',
      author: 'Sipi',
      likes: 11000,
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', logintoken)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 15000)

  test('saving a blog without title returns 400', async () => {
    const userId = (await helper.usersInDb())[0].id
    const newBlog = {
      author: 'Sipi',
      url: 'http://www.github.com/puupii',
      likes: 10000,
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', logintoken)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)

  }, 15000)

  test('saving a blog without likes defaults to 0 likes', async() => {
    const userId = (await helper.usersInDb())[0].id
    const newBlog = {
      title: 'Cute cats and computers',
      author: 'Sipi',
      url: 'http://www.github.com/puupii',
      userId: userId
    }

    await api
      .post('/api/blogs')
      .set('Authorization', logintoken)
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
      .set('Authorization', logintoken)
      .expect(204)

    const blogsAfterDeleting = await helper.blogsInDb()

    expect(blogsAfterDeleting).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAfterDeleting.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 401 if token is invalid', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogToDelete = initialBlogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAfterDeleting = await helper.blogsInDb()

    expect(blogsAfterDeleting).toHaveLength(helper.initialBlogs.length)

  })

  test('fails with status code 404 if id is invalid', async () => {
    const idToDelete = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', logintoken)
      .expect(404)

    const blogsAfterDeleting = await helper.blogsInDb()

    expect(blogsAfterDeleting).toHaveLength(helper.initialBlogs.length)

  })
})

describe('updating an existing blog', () => {

  test('succssfully updated the author of a blog', async () => {
    const initialBlogs = await helper.blogsInDb()
    let blogToUpdate = initialBlogs[0]
    blogToUpdate.author = 'New Author'
    blogToUpdate.userId = blogToUpdate.user.id
    delete blogToUpdate.user

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
    let blogToUpdate = initialBlogs[0]
    blogToUpdate.title = 'New Title'
    blogToUpdate.userId = blogToUpdate.user.id

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
    let blogToUpdate = initialBlogs[0]
    blogToUpdate.likes += 11
    blogToUpdate.userId = blogToUpdate.user.id

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAfterUpdate = await Blog.findById(blogToUpdate.id)

    expect(blogAfterUpdate.likes).toEqual(blogToUpdate.likes)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})
