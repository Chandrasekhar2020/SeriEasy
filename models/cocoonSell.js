const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cocoonSellSchema = new Schema({
  name: {
    type: String,
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

module.exports = mongoose.model('CocoonSell', cocoonSellSchema)
