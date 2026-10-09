var express = require('express');
var router = express.Router();

const userRoute = require('./users');
const catwayRoute = require('./catways');
const authRoute = require('./auth');
const auth = require('../middlewares/auth');

router.get('/', function(req, res, next) {
  res.status(200).json({
    name : process.env.APP_NAME,
    version : '1.0',
    status : 200,
    message : 'Bievenue sur l\'API !'
  });
});

router.use('/', authRoute); // /login et /logout restent publics
router.use('/users', auth, userRoute); // protégé
router.use('/catways', auth, catwayRoute); // protégé (réservations incluses)

module.exports = router;