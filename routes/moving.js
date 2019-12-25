var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

router.get('/fingerStart', function(req, res, next) {
  res.redirect('/finger/fingerStart?method=moving')
});

router.post('/fingerSuccess', function(req, res, next) {
  const fingerSuccess = req.body.fingerSuccess

  if(fingerSuccess === 'false') {
    res.redirect('/finger/reinput');      // 지문 다시 입력하기
  } else if(fingerSuccess == 'true') {
    const fingerId = req.body.fingerId;

    if(fingerSuccess == 'true') {
      model.findFinger(fingerId, function(result) {     // 지문 컬렉션에서 이름 가져오기
        const name = result[0].name    
        const finger = { 'fingerId': fingerId, 'name': name };
        /* 이동 장소 팝업창 */
        /* const place = inputtedPlace; */
        model.addMoving( finger, '3층 홈베이스' /*place': place*/ , function(result) { });  // 외출 컬렉션에 이름 추가
      });
    }
    res.send('/');
  } else {
    console.log('fingerSuccess: ' + fingerSuccess);
    res.redirect('/');
  }
});

module.exports = router;
