var express = require('express');
var router = express.Router();
var net = require('net');

var socket;

var server = net.createServer(function(s) {
  s.setEncoding('utf8');

  socket = s
  
  console.log('socket connected');

  s.on('end', function() {
    console.log('socket disconnected');
  });

  s.on('error', function(err) {
    console.log('socket err: ' + err);
  });
});

router.get('/fingerStart', function(req, res, next) {
  const method = req.query.method;

  if(method === 'register') {
    const name = req.query.name;
    const studentId = req.query.studentId;

    data = method + "," + name + "," + studentId;
  } else if(method === 'moving') {
    const place = req.query.place;

    data = method + "," + place;
  } else if(method === 'outing') {
    data = method;
  }

  if(socket !== undefined) {
    socket.write(data);
  }
});

server.listen(3300, function() {
  console.log('socket server listening\n');
});

module.exports = router;