module.exports = [
  {
    key: 'id',
    type: 'number',
    optional: true
  }, {
    key: 'question',
    type: 'string'
  }, {
    key: 'answer',
    type: 'string'
  }, {
    key: 'category',
    type: 'string',
    otherCondition: cat => cat.length < 255,
    otherConditionMessage: 'category length cannot be longer than 255 characters'
  }, {
    key: 'difficulty',
    type: 'number'
  }, {
    key: 'user_id',
    type: 'number',
    optional: true
  }
]