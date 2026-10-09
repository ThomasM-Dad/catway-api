const mongoose = require('mongoose');
const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

// Vérifie que le catway parent existe
async function ensureCatwayExists(catwayNumber) {
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
        throw new Error('catway_not_found');
    }
}

// Vrai si une autre réservation chevauche cette période sur ce catway
async function hasOverlap(catwayNumber, startDate, endDate, excludeId) {
    const filter = {
        catwayNumber,
        startDate: { $lt: endDate },
        endDate: { $gt: startDate }
    };
    if (excludeId) {
        filter._id = { $ne: excludeId };
    }
    return await Reservation.exists(filter);
}

async function findReservation(catwayNumber, idReservation) {
    if (!mongoose.isValidObjectId(idReservation)) {
        throw new Error('reservation_not_found');
    }
    const reservation = await Reservation.findOne({ _id: idReservation, catwayNumber })
    if (!reservation) {
        throw new Error('reservation_not_found');
    }
    return reservation;
}

exports.getAllByCatway = async (catwayNumber) => {
    await ensureCatwayExists(catwayNumber);
    return await Reservation.find({ catwayNumber });
}

exports.getById = async (catwayNumber, idReservation) => {
    await ensureCatwayExists(catwayNumber);
    return await findReservation(catwayNumber, idReservation);
}

exports.add = async (catwayNumber, data) => {
    await ensureCatwayExists(catwayNumber);

    const reservation = new Reservation({ ...data, catwayNumber });
    await reservation.validate();

    if (await hasOverlap(catwayNumber, reservation.startDate, reservation.endDate)) {
        throw new Error('reservation_overlap');
    }
    return await reservation.save();
}

exports.update = async (catwayNumber, idReservation, data) => {
    await ensureCatwayExists(catwayNumber);
    const reservation = await findReservation(catwayNumber, idReservation);

    // catwayNumber n'est pas modifiable, il vient de l'URL
    ['clientName', 'boatName', 'startDate', 'endDate'].forEach((key) => {
        if (!!data[key]) {
            reservation[key] = data[key];
        }
    });

    await reservation.validate();

    if (await hasOverlap(catwayNumber, reservation.startDate, reservation.endDate, reservation._id)) {
        throw new Error('reservation_overlap');
    }

    return await reservation.save();
}

exports.delete = async (catwayNumber, idReservation) => {
    await ensureCatwayExists(catwayNumber);
    const reservation = await findReservation(catwayNumber, idReservation);
    await reservation.deleteOne();
}