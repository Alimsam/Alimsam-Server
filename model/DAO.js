const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var db;
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("DataBase Connected successfully to server");
 
  db = client.db(dbName);
 
  client.close();
});

exports.addFinger = function(finger, callback) {
  console.log('addFinger 호출됨');

  const fingerPrint = db.collection('fingerPrint');       // access fingerPirint collection

  fingerPrint.insertMany([{ "fingerId": finger.fingerId, "fingerData": finger.fingerData, "name": finger.name }], 
    function(err, result) {
      assert.equal(err, null);    // err가 null일 경우 pass
      cosole.log('지문 데이터 추가 완료!');
      callback(result);
    }
  );
}

exports.findFinger = function(fingerId, callback) {    // fingerData Or fingerId
  console.log('getFInger 호출됨');

  const fingerPrint = db.collection('fingerPrint');

  fingerPrint.find({ "fingerId": fingerId }).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("유저 탐색 성공!");
    callback(docs);     // 해당 지문 유저의 이름 callback
  });
}

exports.findOuting = function(date, callback) {
  console.log('findOuting 호출됨');
  
  const outing = db.collection('outing');
  
  outing.find({'date': date}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  })
}

exports.findIsOuting = function(fingerId, callback) {
  console.log('findOuting 호출됨');

  const outing = db.collection('outing');
  
  const date = moment().format('YYYY-MM-DD');

  outing.find({'date': date, 'outingData.fingerId': fingerId }).toArray(function(err, docs) {
    assert.equal(err, null);
    if(docs.length > 0) {         // 외출 신청을 한 사람이라면
      callback(true);
    } else {
      callback(false);
    }
  })
}

exports.addBackTime = function(fingerId, callback) {
  console.log('addBackTime 호출됨');

  const outing = db.collection('outing');

  var backTime = moment().format('hh:mm');
  
  outing.update({ 'date': date, 'outingData.fingerId': fingerId }, {$set: {'backTime': backTime } }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('귀가 시간 추가 완료');
      callback(result);
    }
  );
}

exports.addOuting = function(finger, callback) {
  console.log('addOuting 호출됨');
  
  const outing = db.collection('outing');

  const date = moment().format('YYYY-MM-DD');
  var dayOfWeek = moment.day();

  if(dayOfWeek === 1 || dayOfWeek === 3) {
    const outingData = { 'name': finger.name, 'fingerId': finger.fingerId, 'outTime': outTime, 'comebackTime': '' };
    
    outing.update({ 'date':  date }, { $push: { 'outingData': outingData }},
      function(err, result) {
        assert.equal(err, null);
        console.log('외출 데이터 추가 완료');
        callback(result);
      }
    );
  } else {
    // 외출 가능한 요일이 아닙니다.
  }
}