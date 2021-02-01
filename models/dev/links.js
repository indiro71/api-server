const {Schema, model, Types} = require('mongoose');

const linkSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: false
    },
    shortLink: {
        type: String,
        required: true,
        unique: false
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        unique: false
    },
    active: {
        type: Boolean,
        default: true,
        unique: false
    },
    views: {
        type: Number,
        default: 0,
        unique: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Link', linkSchema);