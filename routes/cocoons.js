const express = require('express')
const router = express.Router()
const Cocoon = require('../models/cocoons')

router.get('/', async (req, res) => {
  const cocoons = await Cocoon.find({})
  res.render('cocoons/index', { cocoons })
})

router.get('/new', (req, res) => {
  res.render('cocoons/new')
})

router.post('/', async (req, res) => {
  const cocoon = new Cocoon(req.body)

  cocoon.owner = req.user._id

  await cocoon.save()
  req.flash('success', 'succesfully added')
  res.redirect('/')
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const cocoon = await Cocoon.findById(id)
  if (!cocoon) {
    req.flash('error', 'cannot find details')
    res.redirect('/cocoons')
  }
  res.render('cocoons/show', { cocoon })
})

router.get('/:id/edit', async (req, res) => {
  const { id } = req.params
  const cocoon = await Cocoon.findById(id)
  if (!cocoon) {
    req.flash('error', 'cannot find details')
    res.redirect('/cocoons')
  }
  res.render('cocoons/edit', { cocoon })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const cocoon = await Cocoon.findByIdAndUpdate(id, { ...req.body })
  req.flash('success', 'successfully updated details')
  res.redirect(`/cocoons/${cocoon._id}`)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await Cocoon.findByIdAndDelete(id)
  req.flash('error', 'deleted')
  res.redirect('/cocoons')
})

module.exports = router
