var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

router.get('/fingerStart', function(req, res, next) {
    if(req.query.res === undefined) {
        const name = req.query.name;
        const studentId = req.query.studentId;

        res.redirect(`/finger/fingerStart?method=register&name=${name}&studentId=${studentId}`);
    }
});

router.post('/fingerSuccess', function(req, res, next) {
    const fingerSuccess = req.body.fingerSuccess;

    if(fingerSuccess == 'true') {
        const fingerId = req.body.fingerId;
        const studentId = req.body.studentId;
        const name = req.body.name;

        const finger = { 'fingerId': fingerId, 'studentId': studentId , 'name': name };

        model.addFinger(finger, function(result) {                // 지문 컬렉션에 이름 및 지문 데이터 추가
            res.send(fingerSuccess);    
        });
    } else {
        res.send(fingerSuccess);
    }
});

module.exports = router;
