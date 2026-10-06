const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Catway = new Schema({
    catwayNumber: {
        type: Number,
        required: [true, 'Le numéro de catway est requis'],
        unique: true
    },
    catwayType: {
        type: String,
        required: [true, 'Le type de catway est requis'],
        enum: {
            values: ['long', 'short'],
            message: 'Le type doit être "long" ou "short"'
        }
    },
    catwayState: {
        type: String,
        required: [true, 'L\'état du catway est requis'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Catway', Catway);