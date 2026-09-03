import { useParams } from 'react-router-dom'
import { Box, Paper, Typography, Link, Button } from '@mui/material'

const BlogView = ({ blogs, handleLike, handleDelete, currentUser }) => {
  const { id } = useParams()
  const blog = blogs.find((b) => b.id === id)

  if (!blog) return <Typography>Blog not found</Typography>

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        {blog.title}
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        by {blog.author}
      </Typography>
      <Link href={blog.url} target="_blank" rel="noreferrer">
        {blog.url}
      </Link>
      <Typography sx={{ mt: 1 }}>Added by {blog.user?.name}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
        <Typography>{blog.likes} likes</Typography>
        {currentUser && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleLike(blog)}
          >
            like
          </Button>
        )}
        {currentUser && currentUser.username === blog.user?.username && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(blog)}
          >
            remove
          </Button>
        )}
      </Box>
    </Paper>
  )
}

export default BlogView
