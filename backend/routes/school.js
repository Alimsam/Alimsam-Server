var express = require('express');
var router = express.Router();

var schoolInfo = require('../model/schoolInfo');

router.get('/', function(req, res, next) {
  schoolInfo.getMealAndCalendar('2019', '12', function(meal, calendar) {
    res.send(meal);
    // res.send(calendar);
  });
});

module.exports = router;