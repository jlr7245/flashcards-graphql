const express = require('express')
const graphqlHTTP = require('express-graphql')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const protected = require('./schema/protected')
const public = require('./schema/public')

require('dotenv').config()

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

app.use('/public', graphqlHTTP((req, res) => ({
  schema: public.schema,
  rootValue: public.root,
  graphiql: true,
  context: { req, res }
})))

app.use('/protected', passport.authenticate('local'), graphqlHTTP((req, res) => ({
  schema: protected.schema,
  rootValue: protected.root,
  graphiql: true,
  ctx: { req, res }
})))

app.use('/', (req, res) => {
  res.send('Hello World')
})

app.use('*', (req, res) => {
  res.status(404).send('Not found')
})

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).json({ err, message: err.message })
})

app.listen(PORT, () => {
  console.warn(`Listening on port ${PORT}`)
})
