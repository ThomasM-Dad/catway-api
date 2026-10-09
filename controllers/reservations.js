const reservation = require('../models/reservation');
const reservationService = require('../services/reservations');

// Traduit les erreurs métier du service en réponses HTTP
function handleError(res, error, defaultStatus) {
    switch (error.message) {
        case 'catway_not_found':
            return res.status(404).json({ message: 'Catway introuvable' });
        case 'reservation_not_found':
            return res.status(404).json({ message: 'Réservation introuvable' });
        case 'reservation_overlap':
            return res.status(409).json({ message: 'Ce catway est déjà réservé sur cette période' });
        default:
            return res.status(defaultStatus).json({ message: error.message });
    }
}

exports.getAll = async (req, res) => {
    try {
        const reservations = await reservationService.getAllByCatway(Number(req.params.id));
        return res.status(200).json(reservations);
    } catch (error) {
        return handleError(res, error, 500);
    }
}

exports.getById = async (req, res) => {
    try {
        const reservation = await reservationService.getById(Number(req.params.id), req.params.idReservation);
        return res.status(200).json(reservation);
    } catch (error) {
        return handleError(res, error, 500);
    }
}

exports.add = async (req, res) => {
    try {
        const data = {
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        };
        const reservation = await reservationService.add(Number(req.params.id), data);
        return res.status(201).json(reservation);
    } catch (error) {
        return handleError(res, error, 400);
    }
}

exports.update = async (req, res) => {
    try {
        const data = {
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        };
        const reservation = await reservationService.update(Number(req.params.id), req.params.idReservation, data);
        return res.status(200).json(reservation);
    } catch (error) {
        return handleError(res, error, 400);
    }
}

exports.delete = async (req, res) => {
    try {
        await reservationService.delete(Number(req.params.id), req.params.idReservation);
        return res.status(204).send();
    } catch (error) {
        return handleError(res, error, 500);
    }
}