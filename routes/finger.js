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
    socket.write('reinput');
  });
});

server.listen(3300, function() {
  console.log('socket server listening');
});
module.exports = router;
