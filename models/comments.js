const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  commentUpvote: {
    type: Number
  },
  commentDownvote: {
    type: Number
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Comment', commentSchema)
