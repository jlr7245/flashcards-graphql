const db = require('../db/config')
const { modelUtils, modelStatics } = require('../utils')
const schema = require('./KeywordSchema')

function Keyword({ id = null, word, counter = null }) {
  this.id = this._validate(id, 'id')
  this.word = this._validate(word, 'word')
  this.counter = this._validate(counter, 'counter')
}

const keywordStatics = modelStatics(db, 'keywords')
keywordStatics.upsertSeveral = keywords => (
  db.tx(t => t.batch(
    keywords.map(keyword => (
      t.one(`
        INSERT INTO keywords
        (word, counter)
        VALUES $1, 1
        ON CONFLICT (word) DO UPDATE
        SET counter = keywords.counter + 1
        RETURNING *
      `, keyword)
    ))
  ))
)
Object.setPrototypeOf(Keyword, keywordStatics)

Keyword.prototype.flashcards = function() {
  return db.manyOrNone(`
    SELECT flashcards.*
      FROM flashcards
      JOIN flashcards_keywords
        ON flashcards_keywords.fc_id = flashcards.id
      JOIN keywords
        ON keywords.id = flashcards_keywords.kw_id
    WHERE keywords.id = $1
  `, this.id)
  .then(flashcards => ({ ...this, cards: flashcards }))
}

module.exports = Keyword
