const bcrypt = require('bcryptjs')

const comparePass = (userPw, dbPw) => bcrypt.compareSync(userPw, dbPw)

const loginRequired = (req, res, next) => {
  if (!req.user) return res.json({ message: "User must be authorized" })
  return next()
}

module.exports = { comparePass, loginRequired }
