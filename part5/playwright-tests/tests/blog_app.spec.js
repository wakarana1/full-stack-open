const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'waka',
        username: 'waka',
        password: 'password'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.getByRole('textbox').last()).toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('waka')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByLabel('Blog Title').fill('Test Blog Title')
      await page.getByLabel('Blog Author').fill('Test Author')
      await page.getByLabel('Blog URL').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Test Blog Title').first()).toBeVisible()
    })
  })

  describe('When a blog exists', () => {
    beforeEach(async ({ page, request }) => {
      const loginRes = await request.post('http://localhost:3001/api/login', {
        data: { username: 'waka', password: 'password' }
      })
      const { token } = await loginRes.json()
      await request.post('http://localhost:3001/api/blogs', {
        headers: { Authorization: `Bearer ${token}` },
        data: { title: 'Like Test Blog', author: 'Test Author', url: 'http://test.com', likes: 0 }
      })

      await page.reload()
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('waka')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.locator('.blog').first().getByRole('link').click()
      await expect(page.getByText('0 likes')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('the blog owner can delete the blog', async ({ page }) => {
      await page.locator('.blog').first().getByRole('link').click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByRole('link', { name: /Like Test Blog/ })).not.toBeVisible()
    })

    test('only the blog owner sees the delete button', async ({ page, request }) => {
      await request.post('http://localhost:3001/api/users', {
        data: { name: 'other', username: 'other', password: 'password' }
      })
      await page.getByRole('button', { name: 'logout' }).click()
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('other')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await page.locator('.blog').first().getByRole('link').click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })

  describe('Blog ordering', () => {
    beforeEach(async ({ page, request }) => {
      const loginRes = await request.post('http://localhost:3001/api/login', {
        data: { username: 'waka', password: 'password' }
      })
      const { token } = await loginRes.json()
      await Promise.all([
        request.post('http://localhost:3001/api/blogs', {
          headers: { Authorization: `Bearer ${token}` },
          data: { title: 'Most Liked', author: 'Author', url: 'http://a.com', likes: 10 }
        }),
        request.post('http://localhost:3001/api/blogs', {
          headers: { Authorization: `Bearer ${token}` },
          data: { title: 'Mid Liked', author: 'Author', url: 'http://b.com', likes: 5 }
        }),
        request.post('http://localhost:3001/api/blogs', {
          headers: { Authorization: `Bearer ${token}` },
          data: { title: 'Least Liked', author: 'Author', url: 'http://c.com', likes: 1 }
        })
      ])
      await page.reload()
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('waka')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      const blogs = page.locator('.blog')
      await expect(blogs.nth(0)).toContainText('Most Liked')
      await expect(blogs.nth(1)).toContainText('Mid Liked')
      await expect(blogs.nth(2)).toContainText('Least Liked')
    })
  })

  describe('Login form is shown', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('waka')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('waka')
      await page.getByRole('textbox').last().fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })
})
