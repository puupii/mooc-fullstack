const bloglistRouter = require('express').Router()
const Blog = require('../models/blogs')


bloglistRouter.get('/',async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
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
    console.log(body)

    let blog = new Blog(body)
    const result = await blog.save()
    response.status(201).json(result)

  } else {

    let blog = new Blog(body)
    const result = await blog.save()
    response.status(201).json(result)
  }
})

module.exports = bloglistRouter
