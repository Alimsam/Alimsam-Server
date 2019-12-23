var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('GET /finger');

  
});

router.get('/fingerStart', function(req, res, next) {
  res.json({fingerStart: true});
});

router.post('/fingerSuccess', function(req, res, next) {
  console.log('fingerSuccess: ' + req.body.fingerSuccess);
  console.log('fingerData:' + req.body.fingerData);

  if(fingerSuccess == 'true') {
    model.getName(fingerId, function(name) {     // 지문 컬렉션에서 이름 가져오기
      res.send(name+'님 ㅎㅇㄹ');
    });
    // 외출 혹은 자습이동 컬렉션에 이름 추가 
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
