const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../../user/User')
const { comparePass } = require('./helpers')

require('./passport')()

passport.use(
  new LocalStrategy({}, (username, password, done) => {
    User.findByUserName(username)
      .then(user => {
        if (!user) return done(null, false)
        if (!comparePass(password, user.password_digest)) return done(null, false)
        return done(null, user)
      })
      .catch(err => done(err))
  })
)

module.exports = passport
