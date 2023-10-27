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
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
