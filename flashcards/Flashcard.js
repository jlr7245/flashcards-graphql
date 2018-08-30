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


// static methods (Flashcard.thing)
const flashcardStatics = modelStatics(db, 'flashcards')
flashcardStatics.findByCategory = (category) => {
  return db.manyOrNone(`
    SELECT * FROM flashcards
    WHERE category = $1
  `, category)
}
Object.setPrototypeOf(Flashcard, flashcardStatics)

// instance methods (new Flashcard.thing)
Flashcard.prototype = Object.assign(
  Flashcard.prototype,
  modelUtils(schema)
)

Flashcard.prototype.save = function() {
  return db.one(`
    INSERT INTO flashcards
    (question, answer, difficulty, category, user_id)
    VALUES ($/question/, $/answer/, $/difficulty/, $/category/, $/user_id/)
    RETURNING *
  `, this)
    .then(flashcard => this._modify(flashcard))
}

Flashcard.prototype.update = function(changes) {
  this._modify(changes);
  return db.one(`
    UPDATE flashcards SET
    question = $/question/,
    answer = $/answer/,
    difficulty = $/difficulty/,
    category = $/category/
    WHERE id = $/id/
    RETURNING *
  `, this)
    .then(flashcard => this._modify(flashcard))
}

Flashcard.prototype.keywords = async function() {
  const Keyword = require('../keywords/Keyword')

  const keywords = await db.manyOrNone(
    `SELECT keywords.*
    FROM keywords
    JOIN flashcards_keywords
          ON flashcards_keywords.kw_id = keywords.id
    JOIN flashcards
          ON flashcards.id = flashcards_keywords.fc_id
    WHERE flashcards.id = $/id/`, this)
  return keywords.map(keyword => new Keyword(keyword))
}

Flashcard.prototype.relateKeywords = function(keywords) {
  return db.tx(t => {
    const queries = keywords.map(keyword => {
      return t.one(`
        INSERT INTO flashcards_keywords
        (kw_id, fc_id)
        VALUES ($1, $2)
        RETURNING *
      `, [keyword.id, this.id])
    })
    return t.batch(queries)
  })
}

module.exports = Flashcard
