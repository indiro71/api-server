const {Schema, model} = require('mongoose');

const settingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String
    },
    type: {
        type: String
    }
});

module.exports = model('Setting', settingSchema);