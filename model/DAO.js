const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'Alimsam_DB';

var db;
var moving;
var fingerPrint;
var outing;
var notice;

// Use connect method to connect to the server
MongoClient.connect(url, {useUnifiedTopology:true}, 
  function(err, client) {
    assert.equal(null, err);
    console.log('DataBase Connected successfully to server\n');

    db = client.db(dbName);
    
    moving = db.collection('moving');
    fingerPrint = db.collection('fingerPrint');
    outing = db.collection('outing');
    notice = db.collection('notice');
  }
);





/**
 * finger DAO
 */
exports.addFinger = function(finger, callback) {
  console.log('addFinger 호출됨\n');
  
  fingerPrint.insertMany([{ 'fingerId': finger.fingerId, 'studentId': finger.studentId, 'name': finger.name }], 
    function(err, result) {
      assert.equal(err, null);                          // err가 null일 경우 pass
      console.log('지문 데이터 추가 완료!\n');
      callback(result);
    }
  );
}

exports.findFinger = function(fingerId, callback) {    // fingerData Or fingerId
  console.log('findFinger 호출됨\n');

  fingerPrint.find({ 'fingerId': fingerId }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('유저 탐색 성공!\n');
      callback(docs);     // 해당 지문 유저의 이름 callback
    }
  );
}

exports.existFinger = function(studentId, callback) {
  console.log('existFinger 호출됨\n');

  fingerPrint.find({ 'studentId': studentId }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('유저 검색 완료');
      if(docs.length > 0) {
        callback(true);
      } else {
        callback(false);
      }
    }
  );
}










/**
 * moving DAO
 */
exports.findIsMoving = function(fingerId, classInfo, callback) {
  console.log('existMoving 호출됨\n');

  const date = moment().format('YYYY-MM-DD');
  classInfo = `movingData_${classInfo}`;

  moving.find({ 'date': date }, { projection: { [classInfo]: { $elemMatch: { 'fingerId': fingerId } }, '_id': false } } ).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('이동 유무 확인 완료\n');

      if(docs.length <= 0 || docs[0][classInfo] === undefined) {                           // 이동을 안한 경우
        callback(false);
      } else {
        callback(true);
      }
    }
  );
}

exports.addMoving = function(fingerId, studentId, name, place, classInfo, callback) {
  console.log('addMoving 호출됨\n');
  
  const date = moment().format('YYYY-MM-DD');
  
  classInfo = 'movingData_' + classInfo;

  const movingData = { 'studentId': studentId, 'name': name, 'fingerId': fingerId, 'place': place };

  moving.updateOne({ 'date':  date }, { $push: { [classInfo]: movingData }}, { upsert : true }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('이동 데이터 추가 완료\n');
      callback(result);
    }
  );
}

exports.deleteExistMoving = function(fingerId, classInfo, callback) {
  console.log('deleteExistMoving 호출됨\n');

  const date = moment().format('YYYY-MM-DD');

  classInfo = 'movingData_' + classInfo;

  moving.updateOne({'date': date}, { $pull : { [classInfo]: { 'fingerId': fingerId } } }, {multi: true}, 
    function(err, result) {
      assert.equal(err, null);
      console.log('이동 복귀 완료\n');
      callback(result);
    }
  );
}

exports.getMovingList = function(date, classInfo, callback) {
  console.log('getMovingList 호출됨\n');

  classInfo = `movingData_${classInfo}`;

  moving.find({ 'date': date }, { projection:{ [classInfo]: 1, _id: 0 } }).sort({ 'studentId': 1 }).toArray(                // 해당 날짜의 document에서 movingData List만 추출함
    function(err, docs) {
      assert.equal(err, null);
      console.log('이동 데이터 추출완료!\n');
      if(docs[0] === undefined) {                   // 이동 데이터가 비어있다.
        callback(docs)
      } else {
        docs[0][classInfo].sort(function (a, b) { 
          return a.studentId < b.studentId ? -1 : 1;  
        });
        callback(docs[0][classInfo]);
      }
    }
  );
}









/**
 * outing DAO
 */

exports.findIsOuting = function(fingerId, classInfo, callback) {
  console.log('findIsOuting 호출됨\n');
  
  const date = moment().format('YYYY-MM-DD');
  classInfo = 'outingData_' + classInfo;

  outing.find({ 'date': date }, { projection: { [classInfo]: { $elemMatch: { 'fingerId': fingerId } }, '_id': false } } ).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('외출 유무 확인 완료!\n');

      // console.log(docs.length);

      if(docs.length <= 0 || !Object.keys(docs[0]).length) {        // 외출을 안한 경우
        callback(false);
      } else if(docs[0][classInfo][0].backTime !== '') {            // 복귀를 한 경우
        callback('back');
      } else if(docs[0][classInfo][0].backTime === '') {            // 복귀를 안한 경우
        callback('notBack');
      }
    }
  );
}

exports.addOuting = function(fingerId, studentId, name, classInfo, callback) {
  console.log('addOuting 호출됨\n');
  
  const date = moment().format('YYYY-MM-DD');
  const outTime = moment().format('HH:mm');
  
  classInfo = 'outingData_' + classInfo;
  
  const outingData = { 'studentId': studentId, 'name': name, 'fingerId': fingerId, 'outTime': outTime, 'backTime': '' };
  
  outing.updateOne({ 'date':  date }, { $push: { [classInfo]: outingData }}, { upsert : true }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('외출 데이터 추가 완료\n');
      callback(result);
    }
  );
}

exports.reOuting = function(fingerId, classInfo, callback) {
  console.log('deleteBackTime 호출됨\n');

  const date = moment().format('YYYY-MM-DD');
  const outTime = moment().format('HH:mm');

  classInfo = 'outingData_' + classInfo;
  
  outing.updateOne({ 'date': date, [`${classInfo}.fingerId`]: fingerId }, { $set: { [`${classInfo}.$.outTime`]: outTime, [`${classInfo}.$.backTime`]: '' } }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('재외출 신청 완료\n');
      callback(result);
    }
  );
}

exports.addBackTime = function(fingerId, classInfo, callback) {
  console.log('addBackTime 호출됨\n');
  
  const date = moment().format('YYYY-MM-DD');
  const backTime = moment().format('HH:mm');
  
  classInfo = 'outingData_' + classInfo;

  outing.updateOne({ 'date': date, [`${classInfo}.fingerId`]: fingerId }, { $set: {[`${classInfo}.$.backTime`]: backTime } }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('귀가 시간 추가 완료\n');
      callback(result);
    }
  );
}
  
exports.getOutingList = function(date, classInfo, callback) {
  console.log('getOutingList 호출됨\n');

  classInfo = `outingData_${classInfo}`;

  outing.find({ 'date': date }, { projection:{ [classInfo]: 1, _id: 0 } }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log('외출 데이터 추출완료!\n');
      if(docs[0] === undefined) {                   // 외출 데이터가 비어있다.
        callback(docs)
      } else {
        docs[0][classInfo].sort(function (a, b) { 
          return a.studentId < b.studentId ? -1 : 1;  
        });        
        callback(docs[0][classInfo]);
      }
    }
  );
}










/**
 * notice DAO
 */
exports.addNotice = function(startDate, endDate, content, classInfo, callback) {
  console.log('addNotice 호출됨\n');

  const startMonth = moment(startDate).format('YYYY-MM');

  classInfo = 'noticeData_' + classInfo;
  const noticeData = { 'startDate':  startDate, 'endDate': endDate, 'content': content };

  notice.updateOne({ 'startMonth':  startMonth }, { $push: { [classInfo]: noticeData }}, { upsert : true }, 
    function(err, result) {
      assert.equal(err, null);
      console.log(`${classInfo} 공지사항 추가 완료`);
      callback(result);
    }
  );
}

exports.getNoticeList = function(startMonth, classInfo, callback) {
  console.log('getNoticeList 호출됨\n');

  classInfo = `noticeData_${classInfo}`;

  notice.find({ 'startMonth': startMonth }, { projection:{ [classInfo]: 1, _id: 0 } }).toArray(
    function(err, docs) {
      assert.equal(err, null);
      console.log(`${classInfo} 공지사항 데이터 추출완료!\n`);
      if(docs[0] === undefined) {
        callback(docs)
      } else {
        callback(docs[0][classInfo]);
      }
    }
  );
}

exports.deleteNotice = function(startDate, endDate, content, classInfo, callback) {
  console.log('deleteNotice 호출됨\n');

  const startMonth = moment(startDate).format('YYYY-MM');

  classInfo = 'noticeData_' + classInfo;
  
  notice.updateOne({ 'startMonth': startMonth },  {$pull: {[classInfo]: {'startDate': startDate, 'endDate': endDate, 'content': content } } }, 
    function(err, result) {
      assert.equal(err, null);
      console.log('공지사항 삭제 완료\n');
      callback(result);
    }
  );
}