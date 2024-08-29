const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post('/register', async (req, res) => {
  try {
    const { email, username, password, phoneNumber } = req.body
    const user = new User({ email, username, phoneNumber })
    const registeredUser = await User.register(user, password)
    req.flash('success', 'Welcome to the seri world')
    res.redirect('/')
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('/register')
  }
})

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
  }),
  (req, res) => {
    req.flash('success', 'welcome back!!')
    res.redirect('/')
  }
)

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success', 'good byee!!')
    res.redirect('/')
  })
})

module.exports = router
