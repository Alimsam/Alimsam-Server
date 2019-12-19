var express = require('express');
var router = express.Router();

var schoolInfo = require('../model/schoolInfo');

router.get('/', function(req, res, next) {
  schoolInfo.getMealAndCalendar('2019', '12', function(meal, calendar) {
    res.render('school', {meal: meal, calendar: calendar});
  });
});

module.exports = router;