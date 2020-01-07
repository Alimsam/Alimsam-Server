var express = require('express');
var router = express.Router();

var model = require('../model/DAO');
var socket = require('../socketServer');

router.get('/fingerStart', function(req, res, next) {
  const place = req.query.place;

  socket.fingerStart('moving', function(recvData) {
    console.log('지문 데이터를 받음\n');
    
    const fingerSuccess = recvData.fingerSuccess;

    if(fingerSuccess == 'true') {
        const fingerId = recvData.fingerId;

        model.findFinger(fingerId, function(result) {                           // 지문 컬렉션에서 데이터 가져오기
          const name = result[0].name;
          const studentId = result[0].studentId;
          const classInfo = studentId.substring(0, 2);

          model.findIsMoving(fingerId, classInfo, function(result) {            // 이동중인지 확인
            if(result === true) {                                               // 이동중인 상태
              model.deleteExistMoving(fingerId, classInfo, function(result) {
                res.send({ 'name': name, 'result': 'back' });
              });
            } else if(result === false && place !== 'comeback') {                                     // 이동 신청을 하지 않은 상태
              model.addMoving(fingerId, studentId, name, place, classInfo, function(result) {        // 외출 컬렉션에 이름 추가
                res.send({ 'name': name, 'result': 'true' });
              });
            } else {
              res.send('notApply');
            }
          });
        });
    } else {                  // 지문 인식에 실패했을 경우
        res.send('false');
    }
  });
});

router.get('/getMovingList', function(req, res, next) {
  const date = req.query.date;
  const classInfo = req.query.class;

  model.getMovingList(date, classInfo,
    function(result) {
      res.json(result);               // 이동 신청한 학생 목록을 넘겨줌
    }
  );
})

module.exports = router;
