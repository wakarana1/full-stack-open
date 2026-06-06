import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showMessage = (type, message) => {
    setMessage({ type: type, message: message })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const forceLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    showMessage('error', 'session expired, please log in again')
  }

  const isSessionExpired = (error) => {
    const message = error.response?.data?.error
    return message === 'token missing or invalid'
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.remove(blog.id)
        .then(() => setBlogs(blogs.filter(b => b.id !== blog.id)))
        .catch(error => {
          if (isSessionExpired(error)) forceLogout()
        })
    }
  }

  const handleLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    blogService.update(blog.id, updatedBlog)
      .then(returnedBlog => setBlogs(blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b)))
      .catch(error => {
        if (isSessionExpired(error)) forceLogout()
      })
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      showMessage('success', `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    })
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showMessage('success', `welcome back ${user.name}`)
    } catch {
      showMessage('error', 'wrong credentials')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    setUser()
  }

  const logoutButton = () => (
    <button onClick={handleLogout}>logout</button>
  )

  const blogsToShow = blogs.slice().sort((a, b) => b.likes - a.likes)

  const blogForm = () => (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    </div>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} />

      {!user && (
        <Togglable buttonLabel="log in">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      )}
      {user && (
        <div>
          <div>
            <p>{user.name} logged in {logoutButton()} </p>
          </div>
          {blogForm()}
          {blogsToShow.map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              currentUser={user}
            />
          ))}
        </div>

      )}

    </div>
  )
}

export default App