const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eggSchema = new Schema({
  date: {
    type: Date
  },
  quantity: {
    type: Number
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    type: Number
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Egg', eggSchema)
