const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/users')

const sessionsRouter = express.Router()

// localhost:3000/login
sessionsRouter.get('/login', (req, res) => {
  res.render('sessions/login.ejs', {
    tabTitle: 'Log In',
    baseUrl: req.baseUrl,
    currentUser: req.session.currentUser
  })
})

sessionsRouter.post('/login', (req, res) => {
  User.findOne({ username: req.body.username })
    .exec()
    .then((user) => {
      if (!user) {
        // user not found
        // success, info, error
        req.flash('error', 'Username or password is incorrect')
        return res.redirect(req.baseUrl + '/login')
      }
      const passwordIsCorrect = bcrypt.compareSync(req.body.password, user.password)
      if (!passwordIsCorrect) {
        // user found but password is wrong
        console.log('password is wrong')
        req.flash('error', 'Username or password is incorrect')
        res.redirect(req.baseUrl + '/login')
      } else {
        // user found and password is correct
        console.log(user, 'logged in')
        req.session.currentUser = user
        res.redirect('/gamereviews')
      }
    })
})

// localhost:3000/logout
sessionsRouter.delete('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/gamereviews')
  })
})

module.exports = sessionsRouter