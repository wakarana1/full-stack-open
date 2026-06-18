import { Link as MuiLink } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Blog = ({ blog }) => (
  <li className='blog'>
    <MuiLink component={RouterLink} to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </MuiLink>
  </li>
)

export default Blog
