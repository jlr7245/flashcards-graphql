const Flashcard = require('../../flashcards/Flashcard')
const Keyword = require('../../keywords/Keyword')

const public = {
  async getFlashcard({ id }) {
    try {
      return new Flashcard(await Flashcard.findOne(id))
    } catch(err) {
      console.warn(err)
      throw new Error(`Had a problem finding a flashcard: ${err.message}`)
    }
  },
  async getAllFlashcards() {
    try {
      const allFlashcards = await Flashcard.findAll()
      return allFlashcards.map(flashcard => new Flashcard(flashcard))
    } catch (err) {
      console.warn(err)
      throw new Error(`Had a problem finding all flashcards: ${err.message}`)
    }
  }
}

const protected = {
  async createFlashcard({ input }) {
    try {
      const newFlashcard = await new Flashcard(input).save()
      const keywords = await newFlashcard.getKeywords()
      const newKeywords = await Keyword.upsertSeveral(keywords)
      await newFlashcard.relateKeywords(newKeywords)
      return newFlashcard
    } catch (err) {
      console.warn(err)
      throw new Error(`had a problem creating a new flashcard: ${err.message}`)
    }
  },
  async updateFlashcard({ id, input }) {
    try {
      const flashcardToModify = new Flashcard(await Flashcard.findOne(id))
      return await flashcardToModify.update(input)
    } catch (err) {
      console.warn(err)
      throw new Error(`had a problem with updating a flashcard: ${err.message}`)
    }
  },
  async deleteFlashcard({ id }) {
    try {
      await Flashcard.destroy(id)
      return 'Deleted successfully'
    } catch (err) {
      console.warn(err)
      throw new Error(`had a problem deleting a flashcard: ${err.message}`)
    }
  }
}

module.exports = { public, protected }
