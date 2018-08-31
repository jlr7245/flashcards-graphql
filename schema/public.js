const { buildSchema } = require('graphql')
const { public: fcPublic } = require('./resolvers/flashcards')
const { public: kwPublic } = require('./resolvers/keywords')
const { public: userPublic } = require('./resolvers/users')

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

  input UserLogin {
    username: String
    password: String
  }

  type Query {
    getAllFlashcards: [Flashcard]
    getFlashcard(id: Int!): Flashcard
    getAllKeywords: [Keyword]
    getKeyword(id: Int!): Keyword
  }

  type Mutation {
    register(input: UserInput): User
    login(input: UserLogin): User
  }
`)

const root = {
  ...fcPublic,
  ...kwPublic,
  ...userPublic
}

module.exports = { schema, root }
