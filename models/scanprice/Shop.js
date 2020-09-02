const {Schema, model} = require('mongoose');

const shopSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    tagPrices: {
        type: Array,
        required: true
    },
    tagAvailable: {
        type: String
    },
    tagName: {
        type: String,
        required: true
    },
    methodRequest: {
        type: String,
        default: 'GET',
        required: true
    },
    useCookie: {
        type: Boolean,
        default: false,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Shop', shopSchema);