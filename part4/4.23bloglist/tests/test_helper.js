
const initialBlogs = require('./many_blogs')
const initialUsers = require('./many_users')
const Blog = require('../models/blogs')
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
  const users = await User
    .find({}).populate('blogs')
  return users
}

const findUser = async(filter) => {
  const users = await User
    .find(filter).populate('blogs')
  return users
}

const blogsInDb = async() => {
  const blogs = await Blog
    .find({}).populate('user',{ username: 1, name: 1 })
  return blogs
}

const findBlog = async(filter) => {
  const blogs = await Blog
    .find(filter).populate('user',{ username: 1, name: 1 })
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

