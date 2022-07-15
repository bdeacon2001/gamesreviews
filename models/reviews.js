const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    username: { type: String, required: true },
    comment: { type: String, required: true }
  },
  { timestamps: true }
)

const gameSchema = new Schema(
  {
    name: { type: String, required: true },
    release: { type: String, required: false },
    platforms: { type: String, required: false },
    description: { type: String, required: false },
    imageURL: { type: String },
    comments: [ commentSchema ]
  },
  { timestamps: true }
)

const Game = mongoose.model('Game', gameSchema)

module.exports = Game