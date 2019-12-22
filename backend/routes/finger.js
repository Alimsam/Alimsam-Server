var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('finger');
});

router.post('/request', function(req, res, next) {
  console.log(req.body);
  res.redirect('/finger');
});

module.exports = router;
