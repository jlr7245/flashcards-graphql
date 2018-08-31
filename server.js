const express = require('express')
const graphqlHTTP = require('express-graphql')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
// const { schema, root } = require('./graphqlschema')
const protected = require('./schema/protected')
const public = require('./schema/public')

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

// app.use('/graphql', graphqlHTTP({
//   schema,
//   rootValue: root,
//   graphiql: true
// }))



app.use('/public', graphqlHTTP({
  schema: public.schema,
  rootValue: public.root,
  graphiql: true
}))

app.use('/protected', graphqlHTTP({
  schema: protected.schema,
  rootValue: protected.root,
  graphiql: true
}))

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
