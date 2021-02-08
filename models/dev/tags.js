const { Schema, model } = require('mongoose');

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('tag', tagSchema);