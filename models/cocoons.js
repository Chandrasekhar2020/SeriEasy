const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cocoonSchema = new Schema({
  expectedDate: {
    type: Date,
    required: true
  },
  expectedQuantity: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Cocoon', cocoonSchema)
