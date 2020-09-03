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
    available: {
        type: Boolean,
        default: false,
        required: true
    },
    currentPrice: {
        type: String
    },
    minPrice: {
        type: String
    },
    maxPrice: {
        type: String
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

module.exports = model('Good', goodSchema);