const { buildSchema } = require('graphql')
const Flashcard = require('../flashcards/Flashcard')
const Keyword = require('../keywords/Keyword')
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

  input FlashcardInput {
    question: String
    answer: String
    category: String
    difficulty: Int
  }

  input QuizInput {
    name: String
    description: String
    public: Boolean
    flashcards: [Int]
  }

  type Query {
    hello: String
  }

  type Mutation {
    createFlashcard(input: FlashcardInput): Flashcard
    updateFlashcard(id: Int!, input: FlashcardInput): Flashcard
    deleteFlashcard(id: Int!): String
  }
`)

const root = {
  hello: function() {
    return 'Hello World'
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
