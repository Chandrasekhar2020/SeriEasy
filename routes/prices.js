const express = require('express')
const router = express.Router()
const Price = require('../models/prices')

router.get('/', async (req, res) => {
  const prices = await Price.find({})
  res.render('prices/index', { prices })
})

router.get('/new', (req, res) => {
  res.render('prices/new')
})

router.post('/', async (req, res) => {
  const price = new Price(req.body)
  await price.save()
  req.flash('success', 'successfully added')
  res.redirect('/')
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const price = await Price.findById(id)
  if (!price) {
    req.flash('error', 'cannot find details')
    return res.redirect('/prices')
  }
  res.render('prices/show', { price })
})

router.get('/:id/edit', async (req, res) => {
  const { id } = req.params
  const price = await Price.findById(id)
  if (!price) {
    req.flash('error', 'cannot find details')
    return res.redirect('/prices')
  }
  res.render('prices/edit', { price })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const price = await Price.findByIdAndUpdate(id, { ...req.body })
  req.flash('success', 'successfully updated details')
  res.redirect(`/prices/${price._id}`)
})

module.exports = router
