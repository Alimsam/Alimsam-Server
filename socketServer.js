// var express = require('express');
// var router = express.Router();
const assert = require('assert');
var net = require('net');

var socket;

var server = net.createServer(function(s) {
  s.setEncoding('utf8');
  
  socket = s;

  console.log('socket connected');

  s.on('end', function() {
    console.log('socket disconnected');
  });

  s.on('error', function(err) {
    console.log('socket err: ' + err);
  });
});

exports.fingerStart = function(data, callback) {
  console.log('fingerStart 호출됨');

  socket.write(data, function(err) {
    assert.equal(err, null);

    socket.on('data', function(data) {
      console.log('get Data from client');

      console.log('data: ' + data);
      
      // string to json
      var jsonData = new Object();
      data = String(data).split(',');
      
      for(i in data) {
        splitData = String(data[i]).split(':');
        jsonData[splitData[0]] = splitData[1];
      }
  
      callback(jsonData);
    })
  });
}

server.listen(3300, function() {
  console.log('socket server listening\n');
});
