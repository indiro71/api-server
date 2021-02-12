const { Schema, model, Types } = require('mongoose');

const instaPostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    },
    datePublish: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    published: {
        type: Boolean,
        default: false
    },
    profileId: {
        type: Types.ObjectId,
        ref: 'Instagram'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('InstaPost', instaPostSchema);