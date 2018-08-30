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
  }
}

module.exports = { schema, root }
