var express = require('express');
var router = express.Router();

var schoolInfo = require('../model/schoolInfo');

router.options('/meal', function(req, res, next) {
  const year = String(req.query.year);
  const month = String(req.query.month);
  schoolInfo.getMeal(year, month, function(meal) {
    res.json(meal);
  });
});

router.options('/calendar', function(req, res, next) {
  const year = String(req.query.year);
  const month = String(req.query.month);
  schoolInfo.getCalendar(year, month, function(calendar) {
    res.json(calendar);
  });
});

module.exports = router;