var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

router.options('/fingerStart', function(req, res, next) {
  const place = req.query.place;

  res.redirect(`/finger/fingerStart?method=moving&place=${place}`)
});

router.post('/fingerSuccess', function(req, res, next) {
  const fingerSuccess = req.body.fingerSuccess

  if(fingerSuccess == 'true') {
    const fingerId = req.body.fingerId;
    const place = req.body.place;

    model.findFinger(fingerId, function(result) {     // 지문 컬렉션에서 이름 가져오기
      const name = result[0].name    
      const finger = { 'fingerId': fingerId, 'name': name };

      model.addMoving( finger, place , function(result) {        // 외출 컬렉션에 이름 추가
        res.json({ 'success': fingerSuccess });
      });
    });
  } else {
    res.json({ 'success': fingerSuccess });
  }
});

router.get('/getMovingList', function(req, res, next) {
  const date = req.query.date;

  model.getMovingList(date, 
    function(result) {
      const movingList = result[0].movingData;

      res.json(movingList);
    }
  );
})

module.exports = router;
