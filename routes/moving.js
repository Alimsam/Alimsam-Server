var express = require('express');
var router = express.Router();

var model = require('../model/DAO');
var socket = require('../socketServer');

router.get('/fingerStart', function(req, res, next) {
  const place = req.query.place;

  const sendData = "moving" + "," + place;

  socket.fingerStart(sendData, function(recvData) {
    console.log('지문 데이터를 받음');

    const fingerSuccess = recvData.fingerSuccess;

    if(fingerSuccess == 'true') {
        const fingerId = recvData.fingerId;

        model.findFinger(fingerId, function(result) {     // 지문 컬렉션에서 이름 가져오기
          const name = result[0].name;
          const classInfo = (result[0].studentId).substring(0, 2);

          const finger = { 'fingerId': fingerId, 'name': name };

          model.addMoving( finger, place, classInfo, function(result) {        // 외출 컬렉션에 이름 추가
            res.send(fingerSuccess);    
          });
        });
    } else {
        res.send(fingerSuccess);
    }
  });
});

router.get('/getMovingList', function(req, res, next) {
  const date = req.query.date;
  const classInfo = req.query.class;

  model.getMovingList(date, classInfo,
    function(result) {
      res.json(result);
    }
  );
})

module.exports = router;
