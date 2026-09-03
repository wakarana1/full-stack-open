const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
  const blogList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
    {
      _id: '6b533bb82c65b787345e28g9',
      title: 'The Second coming of blogs',
      author: 'Charlie Chaplin',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 2,
      __v: 0,
    },
    {
      _id: '1g433ii42c47n5896473e33i1',
      title: 'The most boring blog ever',
      author: 'Blogger McBloggerton',
      url: 'https://www.google.com',
      likes: 0,
      __v: 0,
    },
  ]

  test('return the most liked blog in the list', () => {
    const result = listHelper.favoriteBlog(blogList)
    assert.deepStrictEqual(result, {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    })
  })
})

describe('find the most', () => {
  const blogList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
    {
      _id: '6b533bb82c65b787345e28g9',
      title: 'The Second coming of blogs',
      author: 'Charlie Chaplin',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 2,
      __v: 0,
    },
    {
      _id: '1g433ii42c47n5896473e33i1',
      title: 'The most boring blog ever',
      author: 'Blogger McBloggerton',
      url: 'https://www.google.com',
      likes: 0,
      __v: 0,
    },
    {
      _id: '1g433ii42c47n5896473e33i2',
      title: 'Another boring blog',
      author: 'Blogger McBloggerton',
      url: 'https://www.google.com',
      likes: 0,
      __v: 0,
    },
  ]

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogList)
    assert.deepStrictEqual(result, {
      author: 'Blogger McBloggerton',
      blogs: 2,
    })
  })
})
describe('most likes', () => {
  const blogList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
    {
      _id: '6b533bb82c65b787345e28g9',
      title: 'The Second coming of blogs',
      author: 'Charlie Chaplin',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 2,
      __v: 0,
    },
    {
      _id: '7b533bb82c65b787345e29g9',
      title: 'The Third coming of blogs',
      author: 'Charlie Chaplin',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 4,
      __v: 0,
    },
    {
      _id: '1g433ii42c47n5896473e33i1',
      title: 'The most boring blog ever',
      author: 'Blogger McBloggerton',
      url: 'https://www.google.com',
      likes: 0,
      __v: 0,
    },
    {
      _id: '1g433ii42c47n5896473e33i2',
      title: 'Another boring blog',
      author: 'Blogger McBloggerton',
      url: 'https://www.google.com',
      likes: 0,
      __v: 0,
    },
  ]

  test('resturn the author with the most likes', () => {
    const result = listHelper.mostLikes(blogList)
    assert.deepStrictEqual(result, {
      author: 'Charlie Chaplin',
      likes: 6,
    })
  })
})
