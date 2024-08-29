const express = require('express')
const router = express.Router()
const Egg = require('../models/eggs')

router.get('/', async (req, res) => {
  const eggs = await Egg.find({})
  res.render('eggs/index', { eggs })
})

router.get('/new', (req, res) => {
  res.render('eggs/new')
})

router.post('/', async (req, res) => {
  const egg = new Egg(req.body)
  egg.owner = req.user._id
  await egg.save()
  req.flash('success', 'successfully added')
  res.redirect('/')
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const egg = await Egg.findById(id)
  if (!egg) {
    req.flash('error', 'cannot find details!!')
    return res.redirect('/eggs')
  }
  res.render('eggs/show', { egg })
})

router.get('/:id/edit', async (req, res) => {
  const { id } = req.params
  const egg = await Egg.findById(id)
  if (!egg) {
    req.flash('error', 'cannot find details!!')
    return res.redirect('/eggs')
  }
  res.render('eggs/edit', { egg })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const egg = await Egg.findByIdAndUpdate(id, { ...req.body })
  req.flash('success', 'successfully updated details')
  res.redirect(`/eggs/${egg._id}`)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await Egg.findByIdAndDelete(id)
  req.flash('success', 'successfully delted')
  res.redirect('/eggs')
})

module.exports = router
