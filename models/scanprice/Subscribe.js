const { Schema, model } = require('mongoose');

const subscribeSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    good: {
        type: Schema.Types.ObjectID,
        ref: 'Good',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: false
    },
    enabled: {
        type: Boolean,
        default: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Subscribe', subscribeSchema);