var express = require('express');
var router = express.Router();

const controller = require('../controllers/auth');
const auth = require ('../middlewares/auth');

router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.get('/me', auth, controller.me); // protégé : il faut un token valide

module.exports = router;