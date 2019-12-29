const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'Alimsam_DB';

var db;
// Use connect method to connect to the server
MongoClient.connect(url, {useUnifiedTopology:true}, 
  function(err, client) {
    assert.equal(null, err);
    console.log("DataBase Connected successfully to server\n");

    db = client.db(dbName);
  }
);



/**
 * finger DAO
 */
exports.addFinger = function(finger, callback) {
  console.log('addFinger 호출됨\n');
  
  const fingerPrint = db.collection('fingerPrint');       // access fingerPirint collection

  fingerPrint.insertMany([{ "fingerId": finger.fingerId, "studentId": finger.studentId, "name": finger.name }], 
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







/**
 * moving DAO
 */
exports.addMoving = function(finger, place, classInfo, callback) {
  console.log('addMoving 호출됨\n');
  
  const moving = db.collection('moving');

  const date = moment().format('YYYY-MM-DD');
  const movingData = { 'name': finger.name, 'fingerId': finger.fingerId, 'place': place };
  
  classInfo = 'movingData_' + classInfo;

  moving.updateOne({ 'date':  date }, { $push: { [classInfo]: movingData }}, { upsert : true }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('이동 데이터 추가 완료\n');
      callback(result);
    }
  );
}

exports.getMovingList = function(date, classInfo, callback) {
  console.log('getMovingList 호출됨\n');

  const moving = db.collection('moving');

  const movingData = `movingData_${classInfo}`;

  moving.find({ 'date': date }, { projection:{ [movingData]: 1, _id: 0 } }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('이동 데이터 추출완료!\n');
      callback(docs[0][movingData]);
    }
  );
}







/**
 * outing DAO
 */

exports.findIsOuting = function(fingerId, classInfo, callback) {
  console.log('findIsOuting 호출됨\n');

  const outing = db.collection('outing');
  
  const date = moment().format('YYYY-MM-DD');

  const outingData = 'outingData_' + classInfo;

  outing.find({ 'date': date, [`${outingData}.fingerId`]: fingerId }).toArray(
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

exports.addBackTime = function(fingerId, classInfo, callback) {
  console.log('addBackTime 호출됨\n');

  const outing = db.collection('outing');
  const date = moment().format('YYYY-MM-DD');
  const backTime = moment().format('hh:mm');
  
  const outingData = 'outingData_' + classInfo;

  outing.updateOne({ 'date': date, [`${outingData}.fingerId`]: fingerId }, {$set: {[`${outingData}.$.backTime`]: backTime } }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('귀가 시간 추가 완료\n');
      callback(result);
    }
  );
}

exports.addOuting = function(finger, classInfo, callback) {
  console.log('addOuting 호출됨\n');
  
  const outing = db.collection('outing');
  const date = moment().format('YYYY-MM-DD');
  const outTime = moment().format('hh:mm');

  classInfo = 'outingData_' + classInfo;

  const outingData = { 'name': finger.name, 'fingerId': finger.fingerId, 'outTime': outTime, 'backTime': '' };
  
  outing.updateOne({ 'date':  date }, { $push: { [classInfo]: outingData }}, { upsert : true }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('외출 데이터 추가 완료\n');
      callback(result);
    }
  );
}

exports.getOutingList = function(date, classInfo, callback) {
  console.log('getOutingList 호출됨\n');

  const outing = db.collection('outing');

  const outingData = `outingData_${classInfo}`;

  outing.find({ 'date': date }, { projection:{ [outingData]: 1, _id: 0 } }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('외출 데이터 추출완료!\n');
      callback(docs[0][outingData]);
    }
  );
}








/**
 * notice DAO
 */
exports.addNotice = function(startDate, endDate, content, classInfo, callback) {
  console.log('addNotice 호출됨\n');

  const notice = db.collection('notice');

  const startMonth = moment(startDate).format('YYYY-MM');

  classInfo = 'noticeData_' + classInfo;
  const noticeData = { 'startDate':  startDate, 'endDate': endDate, 'content': content };

  notice.updateOne({ 'startMonth':  startMonth }, { $push: { [classInfo]: noticeData }}, { upsert : true }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('공지사항 추가 완료');
      callback(result);
    }
  );
}

exports.getNoticeList = function(startMonth, classInfo, callback) {
  console.log('getNoticeList 호출됨\n');

  const notice = db.collection('notice');

  const noticeData = `noticeData_${classInfo}`;

  notice.find({ 'startMonth': startMonth }, { projection:{ [noticeData]: 1, _id: 0 } }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('공지사항 데이터 추출완료!\n');
      callback(docs[0][noticeData]);
    }
  );
}