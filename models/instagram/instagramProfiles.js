const { Schema, model, Types } = require('mongoose');

const instagramSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    countSubscribe: {
        type: Number,
        default: 0
    },
    countUnSubscribe: {
        type: Number,
        default: 0
    },
    tagLikes: {
        type: Array
    },
    countLikes: {
        type: Number
    },
    active: {
        type: Boolean,
        default: true
    },
    tested: {
        type: Boolean,
        default: false
    },
    private: {
        type: Boolean,
        default: false
    },
    stats: {
        type: Array
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

module.exports = model('Instagram', instagramSchema);