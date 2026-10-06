var express = require('express');
var router = express.Router();

const controller = require('../controllers/catways');

router.get('/', controller.getAll);
router.get('/:id', controller.getByNumber);
router.post('/', controller.add);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;