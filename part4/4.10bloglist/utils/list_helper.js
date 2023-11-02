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

const mostLikes = (blogs) => {
  const bloggers = _.groupBy(blogs, 'author')

  var mostlikes = 0
  var authorWithMostLikes = ''

  for (const [blogger, blogsByAuthor] of Object.entries(bloggers)) {
    var likes = 0
    likes = _.sumBy(blogsByAuthor, 'likes')
    if (likes > mostlikes) {
      mostlikes = likes
      authorWithMostLikes = blogger
    }
  }
  const author = {
    author: authorWithMostLikes,
    likes: mostlikes
  }

  return author
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
