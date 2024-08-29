const express = require('express')
const router = express.Router()
const Group = require('../models/group')
const Chat = require('../models/chat')

router.get('/', async (req, res) => {
  const groups = await Group.find({})
  res.render('groups/index', { groups })
})

router.get('/new', (req, res) => {
  res.render('groups/new')
})

router.post('/', async (req, res) => {
  const group = new Group(req.body)
  group.owner = req.user._id
  await group.save()
  req.flash('success', 'successfully added')
  res.redirect('/groups')
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const group = await Group.findById(id)
    .populate({
      path: 'chats',
      populate: {
        path: 'author'
      }
    })
    .populate({
      path: 'owner'
    })
  console.log(group)
  if (!group) {
    req.flash('error', 'cannot find details of group')
    return res.redirect('/groups')
  }
  res.render('groups/show', { group })
})

router.post('/:id/chats', async (req, res) => {
  const { id } = req.params
  const group = await Group.findById(id)
  const chat = new Chat(req.body.chat)
  chat.author = req.user._id
  group.chats.push(chat)
  await group.save()
  await chat.save()
  res.redirect(`/groups/${group._id}`)
})

module.exports = router
