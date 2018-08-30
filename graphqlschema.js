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

  input FlashcardInput {
    question: String
    answer: String
    category: String
    difficulty: Int
  }

  type Query {
    getAllFlashcards: [Flashcard]
    getFlashcard(id: Int!): Flashcard
    getAllKeywords: [Keyword]
    getKeyword(id: Int!): Keyword
  }

  type Mutation {
    createFlashcard(input: FlashcardInput): Flashcard
    updateFlashcard(id: Int!, input: FlashcardInput): Flashcard
    deleteFlashcard(id: Int!): String
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
  },
  createFlashcard: async function({ input }) {
    try {
      const newFlashcard = await new Flashcard(input).save()
      const keywords = await newFlashcard.getKeywords()
      const newKeywords = await Keyword.upsertSeveral(keywords)
      await newFlashcard.relateKeywords(newKeywords)
      return newFlashcard
    } catch (err) {
      console.warn(err)
      throw new Error('had a problem with creating a flashcard')
    }
  },
  updateFlashcard: async function({ id, input }) {
    try {
      const flashcardToModify = new Flashcard(await Flashcard.findOne(id))
      return await flashcardToModify.update(input)
    } catch (err) {
      console.warn(err)
      throw new Error('had a problem with updating a flashcard')
    }
  },
  deleteFlashcard: async function({ id }) {
    try {
      await Flashcard.destroy(id)
      return 'Deleted successfully'
    } catch(err) {
      console.warn(err)
      throw new Error('had a problem deleting a flashcard')
    }
  }
}

module.exports = { schema, root }
