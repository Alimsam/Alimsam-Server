var express = require('express');
var router = express.Router();

var model = require('../model/DAO');
var socket = require('../socketServer');

router.get('/fingerStart', function(req, res, next) {
    const name = req.query.name;
    const studentId = req.query.studentID;

    const sendData = "register" + "," + name + "," + studentId;

    socket.fingerStart(sendData, function(recvData) {
        console.log('지문 데이터를 받음');

        const fingerSuccess = recvData.fingerSuccess;

        if(fingerSuccess == 'true') {
            const fingerId = recvData.fingerId;
            const studentId = recvData.studentId;
            const name = recvData.name;

            const finger = { 'fingerId': fingerId, 'studentId': studentId , 'name': name };

            model.addFinger(finger, function(result) {                // 지문 컬렉션에 이름 및 지문 데이터 추가
                res.send(fingerSuccess);    
            });
        } else {
            res.send(fingerSuccess);
        }
    });
});

module.exports = router;
