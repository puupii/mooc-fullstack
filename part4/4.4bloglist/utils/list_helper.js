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

module.exports = {
  dummy,
  totalLikes
}
