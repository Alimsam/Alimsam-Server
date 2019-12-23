var express = require('express');
var router = express.Router();

var schoolInfo = require('../model/schoolInfo');

router.get('/', function(req, res, next) {
  res.send('Hello World');
})

router.get('/meal', function(req, res, next) {
  console.log('GET /meal');
  const year = String(req.query.year);
  const month = String(req.query.month);
  schoolInfo.getMeal(year, month, function(meal) {
    res.json(meal);
  });
});

router.get('/calendar', function(req, res, next) {
  console.log('GET /calendar');
  const year = String(req.query.year);
  const month = String(req.query.month);
  schoolInfo.getCalendar(year, month, function(calendar) {
    res.json(calendar);
  });
});

module.exports = router;