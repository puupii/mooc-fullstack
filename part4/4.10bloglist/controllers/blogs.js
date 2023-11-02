const bloglistRouter = require('express').Router()
const Blog = require('../models/blogs')


bloglistRouter.get('/',async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

bloglistRouter.post('/',async (request, response) => {

  if (!request.body.title || !request.body.author) {
    return response.status(400).json({
      error: 'blog has no author or title'
    })
  }

  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = bloglistRouter
