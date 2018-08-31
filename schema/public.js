const { buildSchema } = require('graphql')
const { public: fcPublic } = require('./resolvers/flashcards')
const { public: kwPublic } = require('./resolvers/keywords')

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

  input UserInput {
    username: String
    password: String
    email: String
  }

  type Query {
    getAllFlashcards: [Flashcard]
    getFlashcard(id: Int!): Flashcard
    getAllKeywords: [Keyword]
    getKeyword(id: Int!): Keyword
  }

  type Mutation {
    createUser(input: UserInput): User
  }
`)

const root = {
  ...fcPublic,
  ...kwPublic
}

module.exports = { schema, root }
