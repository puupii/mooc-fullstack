const bloglistRouter = require('express').Router()
const Blog = require('../models/blogs')


bloglistRouter.get('/',async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

bloglistRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

bloglistRouter.post('/',async (request, response) => {
  const body = request.body

  if (!body.title || !body.author || !body.url) {
    return response.status(400).json({
      error: 'blog has no author, title or url'
    })
  }

  if(!body.likes) {

    body['likes'] = 0

    let blog = new Blog(body)
    const result = await blog.save()
    response.status(201).json(result)

  } else {

    let blog = new Blog(body)
    const result = await blog.save()
    response.status(201).json(result)
  }
})

bloglistRouter.delete('/:id',async (request, response) => {
  const idToRemove = request.params.id.toString()
  if (await Blog.findByIdAndRemove(idToRemove)) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

bloglistRouter.put('/:id',async (request, response) => {
  const body = request.body
  const idToUpdate = request.params.id.toString()
  const blogObject = {
    ...body
  }
  const result = await Blog.findByIdAndUpdate(idToUpdate, blogObject, { returnDocument: 'after' })
  response.status(201).json(result)
})

module.exports = bloglistRouter
