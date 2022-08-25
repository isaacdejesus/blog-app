const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
postsRouter.get('/', async (request, response) => {
  const posts = await Post.find({}).populate('user comments', {username:1, name:1, comment: 1})
  //const posts = await Post.find({}).populate('comments', {comments:1, })
      response.json(posts)
})

postsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log("decoded token is:", decodedToken)
  if(!decodedToken.id){
    return response.status(401).json({error: 'token missing or invalid'})
  }
  //const user = await User.findById(decodedToken.id)
  const user = request.user
  console.log(user)
  if(!(body.title || body.url))
    return response.status(400) .end()
  const post = new Post({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,  //set likes to zero is not defined
    user: user._id
  })
  const savedPost = await post.save()
  user.posts = user.posts.concat(savedPost._id)
  await user.save()
  response.status(201).json(savedPost)
})
 postsRouter.delete('/:id', async (request, response) => {
   const post = await Post.findById(request.params.id)
   if(!post){
     return response.status(401).json({error: "post doesn't exist"})
   }
   const decodedToken = jwt.verify(request.token, process.env.SECRET)
   if(!decodedToken.id){
     return response.status(401).json({error: 'token missing or invalid'})
   }
   //const user = await User.findById(decodedToken.id)
   const user = request.user
   console.log("user contains", user)
   console.log("user _id is", user._id)
   console.log("user _id is as a string is", user._id.toString())
   console.log("user id is", user.id)
   console.log(post.user.toString())
   if(!(post.user.toString() === user.id.toString())){
      return response.status(401).json({error: 'poster/post mismatch'})
   }
   await Post.findByIdAndRemove(request.params.id)
   response.status(204).end()
 })
 postsRouter.put('/:id', async(request, response) => {
   const body = request.body
    console.log(body)
   const post = {
     title: body.title,
     author:body.author ,
     url: body.url,
     likes: body.likes + 1
   }
   const savedPost = await Post.findByIdAndUpdate(request.params.id, post, {new: true})
    response.json(savedPost)
 })

module.exports = postsRouter
