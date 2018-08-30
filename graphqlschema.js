const { buildSchema } = require('graphql')
const Flashcard = require('./flashcards/Flashcard')
const Keyword = require('./keywords/Keyword')

const schema = buildSchema(`
  type Keyword {
    id: Int!
    word: String
    counter: Int
    flashcards: [Flashcard]
  }

  type Flashcard {
    id: Int!
    question: String
    answer: String
    difficulty: Int
    user_id: Int
    keywords: [Keyword]
  }

  type Query {
    getAllFlashcards: [Flashcard]
    getFlashcard(id: Int!): Flashcard
    getAllKeywords: [Keyword]
    getKeyword(id: Int!): Keyword
  }
`)

const root = {
  getFlashcard: async function({ id }) {
    return new Flashcard(await Flashcard.findOne(id))
  },
  getAllFlashcards: async function() {
    const allFlashcards = await Flashcard.findAll()
    return allFlashcards.map(flashcard => new Flashcard(flashcard))
  },
  getAllKeywords: async function() {
    const allKeywords = await Keyword.findAll()
    return allKeywords.map(keyword => new Keyword(keyword))
  },
  getKeyword: async function({ id }) {
    return new Keyword(await Keyword.findOne(id))
  }
}

module.exports = { schema, root }
