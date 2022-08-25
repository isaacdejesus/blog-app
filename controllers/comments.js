const commentsRouter = require('express').Router();
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')
commentsRouter.post('/', async (request, response) => {
    const {comment, postId} = request.body;
    console.log("comment is ",comment)
    const post = await Post.findById(postId)
    console.log(post)
    const COMMENT = new Comment({comment: comment})
    console.log("COMMENT IS", COMMENT)
    const savedComment = await COMMENT.save()
    console.log("saved comment is: ",savedComment)
    post.comments = post.comments.concat(savedComment)
    await post.save()
    response.status(201).json(savedComment);
})
commentsRouter.get('/', async (request, response) => {
    const comments = await Comment.find({}).populate('post', {id:1})
    response.json(comments)
})
module.exports = commentsRouter;
