const express = require('express')
const router = express.Router()
const CocoonSell = require('../models/cocoonSell')

router.get('/', async (req, res) => {
  const buyers = await CocoonSell.find()
  res.render('cocoonSell/index', { buyers })
})

router.get('/new', (req, res) => {
  res.render('cocoonSell/new')
})

router.post('/', async (req, res) => {
  const buyer = new CocoonSell(req.body)
  buyer.owner = req.user._id
  await buyer.save()
  req.flash('success', 'successfully added')
  res.redirect('/')
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const buyer = await CocoonSell.findById(id)
  if (!buyer) {
    req.flash('error', 'cannot find details')
    res.redirect('/cocoonSell')
  }
  res.render('cocoonSell/show', { buyer })
})

router.get('/:id/edit', async (req, res) => {
  const { id } = req.params
  const buyer = await CocoonSell.findById(id)
  if (!buyer) {
    req.flash('error', 'cannot find details')
    res.redirect('/cocoonSell')
  }
  res.render('cocoonSell/edit', { buyer })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const buyer = await CocoonSell.findByIdAndUpdate(id, { ...req.body })
  req.flash('success', 'successfully updated details')
  res.redirect(`/cocoonSell/${buyer._id}`)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await CocoonSell.findByIdAndDelete(id)
  req.flash('error', 'deleted')
  res.redirect('/cocoonSell')
})

module.exports = router
