const { Schema, model } = require('mongoose');

const schema = new Schema({
  id: {
    type: Number,
    require: true,
    index: true,
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  tryCounter: {
    type: Number,
    require: true
  },
  listQuestionsAnswered: {
    type: Array,
    require: true
  },
  points: {
    type: Number,
    require: true
  },
  personalNumber: {
    type: Number,
    require: true
  },
  isAuth: {
    type: Boolean,
    require: true
  },
});

schema.set('toJSON', {
  virtuals: true
});

module.exports = model('User', schema);
