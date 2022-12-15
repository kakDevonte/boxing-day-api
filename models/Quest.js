const { Schema, model } = require('mongoose');

const schema = new Schema({
    number: {
        type: Number,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    correct: {
        type: Number,
        require: true
    },
    btn1: {
        type: String,
        require: true
    },
    btn2: {
        type: String,
        require: true
    },
    btn3: {
        type: String,
        require: true
    },
    btn4: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    titleWin: {
        type: String,
        require: true
    },
    titleLose: {
        type: String,
        require: true
    }
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = model('Quest', schema);
