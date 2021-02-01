const { Schema, model, Types } = require('mongoose');

const noteSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        unique: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Note', noteSchema);