var express = require('express');
var router = express.Router();

var net = require('net');

var server = net.createServer(function(socket) {
  console.log('socket connected');

  socket.on('end', function() {
    console.log('socket disconnected');
  });

  socket.on('error', function(err) {
    console.log('socket err: ' + err);
  })

  router.get('/fingerStart', function(req, res, next) {
    const method = req.query.method;
    socket.write(method);
    res.redirect(`/${method}/fingerInputting`);
  });

  router.get('/fail', function(req, res, next) {
    /* 지문읽기 실패 다시시도 창 띄우기(팝업) */
  })
});


server.listen(3300, function() {
  console.log('socket server listening\n');
});
module.exports = router;
