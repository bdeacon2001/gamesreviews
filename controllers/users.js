const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/users')

const userRouter = express.Router()

userRouter.get('/signup', (req, res) => {
  res.render('users/signup.ejs', {
    currentUser: req.session.currentUser,
    baseUrl: req.baseUrl,
    tabTitle: 'Sign Up'
  })
})

userRouter.post('/', (req, res) => {
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync()
  )

  User.create(req.body)
    .then((newUser) => {
      console.log('created user is: ', newUser)
      res.redirect('/gamereviews') 
    })
    .catch((err) => {
      req.flash('info', 'Username already exists')
      res.redirect(req.baseUrl + '/signup')
      console.log('error')
    })
})

module.exports = userRouter