const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reservation = new Schema({
    catwayNumber: {
        type: Number,
        required: [true, 'Le numéro de catway est requis']
    },
    clientName: {
        type: String,
        trim: true,
        required: [true, 'Le nom du client est requis']
    },
    boatName: {
        type: String,
        trim: true,
        required: [true, 'Le nom du bateau est requis']
    },
    startDate: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise'],
        validate: {
            validator: function (value) {
                return !this.startDate || value > this.startDate;
            },
            message: 'La date de fin doit être postérieure à la date de début'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', Reservation);