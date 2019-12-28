var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

router.get('/addNotice', function(req, res, next) {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const content = req.query.content;

    model.addNotice(startDate, endDate, content, 
        function(result) {
            res.send('success');
        }
    );
});

module.exports = router;
