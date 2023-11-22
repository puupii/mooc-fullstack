const Blog = require('../models/blogs')
const initialBlogs = require('./many_blogs')
const initialUsers = require('./many_users')
const User = require('../models/user')


const nonExistingId = async() => {
  const blog = new Blog({
    title: 'non-existing title',
    author: 'non-existing author',
    url: 'non-existing url',
  })
  await blog.save()
  await blog.deleteOne()

  return blog.id.toString()
}

const usersInDb = async() => {
  const users = await User.find({})
  return users
}

const findUser = async(filter) => {
  const users = await User.find(filter)
  return users
}

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs
}

const findBlog = async(filter) => {
  const blogs = await Blog.find(filter)
  return blogs
}

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  findBlog,
  usersInDb,
  findUser
}
