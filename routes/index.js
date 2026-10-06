var express = require('express');
var router = express.Router();

const userRoute = require('./users');
const catwayRoute = require('./catways');

router.get('/', function(req, res, next) {
  res.status(200).json({
    name : process.env.APP_NAME,
    version : '1.0',
    status : 200,
    message : 'Bievenue sur l\'API !'
  });
});

router.use('/users', userRoute);
router.use('/catways', catwayRoute);

module.exports = router;