const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Post = require('../models/post')
beforeEach( async () => {
    await Post.deleteMany()
    await Post.insertMany(helper.initialPosts)
})
//Test get all posts endpoint
test('Posts are returned as json', async () => {
    const response = await api 
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialPosts.length)
})
//test to check _id property is returned as id
test('identifier is named id', async () => {
    const response = await api .get('/api/posts')
    expect(response.body[0].id).toBeDefined()
})
//Check that a note can be added
test('A valid note can be added', async () => {
    const newPost = {
        title: "A test",
        name: " Joeeey",
        url: "/api/posts",
        likes: 8
    }
     await api
        .post('/api/posts')
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/posts')
    const titles = response.body.map(r => r.title)
    expect(response.body).toHaveLength(helper.initialPosts.length + 1)
    expect(titles).toContain('A test')
})
test('default likes to 0 if likes property missing', async () => {
    const newPost = {
        title: "I am missing likes",
        name: "Joe",
        url: '/api/posts/J'
    }
    const savedPost = await api
        .post('/api/posts')
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(savedPost.body.likes).toEqual(0)
})

test('fails with 400 if title and url are missing', async () => {
    const newPost = {
        name: "test"
    }
    await api
        .post('/api/posts')
        .send(newPost)
        .expect(400)
    const postsAtEnd = await api.get('/api/posts')
    expect(postsAtEnd.body).toHaveLength(helper.initialPosts.length)
})
test('a note can be deleted', async () => {
    const postsAtStart = await helper.postsInDb()
    const postToDelete = postsAtStart[0]
    await api
        .delete(`/api/posts/${postToDelete.id}`)
        .expect(204)
    const postsAtEnd = await helper.postsInDb()
    expect(postsAtEnd).toHaveLength(helper.initialPosts.length - 1)
    const titles = postsAtEnd.map(r => r.title)
    expect(titles).not.toContain(postToDelete.title)
})
//not working -_-
test('likes can be updated', async () => {
    const postsAtStart = await helper.postsInDb()
    const postToUpdate = postsAtStart[0]
    await api
        .put(`/api/posts/${postToUpdate.id}`)
        .send(postToUpdate)
    const postsAfterUpdate = await helper.postsInDb()
    expect(postToUpdate.likes + 1).toEqual(postsAfterUpdate[0].likes)
})
afterAll(()=> {
    mongoose.connection.close()
})