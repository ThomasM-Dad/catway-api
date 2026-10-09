var express = require('express');
var router = express.Router();

const controller = require('../controllers/auth');

router.post('/login', controller.login);
router.get('/logout', controller.logout);

module.exports = router;