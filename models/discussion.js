const mongoose = require('mongoose')
const Schema = mongoose.Schema

const discussionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  bodyUpvote: {
    type: Number
  },
  bodyDownvote: {
    type: Number
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reply'
    }
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Discussion', discussionSchema)
