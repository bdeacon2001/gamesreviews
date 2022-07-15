require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('express-flash')
const mongoDBSession = require('connect-mongodb-session')

const usersController = require('./controllers/users')
const reviewsController = require('./controllers/reviews')
const sessionsController = require('./controllers/sessions')

const seed  = require('./seed/run')

const app = express()
const PORT = process.env.PORT
const dbURL = process.env.MONGOOSE
const MongoDBStore = mongoDBSession(session)
const sessionStore = new MongoDBStore({
  uri: dbURL,
  collection: 'sessions'
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}))
app.use(flash())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use('/', sessionsController)
app.use('/users', usersController)
app.use('/gamereviews', reviewsController)

mongoose.connect(dbURL, () => {
  console.log('Connected to game reviews db')
  seed.runSeed()
})

app.listen(PORT, () => {
  console.log('Server started at PORT:', PORT)
})