var express = require('express');
var router = express.Router();

var model = require('../model/DAO');
var socket = require('../socketServer');

router.get('/fingerStart', function(req, res, next) {
    const name = req.query.name;
    const studentId = req.query.studentID;

    model.existFinger(studentId, 
        function(result) {
            if(result === true) {                       // 이미 지문 데이터가 등록 되어있는 경우
                res.send('already');
            } else if(result === false) {            
                socket.fingerStart('register', function(recvData) {                           // 소켓으로 라즈베리 파이에 데이터를 보내고 callback으로 데이터를 받음
                    console.log('지문 데이터를 받음\n');

                    const fingerSuccess = recvData.fingerSuccess;                             // 지문 읽기 성공 여부

                    if(fingerSuccess === 'true') {
                        const fingerId = recvData.fingerId;
                        
                        const finger = { 'fingerId': fingerId, 'studentId': studentId , 'name': name };

                        model.addFinger(finger, function(result) {                // 지문 컬렉션에 이름 및 지문 데이터 추가
                            res.send('true');
                            // res.send({ 'name': name, 'result': 'true' });
                        });
                    } else {
                        res.send('false');                                        // 지문 등록에 실패한 경우
                    }
                });
            }
        }
    );
});

module.exports = router;
