import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Container, Box, Button, Typography } from '@mui/material'
import Blog from './components/Blog'
import BlogView from './components/BlogView'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

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
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          showMessage('success', `blog ${blog.title} by ${blog.author} removed`)
          navigate('/')
        })
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
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      showMessage('success', `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      navigate('/')
    })
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showMessage('success', `welcome back ${user.name}`)
      navigate('/')
    } catch {
      showMessage('error', 'wrong credentials')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const blogsToShow = blogs.slice().sort((a, b) => b.likes - a.likes)

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Blog App</Typography>
          <Button color="inherit" component={RouterLink} to="/">blogs</Button>
          {user && (
            <Button color="inherit" component={RouterLink} to="/create">new blog</Button>
          )}
          {user
            ? <Button color="inherit" onClick={handleLogout}>logout</Button>
            : <Button color="inherit" component={RouterLink} to="/login">login</Button>
          }
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 3, mt: 3 }}>
        <Notification message={message} />
        <Routes>
          <Route path="/" element={
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>blogs</Typography>
              <ul>
                {blogsToShow.map(blog => (
                  <Blog key={blog.id} blog={blog} />
                ))}
              </ul>
            </Box>
          } />
          <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route path="/blogs/:id" element={
            <BlogView
              blogs={blogs}
              handleLike={handleLike}
              handleDelete={handleDelete}
              currentUser={user}
            />
          } />
        </Routes>
      </Box>
    </Container>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App
