const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Chat'
    }
  ]
})

module.exports = mongoose.model('Group', groupSchema)
