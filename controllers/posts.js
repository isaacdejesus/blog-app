const postsRouter = require('express').Router()
const Post = require('../models/post')
postsRouter.get('/', (request, response) => {
  Post
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

postsRouter.post('/', (request, response) => {
  const post = new Post(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = postsRouter
