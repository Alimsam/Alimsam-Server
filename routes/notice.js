var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

router.get('/addNotice', function(req, res, next) {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const content = req.query.content;
    const classInfo = req.query.class;
    
    model.addNotice(startDate, endDate, content, classInfo,
        function(result) {
            res.send('success');
        }
    );
});

router.get('/getNotice', function(req, res, next) {
    const startMonth = req.query.startMonth;
    const classInfo = req.query.class;

    model.getNoticeList(startMonth, classInfo, 
        function(result) {
            res.json(result);
        }
    );
});

module.exports = router;
