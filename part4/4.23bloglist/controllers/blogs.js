
const bloglistRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')

bloglistRouter.get('/',async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user',{ username: 1, name: 1 })
  response.json(blogs)
})

bloglistRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog
    .findById(id).populate('user',{ username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


bloglistRouter.post('/',async (request, response) => {
  const body = request.body
  const user = await User.findById(request.user)

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!body.title || !body.author || !body.url) {
    return response.status(400).json({
      error: 'blog has no author, title or url'
    })

  } else {
    const blog = new Blog({
      title: body.title,
      url: body.url,
      author: body.author,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

bloglistRouter.delete('/:id',async (request, response) => {
  const idToRemove = request.params.id.toString()
  const user = await User.findById(request.user)
  const blogToRemove = await Blog.findById(idToRemove)

  if (!blogToRemove) {
    response.status(404).end()
  }

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (blogToRemove.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'only user who created the blog can delete it' })
  }

  if (await Blog.findByIdAndRemove(idToRemove)) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

bloglistRouter.put('/:id',async (request, response) => {
  const body = request.body
  const idToUpdate = request.params.id.toString()
  const user = await User.findById(request.user)
  const blogToUpdate = await Blog.findById(idToUpdate)

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (blogToUpdate.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'only user who created the blog can update it' })
  }

  const blogObject = {
    id: body.id,
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
    user: user.id
  }
  const result = await Blog.findByIdAndUpdate(idToUpdate, blogObject, { returnDocument: 'after' })
  response.status(201).json(result)
})

module.exports = bloglistRouter
