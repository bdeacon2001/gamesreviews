const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const Game = require('../models/reviews')

const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/login')
  }
  next()
}

router.use(isLoggedIn)

router.get('/', (req, res) => {
  Game.find()
    .exec()
    .then((games) => {
      res.render('index.ejs', {
        currentUser: req.session.currentUser,
        allGames: games,
        baseUrl: req.baseUrl,
        tabTitle: 'Games Index'
      })
    })
})

router.get('/new', (req, res) => {
  res.render('new.ejs', {
    baseUrl: req.baseUrl,
    currentUser: req.session.currentUser,
    tabTitle: 'Add New Game'
  })
})

router.post('/', upload.single('image'), (req, res) => {
  req.body.imageURL = req.file.path
  Game.create(req.body)
    .then((newGame) => {
      console.log('Created game:', newGame)
      res.redirect(req.baseUrl)
    })
})

router.get('/:id', (req, res) => {
  Game.findById(req.params.id)
    .exec()
    .then((game) => {
      res.render('show.ejs', {
        baseUrl: req.baseUrl,
        theGame: game,
        currentUser: req.session.currentUser,
        tabTitle: game.name,
        comments: game.comments
      })
    })
})

router.delete('/:id', (req, res) => {
  Game.findByIdAndDelete(req.params.id)
    .exec()
    .then((game) => {
      console.log('Deleted game:', game)
      res.redirect(req.baseUrl)
    })
})

router.put('/:id', (req, res) => {
  Game.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .exec()
    .then((game) => {
      console.log('Updated game:', game)
      res.redirect(req.baseUrl)
    })
})

router.get('/:id/edit', (req, res) => {
  Game.findById(req.params.id)
    .exec()
    .then((game) => {
      res.render('edit.ejs', {
        currentUser: req.session.currentUser,
        baseUrl: req.baseUrl,
        theGame: game,
        tabTitle: 'Update game: ' + game.name
      })
    })
}) 

router.post('/:id/comment', (req, res) => {
  Game.findById(req.params.id)
    .exec()
    .then((game) => {
      const newComment = { 
        username: req.session.currentUser.username,
        comment: req.body.comment
      }
      const currentComments = game.comments
      currentComments.push(newComment)
      game.save()
      .then((_game) => {
        res.redirect(`${req.baseUrl}/${req.params.id}`)
      })
    })

})

module.exports = router