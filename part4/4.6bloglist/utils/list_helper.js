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
  for (const [blogger, blogs] of Object.entries(bloggers)) {
    if (blogs > mostblogs) {
      mostblogs = blogs
      authorWithMostBlogs = blogger
    }
  }
  const author = {
    author: authorWithMostBlogs,
    blogs: mostblogs
  }

  return author
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
