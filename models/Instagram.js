const {Schema, model} = require('mongoose');

const instagramSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Instagram', instagramSchema);