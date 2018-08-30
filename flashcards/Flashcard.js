const db = require('../db/config')
const { modelUtils, modelStatics } = require('../utils')
const schema = require('./FlashcardSchema')

function Flashcard({ id = null, question, answer, category, difficulty, user_id }) {
  this.id = this._validate(id, 'id')
  this.question = this._validate(question, 'question')
  this.answer = this._validate(answer, 'answer')
  this.category = this._validate(category, 'category')
  this.difficulty = this._validate(difficulty, 'difficulty')
  this.user_id = this._validate(user_id, 'user_id')
}

const flashcardStatics = modelStatics(db, 'flashcards')

Object.setPrototypeOf(Flashcard, flashcardStatics)
Flashcard.prototype = Object.assign(Flashcard.prototype, modelUtils(schema))

module.exports = Flashcard
