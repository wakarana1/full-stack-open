import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] =useState('')
  const [blogAuthor, setBlogAuthor] =useState('')
  const [blogUrl, setBlogUrl] =useState('')
  const [blogLikes, setBlogLikes] =useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
      likes: blogLikes
    })

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
    setBlogLikes('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            Blog Title:
            <input value={blogTitle} onChange={({ target }) => setBlogTitle(target.value)} />
          </label>
        </div>
        <div>
          <label>
            Blog Author:
            <input value={blogAuthor} onChange={({ target }) => setBlogAuthor(target.value)} />
          </label>
        </div>
        <div>
          <label>
            Blog URL:
            <input value={blogUrl} onChange={({ target }) => setBlogUrl(target.value)} />
          </label>
        </div>
        <div>
          <label>
            Blog Likes:
            <input value={blogLikes} onChange={({ target }) => setBlogLikes(target.value)} />
          </label>
        </div>
        <button type="submit">save</button>
      </form>
    </div>

  )
}

export default BlogForm