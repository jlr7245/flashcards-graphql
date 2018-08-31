const { buildSchema } = require('graphql')
const { protected: fcProtected } = require('./resolvers/flashcards')

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
  ...fcProtected
}

module.exports = { schema, root }
