const { Schema, model } = require('mongoose');

const schema = new Schema({
    openApp: {
        type: Number,
        require: true,
    },
    completedTest: {
        type: Number,
        require: true
    },
    clickRegisterButton: {
        type: Number,
        require: true
    },
    countPublishedPosts: {
        type: Number,
        require: true
    },
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = model('Stats', schema);
