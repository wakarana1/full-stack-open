import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'
import BlogForm from './BlogForm'

const blog = {
  id: 'abc123',
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'http://example.com',
  likes: 5,
  user: { name: 'Test User', username: 'testuser' },
}

describe('Blog', () => {
  test('renders title and author as a link', () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('link', { name: 'Test Blog Title Test Author' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Test Blog Title Test Author' }),
    ).toHaveAttribute('href', '/blogs/abc123')
  })
})

describe('BlogForm', () => {
  test('calls createBlog with the right details on submit', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()
    render(<BlogForm createBlog={mockCreateBlog} />)

    await user.type(screen.getByLabelText(/Blog Title/), 'New Blog Title')
    await user.type(screen.getByLabelText(/Blog Author/), 'New Author')
    await user.type(screen.getByLabelText(/Blog URL/), 'http://newblog.com')
    await user.type(screen.getByLabelText(/Blog Likes/), '10')
    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'New Author',
      url: 'http://newblog.com',
      likes: '10',
    })
  })
})
