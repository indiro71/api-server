const {Schema, model} = require('mongoose');

const priceSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    good: {
        type: Schema.Types.ObjectID,
        ref: 'Good',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Price', priceSchema);