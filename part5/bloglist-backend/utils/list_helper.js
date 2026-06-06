const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 1) {
    return blogs[0]['likes']
  }
}

const favoriteBlog = (blogs) => {
  let favoriteBlog = {}

  blogs.forEach(blog => {
    if(Object.keys(favoriteBlog).length === 0) {
      favoriteBlog = blog
    } else {
      favoriteBlog = favoriteBlog['likes'] > blog['likes'] ? favoriteBlog : blog
    }
  })

  return favoriteBlog
}

const mostBlogs = (blogs) => {
  return _.maxBy(
    _.map(_.countBy(blogs, 'author'), (blogs, author) => ({ author, blogs })),
    'blogs'
  )
}

const mostLikes = (blogs) => {
  return _.maxBy(
    _.map(_.groupBy(blogs, 'author'), (authorBlogs, author) => ({
      author,
      likes: _.sumBy(authorBlogs, 'likes'),
    })),
    'likes'
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
