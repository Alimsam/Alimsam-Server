var express = require('express');
var router = express.Router();

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

var model = require('../model/DAO');
var socket = require('../socketServer');

router.get('/fingerStart', function(req, res, next) {
  // const dayOfWeek = moment().day();
  // if(dayOfWeek === 1 || dayOfWeek === 3) {            // 월요일이나 수요일 일 경우
  //   const minute = moment().format('HH:mm');
  //   if(minute >= '18:50' && minute <= '19:15') {
      socket.fingerStart('outing', function(recvData) {
        console.log('지문 데이터를 받음\n');
        
        const fingerSuccess = recvData.fingerSuccess;

        if(fingerSuccess == 'true') {
            const fingerId = recvData.fingerId;

            model.findFinger(fingerId, function(result) {     // 지문 컬렉션에서 이름 가져오기
              const name = result[0].name;
              const studentId = result[0].studentId;
              const classInfo = studentId.substring(0, 2);
        
              model.findIsOuting(fingerId, classInfo, function(result) {           // fingerId를 가진 사람이 외출을 신청했는가?
                if(result === 'notBack') {                                         // 현재 외출 중인 상태
                  model.addBackTime(fingerId, classInfo, function() {              // 귀가 시간 추가
                    // res.send('back');
                    res.send({ 'name': name, 'result': 'back' });
                  });
                } else if(result === 'back') {                                     // 외출 후 복귀 한 상태
                  model.reOuting(fingerId, classInfo, function(result) {
                    // res.send('out');
                    res.send({ 'name': name, 'result': 'out' });
                  });
                } else if(result === false) {                                      // 외출 신청을 안한 상태
                  model.addOuting(fingerId, studentId, name, classInfo, function(result) {            // 외출 컬렉션에 이름 추가
                    // res.send('out');
                    res.send({ 'name': name, 'result': 'out' });
                  });
                }
              });
            });
        } else {                                     // 지문 인식에 실패했을 경우
            res.send('false');
        }
      });
    // } else {
    //   res.send('timeUnable');
    // }
  // } else {                                            // 외출 신청이 불가능한 요일
  //   res.send('dateUnable');
  // }
});

router.get('/getOutingList', function(req, res, next) {
  const date = req.query.date;
  const classInfo = req.query.class;

  model.getOutingList(date, classInfo,
    function(result) {
        res.json(result);           // 외출 신청한 학생 목록을 넘겨줌  
    }
  );
});

module.exports = router;
