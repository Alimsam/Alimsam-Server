var express = require('express');
var router = express.Router();

var model = require('../model/DAO');

router.get('/fingerInputting', function(req, res, next) {
    res.send('Here is register router!');
});  

router.get('/fingerStart', function(req, res, next) {
    res.redirect('/finger/fingerStart?method=register')
});

router.post('/fingerSuccess', function(req, res, next) {
    const fingerSuccess = req.body.fingerSuccess;
    if(fingerSuccess == 'false') {
        res.redirect('/finger/reinput?method=register');      // 지문 다시 입력하기
    } else if(fingerSuccess == 'true') {
        const fingerId =  req.body.fingerId;
        /* 이름 입력 화면 렌딩(팝업) */
        /* const name = inputted name*/
        const finger = { 'fingerId': fingerId, 'name': '테스트' /* 'name': name */ };
        model.addFinger(finger, function() {        // 지문 컬렉션에 이름 및 지문 데이터 추가
            /* 지문 추가 완료 화면 렌딩 (팝업) */
            res.redirect('/');
        });
    } else if(fingerSuccess = 'already') {              // 이미 등록된 지문
        res.redirect('/');
    }
})

module.exports = router;
