var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/fingerStart', function(req, res, next) {
  res.redirect('/finger/fingerStart?method=moving')
});

module.exports = router;
