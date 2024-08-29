const mongoose = require('mongoose')
const Schema = mongoose.Schema

const replySchema = new Schema({
  body: {
    type: String
  },
  replyUpvote: {
    type: Number
  },
  replyDownvote: {
    type: Number
  },
  replyNumber: {
    type: Number
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Reply', replySchema)
