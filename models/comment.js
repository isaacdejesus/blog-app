const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    comments: string,
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }
})

commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Comment', commentSchema);
