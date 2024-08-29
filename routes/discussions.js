const express = require('express')
const router = express.Router()
const Discussion = require('../models/discussion')
const Reply = require('../models/replies')
const Comment = require('../models/comments')

router.get('/', async (req, res) => {
  const discussions = await Discussion.find({})
  res.render('discussions/index', { discussions })
})

router.get('/new', (req, res) => {
  res.render('discussions/new')
})

router.post('/', async (req, res) => {
  const discussion = new Discussion(req.body)
  discussion.author = req.user._id
  await discussion.save()
  req.flash('success', 'successfully added new post')
  res.redirect('/discussions')
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const discussion = await Discussion.findById(id)
    .populate({
      path: 'replies',
      populate: [
        {
          path: 'author'
        },
        {
          path: 'comments'
        }
      ]
      //   populate: {
      //     path: 'comments'
      //   }
    })
    .populate('author')
  if (!discussion) {
    req.flash('error', 'cannot find details')
    return res.redirect('/discussions')
  }
  res.render('discussions/show', { discussion })
})

router.post('/:id/replies', async (req, res) => {
  const { id } = req.params
  const discussion = await Discussion.findById(id)
  const reply = new Reply(req.body.reply)
  reply.author = req.user._id
  discussion.replies.push(reply)
  reply.replyNumber = discussion.replies.length
  await discussion.save()
  await reply.save()
  res.redirect(`/discussions/${discussion._id}`)
})

router.post('/:id/replies/:idr/comments', async (req, res) => {
  const { id, idr } = req.params
  const discussion = await Discussion.findById(id)
  const reply = await Reply.findById(idr)
  const comment = new Comment(req.body.comment)
  comment.author = req.user._id
  reply.comments.push(comment)
  await discussion.save()
  await reply.save()
  await comment.save()
  res.redirect(`/discussions/${discussion._id}`)
})

module.exports = router
