const Post = require('../models/post')
const User = require('../models/user')
const initialPosts = [
    {
        title: "The great potato man",
        author: "Joe J",
        url: "/api/posts/J",
        likes: 8
    },
    {
        title: "For I am",
        author: "Isaac R.",
        url: "/api/posts/R",
        likes: 4
    }
]

const nonExistingId = async () => {
    const post = new Post({
        title: "random",
        author: 'eh',
        url: "shallsee",
        likes: 0
    })
    await post.save()
    await post.remove()
    return post._id.toString()
}

const postsInDb = async () => {
    const posts = await Post.find({})
    return posts.map(post => post.toJSON())
}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}
module.exports = {
    initialPosts, nonExistingId, postsInDb, usersInDb
}