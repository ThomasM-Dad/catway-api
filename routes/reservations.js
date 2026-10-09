var express = require('express');
// mergeParams : Permet de lire :id (le catwayNumber) défini dans le router parent
var router = express.Router({ mergeParams: true });

const controller = require('../controllers/reservations');

router.get('/', controller.getAll);
router.get('/:idReservation', controller.getById);
router.post('/', controller.add);
router.put('/:idReservation', controller.update);
router.delete('/:idReservation', controller.delete);

module.exports = router;