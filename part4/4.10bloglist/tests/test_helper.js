const Blog = require('../models/blogs')
const initialBlogs = require('./many_blogs')

const nonExistingId = async() => {
  const blog = new Blog({
    title: 'non-existing title',
    author: 'non-existing author',
  })
  await blog.save()
  await blog.deleteOne()

  return blog.id.toString()
}

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
