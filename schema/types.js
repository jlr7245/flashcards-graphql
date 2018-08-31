const flashcardType = `
  type Flashcard {
    id: Int!
    question: String
    answer: String
    difficulty: Int
    user_id: Int
    keywords: [Keyword]
    user: User
  }
`

const keywordType = `
  type Keyword {
    id: Int!
    word: String
    counter: Int
    flashcards: [Flashcard]
  }
`

const quizType = `
  type Quiz {
    id: Int!
    name: String
    description: String
    public: Boolean
    user_id: Int
    flashcards: [Flashcard]
    user: User
  }
`

const userType = `
  type User {
    id: Int!
    username: String
    password_digest: String
    email: String
    flashcards: [Flashcard]
    quizzes: [Quiz]
  }
`

module.exports = { flashcardType, keywordType, quizType, userType }
