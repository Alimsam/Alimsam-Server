var express = require('express');
var router = express.Router();

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var model = require('../model/DAO');
var socket = require('../socketServer');

router.get('/fingerStart', function(req, res, next) {
  const dayOfWeek = moment().day();

  // if(dayOfWeek === 1 || dayOfWeek === 3) {            // 월요일이나 수요일 일 경우
    const sendData = "outing";

    socket.fingerStart(sendData, function(recvData) {
      console.log('지문 데이터를 받음');

      const fingerSuccess = recvData.fingerSuccess;

      if(fingerSuccess == 'true') {
          const fingerId = recvData.fingerId;

          model.findFinger(fingerId, function(result) {     // 지문 컬렉션에서 이름 가져오기
            const name = result[0].name;
            const classInfo = (result[0].studentId).substring(0, 2);
      
            model.findIsOuting(fingerId, classInfo, function(result) {           // fingerId를 가진 사람이 외출을 신청했는가?
              if(result === true) {                                              // 외출 신청을 한 사람이라면
                model.addBackTime(fingerId, classInfo, function() {              // 귀가 시간 추가
                  res.send(fingerSuccess);
                });
              } else if(result === false) {
                const finger = { 'name': name, 'fingerId': fingerId };
      
                model.addOuting(finger, classInfo, function(result) {            // 외출 컬렉션에 이름 추가
                  res.send(fingerSuccess);
                });
              }
            });
          });
      } else {
          res.send(fingerSuccess);
      }
    });
  // } else {                                            // 외출 신청이 불가능한 요일
    // res.send('unable');
  // }
});

router.get('/getOutingList', function(req, res, next) {
  const date = req.query.date;
  const classInfo = req.query.class;

  model.getOutingList(date, classInfo,
    function(result) {
        res.json(result);
    }
  );
});

module.exports = router;
