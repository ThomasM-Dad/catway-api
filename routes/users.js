var express = require('express');
var router = express.Router();

const service = require('../services/users');

router.get('/', service.getAll);
router.get('/:email', service.getByEmail);
router.post('/', service.add);
router.put('/:email', service.update);
router.delete('/:email', service.delete);

module.exports = router;