const bcrypt = require('bcryptjs')
const User = require('../../user/User')

const public = {
  async register({ input }, { req, res }) {
    console.warn(input)
    const password_digest = bcrypt.hashSync(input.password, bcrypt.genSaltSync())
    try {
      const newUser = await new User({ ...input, password_digest }).save()
      return req.login(newUser, err => {
        if (err) throw new Error(`problem logging in: ${err.message}`)
        return newUser
      })
    } catch (err) {
      console.warn(err)
      throw new Error(`Problem creating a user: ${err.message}`)
    }
  }
}

const protected = {
  async getUserProfile(_, { req }) {
    try {
      return new User(await User.findOne(req.user.id))
    } catch (err) {
      console.warn(err)                                                                                                                                 
      throw new Error(`Problem getting user profile: ${err.message}`)
    }
  }
}

module.exports = { public, protected }
