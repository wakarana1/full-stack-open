const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '6a051b665a8d0e3e32de59fc',
    title: 'Brand New Blog',
    author: 'Full Stack Dev',
    url: 'www.google.com',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const initialUsers = [
  {
    username: 'FirstUser',
    name: 'Super User',
    password: 'sekret',
  },
  {
    username: 'SecondUser',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Delete Me',
    author: 'Deleted Author',
    url: 'www.google.com',
    likes: 0,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const initialBlogsWithUser = async () => {
  const users = await usersInDb()
  const user = users[0]

  return initialBlogs.map(blog => ({
    ...blog,
    user: user.id
  }))
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb, initialBlogsWithUser
}