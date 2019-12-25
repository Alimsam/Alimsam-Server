const School = require('node-school-kr');
const school = new School();

school.init(School.Type.HIGH, School.Region.GWANGJU, 'F100000120');

function processMeal(meal) {
    meal = meal.replace(/[0-9]/g, '');      // 급식의 영양소 숫자 지우기
    meal = meal.replace(/\./g, '');         // . 지우기
    meal = meal.replace(/\*/g, '');         // * 지우기
    meal = meal.split('[');                 // '[' 를 기준으로 자르기(조식, 중식, 석식 나누기)

    for(let i=1; i<=3; i++) {
        if(meal[i] !== undefined) {
            meal[i] = meal[i].substring(3);
            meal[i] = meal[i].replace(/(^\n*)|(\n*$)/gi, "");       // 맨 앞뒤 개행을 공백으로 변환
            meal[i] = meal[i].replace(/\n/gi, '\n');              // 개행을 <br> 로 변환
        }
    }
    
    temp = {
        breakfast: meal[1],
        lunch: meal[2],
        dinner: meal[3]
    }

    meal = '';
    meal = temp;
  
    return meal;
}

function processCalendar(calendar) {
    calendar = calendar.replace(/,/g, '\n');

    return calendar;
}

exports.getMeal = async function(year, month, callback) {
    console.log('getMeal 호출됨');
    const meal = await school.getMeal(year, month);
    const lastDate = (new Date(year, month, 0)).getDate();      // 해당 달의 마지막날 구하기

    delete meal.today;

    for(let date=1; date<=lastDate; date++) {
        const dayOfWeek = new Date(`${year}-${month}-${date}`).getDay()             // 해당 날짜의 요일 구하기
        if(meal[String(date)] !== '' && dayOfWeek !== 0 && dayOfWeek !== 6) {       // 토요일이거나 일요일일경우는 계산하지않음
            meal[String(date)] = processMeal(meal[String(date)]);
        }
    }
    
    callback(meal);
}

exports.getCalendar = async function(year, month, callback) {
    console.log('getCalendar 호출됨');
    const calendar = await school.getCalendar(year, month);
    const lastDate = (new Date(year, month, 0)).getDate();      // 해당 달의 마지막날 구하기

    for(let date=1; date<=lastDate; date++) {
        if(calendar[String(date)] !== '') {
            calendar[String(date)] = processCalendar(calendar[String(date)]);
        }
    }

    callback(calendar);
}
