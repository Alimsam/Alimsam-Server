var express = require('express');
var router = express.Router();

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var model = require('../model/DAO');

router.get('/fingerStart', function(req, res, next) {
  const dayOfWeek = moment().day();

  // if(dayOfWeek === 1 || dayOfWeek === 3) {            // 월요일이나 수요일 일 경우
  res.redirect(`/finger/fingerStart?method=outing`);
  // } else {                                            // 외출 신청이 불가능한 요일
    // res.redirect('/outing/unable');
  // }
});

router.post('/fingerSuccess', function(req, res, next) {
  const fingerSuccess = req.body.fingerSuccess

  if(fingerSuccess == 'true') {
    const fingerId = req.body.fingerId;

    model.findFinger(fingerId, function(result) {     // 지문 컬렉션에서 이름 가져오기
      const name = result[0].name;
      const classInfo = (result[0].studentId).substring(0, 2);

      model.findIsOuting(fingerId, classInfo, function(result) {           // fingerId를 가진 사람이 외출을 신청했는가?
        if(result === true) {                                   // 외출 신청을 한 사람이라면
          model.addBackTime(fingerId, classInfo, function() {              // 귀가 시간 추가
            res.json({ 'success': fingerSuccess });
          });
        } else if(result === false) {
          const finger = { 'name': name, 'fingerId': fingerId };

          model.addOuting( finger, classInfo, function(result) {          // 외출 컬렉션에 이름 추가
            res.json({ 'success': fingerSuccess });
          });
        }
      });
    });
  } else {
    res.json({ 'success': fingerSuccess });
  }
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
