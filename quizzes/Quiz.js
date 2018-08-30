const db = require('../db/config')
const { modelUtils, modelStatics } = require('../utils')
const schema = require('./QuizSchema')

function Quiz({ id = null, name, description, public, user_id }) {
  this.id = this._validate(id, 'id')
  this.name = this._validate(name, 'name')
  this.description = this._validate(description, 'description')
  this.public = this._validate(public, 'public')
  this.user_id = this._validate(user_id, 'user_id')
}

const quizStatics = modelStatics(db, 'quizzes')
quizStatics.findAllPublic = () => (
  db.manyOrNone('SELECT * FROM quizzes WHERE public = TRUE ORDER BY id ASC')
)
Object.setPrototypeOf(Quiz, quizStatics)

Quiz.prototype = Object.assign(Quiz.prototype, modelUtils(schema))

Quiz.prototype.save = function() {
  return db.one(`
    INSERT INTO quizzes
    (name, description, public, user_id)
    VALUES ($/name/, $/description/, $/public/, $/user_id/)
    RETURNING *
  `, this)
  .then(quiz => this.modify(quiz))
}

Quiz.prototype.relateFlashcards = function(flashcards) {
  return db.tx(t => (
    t.batch(flashcards.map(flashcard => t.one(`
      INSERT INTO quizzes_flashcards
      (quiz_id, fc_id)
      VALUES ($1, $2)
      RETURNING *
    `, [this.id, flashcard])))
  ))
  .then(quizzesFlashcards => ({ ...this, quizzesFlashcards }))
}

Quiz.prototype.flashcards = function() {
  return db.many(`
    SELECT flashcards.*
      FROM flashcards
      JOIN quizzes_flashcards
          ON flashcards.id = quizzes_flashcards.fc_id
      JOIN quizzes
          ON quizzes.id = quizzes_flashcards.quiz_id
    WHERE quizzes.id = $/id/
  `, this)
  .then((flashcards) => ({ ...this, cards: flashcards }))
}

module.exports = Quiz
