require('isomorphic-fetch')

const seedData = require('./seeds.js')
const Flashcard = require('../../flashcards/Flashcard')
const Keyword = require('../../keywords/Keyword')

const db = require('../config.js')

require('dotenv').config()

async function getKeywordsForSeed({ question, id }) {
  console.warn('get keywords for seed')
  try {
    const initialRes = await fetch('https://apiv2.indico.io/keywords?version=2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.API_KEY,
        data: question,
      }),
    })
    const jsonRes = await initialRes.json()
    const keywords = []
    for (const key in jsonRes.results) {
      keywords.push({ word: key, fc_id: id })
    }
    console.log(keywords)
    return keywords
  } catch(err) {
    console.warn(err)
    throw new Error('problem happened when fetching the keywords')
  }
}

// const allFlashcards = seedData.map(flashcard => ({
//   ...flashcard,
//   user_id: Math.floor(Math.random() * 3) + 1,
// }))

async function insertAndFindKeywords(arr) {
  console.warn('insert and find keywords')
  try {
    const savedFlashcardObjs = await Promise.all(
      arr.map(flashcard => new Flashcard(flashcard).save())
    )
    console.warn(savedFlashcardObjs)
    const allKeywords = await Promise.all(
      savedFlashcardObjs.map(flashcard =>
        getKeywordsForSeed(flashcard)
      )
    )
    console.warn(allKeywords)
    const keywordsArr = allKeywords.reduce((acc, val) => acc.concat(val), [])
    const justWords = keywordsArr.map(keyword => keyword.word)
    const upsertedKeywords = await Keyword.upsertSeveral(justWords)
    const merged = mergeObjs(keywordsArr, upsertedKeywords)
    const results = await associateKeywords(merged)
    console.log(results)
    process.exit()
  } catch (err) {
    console.log(err)
    throw new Error('problem happened when inserting the flashcards')
  }
}

function mergeObjs(arr1, arr2) {
  return arr1.map((obj, i) => {
    return {
      ...obj,
      ...arr2[i],
    }
  })
}

async function associateKeywords(keywords) {
  try {
    return await db.tx(t => {
      const queries = keywords.map(keyword => {
        return t.one(
          `
          INSERT INTO flashcards_keywords
          (kw_id, fc_id)
          VALUES ($1, $2)
          RETURNING *
        `,
          [keyword.id, keyword.fc_id]
        )
      })
      return t.batch(queries)
    })
  } catch (err) {
    console.log(err)
    throw new Error('error when trying to associate keywords')
  }
}

insertAndFindKeywords(seedData)
