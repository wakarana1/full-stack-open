import { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [blogLikes, setBlogLikes] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
      likes: blogLikes,
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
    setBlogLikes('')
  }

  return (
    <Box component="form" onSubmit={addBlog} sx={{ maxWidth: 500, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        create new
      </Typography>
      <TextField
        id="blog-title"
        label="Blog Title"
        fullWidth
        variant="outlined"
        value={blogTitle}
        onChange={({ target }) => setBlogTitle(target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        id="blog-author"
        label="Blog Author"
        fullWidth
        variant="outlined"
        value={blogAuthor}
        onChange={({ target }) => setBlogAuthor(target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        id="blog-url"
        label="Blog URL"
        fullWidth
        variant="outlined"
        value={blogUrl}
        onChange={({ target }) => setBlogUrl(target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        id="blog-likes"
        label="Blog Likes"
        fullWidth
        variant="outlined"
        value={blogLikes}
        onChange={({ target }) => setBlogLikes(target.value)}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        create
      </Button>
    </Box>
  )
}

export default BlogForm
