var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

/* GET home page. */
router.get('/', function(req, res, next) {

});

router.get('/fingerStart', function(req, res, next) {
  const method = req.query.method;

  res.end(method);
});


module.exports = router;
