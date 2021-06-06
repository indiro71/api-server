const {Schema, model} = require('mongoose');

const goodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    shop: {
        type: Schema.Types.ObjectID,
        ref: 'Shop',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: false
    },
    available: {
        type: Boolean,
        default: false,
        required: true
    },
    currentPrice: {
        type: Number
    },
    minPrice: {
        type: Number
    },
    maxPrice: {
        type: Number
    },
    image: {
        type: String
    },
    enabled: {
        type: Boolean,
        default: true,
        required: true
    },
    dateCreate: {
        type: Date,
        default: Date.now
    },
    dateUpdate: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Good', goodSchema);