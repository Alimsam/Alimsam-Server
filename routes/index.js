var express = require('express');
var router = express.Router();

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.get('/', function(req, res, next) {
  const min = moment().format('HH:mm'); // Number
  res.send(min > '14:5');
});

module.exports = router;
