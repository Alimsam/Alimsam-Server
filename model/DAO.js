const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'Alimsam_DB';

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var db;
// Use connect method to connect to the server
MongoClient.connect(url, {useUnifiedTopology:true}, 
  function(err, client) {
    assert.equal(null, err);
    console.log("DataBase Connected successfully to server\n");

    db = client.db(dbName);
  }
);






exports.addFinger = function(finger, callback) {
  console.log('addFinger 호출됨\n');

  const fingerPrint = db.collection('fingerPrint');       // access fingerPirint collection

  fingerPrint.insertMany([{ "fingerId": finger.fingerId, "name": finger.name }], 
    function(err, result) {
      assert.equal(err, null);    // err가 null일 경우 pass
      console.log('지문 데이터 추가 완료!\n');
      callback(result);
    }
  );
}

exports.findFinger = function(fingerId, callback) {    // fingerData Or fingerId
  console.log('findFinger 호출됨\n');

  const fingerPrint = db.collection('fingerPrint');

  fingerPrint.find({ "fingerId": fingerId }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('유저 탐색 성공!\n');
      callback(docs);     // 해당 지문 유저의 이름 callback
    }
  );
}









exports.findIsOuting = function(fingerId, callback) {
  console.log('findIsOuting 호출됨\n');

  const outing = db.collection('outing');
  
  const date = moment().format('YYYY-MM-DD');

  outing.find({'date': date, 'outingData.fingerId': fingerId }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('외출 유무 확인 완료!\n')
      if(docs.length > 0) {         // 외출 신청을 한 사람이라면
        callback(true);
      } else {
        callback(false);
      }
    }
  );
}

exports.addBackTime = function(fingerId, callback) {
  console.log('addBackTime 호출됨\n');

  const outing = db.collection('outing');
  const date = moment().format('YYYY-MM-DD');
  const backTime = moment().format('hh:mm');
  
  outing.updateOne({ 'date': date, 'outingData.fingerId': fingerId }, {$set: {'outingData.$.backTime': backTime } }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('귀가 시간 추가 완료\n');
      callback(result);
    }
  );
}

exports.addOuting = function(finger, callback) {
  console.log('addOuting 호출됨\n');
  
  const outing = db.collection('outing');
  const date = moment().format('YYYY-MM-DD');
  const outTime = moment().format('hh:mm');

  const outingData = { 'name': finger.name, 'fingerId': finger.fingerId, 'outTime': outTime, 'backTime': '' };
  
  outing.updateOne({ 'date':  date }, { $push: { 'outingData': outingData }}, { upsert : true }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('외출 데이터 추가 완료\n');
      callback(result);
    }
  );
}

exports.getOutingList = function(date, callback) {
  console.log('getOutingList 호출됨\n');

  const outing = db.collection('outing');

  outing.find({ 'date': date }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('외출 데이터 추출완료!\n');
      callback(docs);
    }
  );
}






exports.addMoving = function(finger, place, callback) {
  console.log('addMoving 호출됨\n');
  
  const moving = db.collection('moving');

  const date = moment().format('YYYY-MM-DD');

  const movingData = { 'name': finger.name, 'fingerId': finger.fingerId, 'place': place };
  
  moving.updateOne({ 'date':  date }, { $push: { 'movingData': movingData }}, { upsert : true }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('이동 데이터 추가 완료\n');
      callback(result);
    }
  );
}

exports.getMovingList = function(date, callback) {
  console.log('getMovingList 호출됨\n');

  const moving = db.collection('moving');

  moving.find({ 'date': date }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('이동 데이터 추출완료!\n');
      callback(docs);
    }
  );
}