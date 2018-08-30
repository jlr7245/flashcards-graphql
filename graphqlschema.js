const { buildSchema } = require('graphql')
const Flashcard = require('./flashcards/Flashcard')

const schema = buildSchema(`
  type Flashcard {
    id: Int!
    question: String
    answer: String
    difficulty: Int
    user_id: Int
  }

  type Query {
    getFlashcard(id: Int!): Flashcard
  }
`)

const root = {
  getFlashcard: async function({ id }) {
    return await Flashcard.findOne(id)
  }
}

module.exports = { schema, root }
