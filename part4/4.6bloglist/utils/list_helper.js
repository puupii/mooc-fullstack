var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  var sum = 0
  blogs.forEach((blog) => {
    sum += blog.likes
  })
  return sum
}

const favoriteBlog = (blogs) => {
  var favorite = 0
  var favoriteLikes = 0
  blogs.forEach((blog) => {
    if (blog.likes > favoriteLikes) {
      favorite = blog
      favoriteLikes = blog.likes
    }
  })
  const blog = {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
  return blog
}

const mostBlogs = (blogs) => {
  const bloggers = _.countBy(blogs,'author')
  var mostblogs = 0
  var authorWithMostBlogs = ''
  for (const [key, value] of Object.entries(bloggers)) {
    if (value > mostblogs) {
      mostblogs = value
      authorWithMostBlogs = key
    }
  }
  const author = {
    author: authorWithMostBlogs,
    blogs: mostblogs
  }
  console.log(author)
  return author
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
