const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

var db;
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  db = client.db(dbName);
 
  client.close();
});

exports.addFinger = function(finger, callback) {
  console.log('addFinger 호출됨');

  const fingerPrint = db.collection('fingerPrint');       // access fingerPirint collection

  fingerPrint.insertMany([{ "fingerId": finger.fingerId, "fingerData": finger.fingerData, "name": finger.name }], function(err, result) {
    assert.equal(err, null);    // err가 null일 경우 pass
    console.log('지문 데이터 추가 완료!');
    callback(result);
  });
}

exports.getName = function(fingerId, callback) {    // fingerData Or fingerId
  console.log('getFInger 호출됨');

  const fingerPrint = db.collection('fingerPrint');

  fingerPrint.find({ "fingerId": fingerId }).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("유저 탐색 성공!");
    callback(docs[0].name);     // 해당 지문 유저의 이름 callback
  });
}

exports.addOuting = function(outing, callback) {
  console.log('addOuting 호출됨');

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
    dd='0'+dd
  }
  if(mm<10) {
    mm='0'+mm
  }

  today = yyyy+'/'+mm+'/'+dd;

  const outing = db.collection('outing');

  outing.insertMany([{ "date":  today, }], function(err, result) {
    assert.equal(err, null);
    console.log('외출 데이터 추가 완료')
  })
}