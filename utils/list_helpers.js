const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    return blogs.reduce((prev, curr) => prev + curr.likes, 0)
}
const favoriteBlog = (blogs) => {
    let maxVal = 0
    let post = null
    for(let i = 0; i < blogs.length; i ++)
    {
        if(blogs[i].likes>maxVal){
            maxVal = blogs[i].likes
            post = blogs[i]}
    }
    return (`likes: ${post.likes}`)
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
