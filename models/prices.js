const mongoose = require('mongoose')
const Schema = mongoose.Schema

const priceSchema = new Schema({
  averagePrice: {
    type: Number,
    required: true
  },
  minimumPrice: {
    type: Number,
    required: true
  },
  maximumPrice: {
    type: Number,
    required: true
  },
  marketName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Price', priceSchema)
