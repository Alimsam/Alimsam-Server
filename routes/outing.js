var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

router.get('/', function(req, res, next) {
  res.send('Here is outing router');
});

router.get('/fingerStart', function(req, res, next) {
  res.redirect('/finger/fingerStart?method=outing')
});

router.post('/fingerSuccess', function(req, res, next) {
  const fingerSuccess = req.body.fingerSuccess

  if(fingerSuccess == 'false') {
    console.log()
    res.redirect('/outing/reinput');
  }

  const fingerData = req.body.fingerData;
  const fingerId = req.body.fingerId;

  console.log('fingerSuceess: ' + fingerSuccess);
  console.log('fingerData: ' + fingerData);
  console.log('fingerId: ' + fingerId);

  if(fingerSuccess == 'true') {
    model.findFinger(fingerId, function(result) {     // 지문 컬렉션에서 이름 가져오기
      
      //reuslt[0].name

      model.findIsOuting(fingerId, function(result) {                       // fingerId를 가진 사람이 외출을 신청했는가?
        if(result === true) {       // 외출 신청을 한 사람이라면
          model.addBackTime(fingerId, function() {    // 귀가 시간 추가
            
          });
        } else {
          // 외출 컬렉션에 이름 추가
        }
      });
    });
  } else if(fingerSuccess == 'false') { 
    // 다시 지문 입력하기 랜딩(팝업)
  } else if(fingerSuccess == 'add') {
    // 이름 입력 화면 렌딩(팝업)
    model.addFinger(finger);      // 지문 컬렉션에 이름 및 지문 데이터 추가
                                  // finger has fingerId, fingerData, name
    // 지문 추가 완료 화면 렌딩 (팝업)
  }
});

module.exports = router;
