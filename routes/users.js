var express = require('express');
var router = express.Router();

const controller = require('../controllers/users');

router.get('/', controller.getAll);
router.get('/:email', controller.getByEmail);
router.post('/', controller.add);
router.put('/:email', controller.update);
router.delete('/:email', controller.delete);

module.exports = router;