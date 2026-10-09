var express = require('express');
var router = express.Router();

const controller = require('../controllers/catways');
const reservationRoute = require('./reservations');

router.get('/', controller.getAll);
router.get('/:id', controller.getByNumber);
router.post('/', controller.add);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

router.use('/:id/reservations', reservationRoute);

module.exports = router;