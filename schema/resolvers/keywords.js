const Keyword = require('../../keywords/Keyword')

const public = {
  async getAllKeywords() {
    try {
      const allKeywords = await Keyword.findAll()
      return allKeywords.map(keyword => new Keyword(keyword))
    } catch (err) {
      console.warn(err)
      throw new Error(`had a problem getting all keywords: ${err.message}`)
    }
  },
  async getKeyword({ id }) {
    try {
      return new Keyword(await Keyword.findOne(id))
    } catch (err) {
      console.warn(err)
      throw new Error(`had a problem getting a keyword: ${err.message}`)
    }
  }
}

module.exports = { public }
