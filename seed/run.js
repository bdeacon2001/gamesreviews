require('dotenv').config()

const mongoose = require('mongoose')

const Game = require('../models/reviews')
const Games = require('./reviewgames')

const dbURL = process.env.MONGOOSE

const runSeed = () => {
  Game.collection.drop()
    .then(() => {
      console.log('Game collection dropped')
      console.log('Inserting seed data')
      return Game.insertMany(Games)
    })
    .then((insertedGames) => {
      console.log('Games inserted')
      console.log(insertedGames)
    })
  }

module.exports = {
  runSeed
}
 