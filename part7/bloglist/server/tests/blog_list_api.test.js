const assert = require('node:assert')
const { describe, test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
const jwt = require('jsonwebtoken')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await User.insertMany(helper.initialUsers)
  const blogsWithUser = await helper.initialBlogsWithUser()
  await Blog.insertMany(blogsWithUser)
})

describe('read', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map((e) => e.title)
    assert(title.includes('Brand New Blog'))
  })

  test('a specific blog can be viewed by id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-type', /application\/json/)

    assert.strictEqual(resultBlog.body.id, blogToView.id)
    assert.strictEqual(resultBlog.body.title, blogToView.title)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/blogs/${invalidId}`).expect(400)
  })
})

describe('create', () => {
  test('a valid blog can be added ', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]
    const token = jwt.sign(user, process.env.SECRET)
    const newBLog = {
      title: 'Valid Blog',
      author: 'Full Stack Dev',
      url: 'www.google.com',
      likes: 1,
      userId: user.id,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBLog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map((n) => n.title)
    assert(title.includes('Valid Blog'))
  })

  test('blog without a like defaults to 0', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]
    const token = jwt.sign(user, process.env.SECRET)
    const newBlog = {
      title: 'Default Likes',
      author: 'New Author',
      url: 'www.yahoo.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title)
    assert.strictEqual(addedBlog.likes, 0)
  })

  test('blog without a title is not added', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]
    const token = jwt.sign(user, process.env.SECRET)
    const newBlog = {
      author: 'New Author',
      url: 'www.yahoo.com',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without a url is not added', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]
    const token = jwt.sign(user, process.env.SECRET)
    const newBlog = {
      title: 'Invalid Blog',
      author: 'New Author',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('get 401 Unauthorized if token is not provided', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]
    const newBLog = {
      title: 'Valid Blog',
      author: 'Full Stack Dev',
      url: 'www.google.com',
      likes: 1,
      userId: user.id,
    }

    await api
      .post('/api/blogs')
      .send(newBLog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('update', () => {
  test('a blog title can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newTitle = 'Updated Blog'

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({
        title: newTitle,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes,
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, newTitle)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.title, newTitle)
  })
})

describe('delete', () => {
  test('a blog can be deleted when its the user who created the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const usersInDb = await helper.usersInDb()
    const user = usersInDb[0]

    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.SECRET,
    )

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const ids = blogsAtEnd.map((n) => n.id)
    assert(!ids.includes(blogToDelete.id))
  })

  test('it does not allow deleting when it is user who did not create the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const usersInDb = await helper.usersInDb()
    const user = usersInDb[1]

    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.SECRET,
    )

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

after(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await mongoose.connection.close()
})
