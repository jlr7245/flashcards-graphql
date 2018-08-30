const express = require('express')
const graphqlHTTP = require('express-graphql')
const { schema, root } = require('./graphqlschema')

const PORT = process.env.PORT || 4000


const app = express()

app.use(require('morgan')('dev'))

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

app.listen(PORT, () => {
  console.warn(`Listening on port ${PORT}`)
})
