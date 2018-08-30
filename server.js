const express = require('express')
const graphqlHTTP = require('express-graphql')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const { schema, root } = require('./graphqlschema')

const PORT = process.env.PORT || 4000


const app = express()

app.use(require('morgan')('dev'))
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

app.listen(PORT, () => {
  console.warn(`Listening on port ${PORT}`)
})
