const { buildSchema } = require('graphql')
const Flashcard = require('../flashcards/Flashcard')
const Keyword = require('../keywords/Keyword')
const User = require('../user/User')
const Quiz = require('../quizzes/Quiz')
const {
  flashcardType,
  keywordType,
  userType,
  quizType
} = require('./types')

const schema = buildSchema(`
  ${keywordType}
  ${flashcardType}
  ${userType}
  ${quizType}

  type Query {
    getAllFlashcards: [Flashcard]
    getFlashcard(id: Int!): Flashcard
    getAllKeywords: [Keyword]
    getKeyword(id: Int!): Keyword
  }
`)

const root = {
  getFlashcard: async function({ id }) {
    try {
      return new Flashcard(await Flashcard.findOne(id))
    } catch(err) {
      console.warn(err)
      throw new Error('had a problem finding a flashcard')
    }
  },
  getAllFlashcards: async function() {
    try {
      const allFlashcards = await Flashcard.findAll()
      return allFlashcards.map(flashcard => new Flashcard(flashcard))
    } catch (error) {
      console.warn(error)
      throw new Error('had a problem getting all flashcards')
    }
  },
  getAllKeywords: async function() {
    try {
      const allKeywords = await Keyword.findAll()
      return allKeywords.map(keyword => new Keyword(keyword))
    } catch (error) {
      console.warn(error)
      throw new Error('had a problem getting all keywords')
    }
  },
  getKeyword: async function({ id }) {
    try {
      return new Keyword(await Keyword.findOne(id))
    } catch (error) {
      console.warn(err)
      throw new Error('had a problem getting a keyword')
    }
  }
}

module.exports = { schema, root }
