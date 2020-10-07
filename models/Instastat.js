const { Schema, model } = require('mongoose');

const instastatSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    stats: {
        type: Array
    }
});

module.exports = model('Instastat', instastatSchema);