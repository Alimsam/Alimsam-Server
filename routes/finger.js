var express = require('express');
var router = express.Router();

var model = require('../model/DAO');
var net = require('net');

var server = net.createServer(function(socket) {
  // socket.on('data', function(data) {  // 소켓에서 새 데이터를 받으면 발생하는 이벤트
  //     console.log(data.toString());
  // });
  router.get('/fingerStart', function(req, res, next) {
    const method = req.query.method;

    socket.write(method);
  });

  router.get('/reinput', function(req, res, next) {
    /* socket.write('reinput');        // 지문 재 입력 */
  });
});

router.post('/fingerAdd', function(req, res, next) {
  const fingerId = req.body.fingerId;
  const fingerData = req.body.fingerData;
  /* 이름 입력 화면 렌딩(팝업) */
  /* const name = inputted name*/
  const finger = { 'fingerId': fingerId, 'name': '테스트', /* 'name': name */ 'fingerData': fingerData };
  model.addFinger(finger, function() { });                  // 지문 컬렉션에 이름 및 지문 데이터 추가
  /* 지문 추가 완료 화면 렌딩 (팝업) */
  res.redirect('/');
});

server.listen(3300, function() {
  console.log('socket server listening\n');
});
module.exports = router;
