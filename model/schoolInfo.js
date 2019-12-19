const School = require('node-school-kr');
const school = new School();

school.init(School.Type.HIGH, School.Region.GWANGJU, 'F100000120');

function processMeal(meal) {
    meal = meal.replace(/[0-9]/g, '');
    meal = meal.replace(/\./g, '');
    meal = meal.replace(/\*/g, '');
    meal = meal.split('[');

    for(let i=1; i<=3; i++) {
        if(meal[i] !== undefined) {
            meal[i] = meal[i].substring(3);
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

exports.getMealAndCalendar = async function(year, month, callback) {
    const meal = await school.getMeal(year, month);
    const calendar = await school.getCalendar(year, month);
    const lastDate = (new Date(year, month, 0)).getDate();

    delete meal.today;

    for(let date=1; date<=lastDate; date++) {
        const dayOfWeek = new Date(`${year}-${month}-${date}`).getDay()
        if(meal[String(date)] !== '' && dayOfWeek !== 0 && dayOfWeek !== 6) {
            meal[String(date)] = processMeal(meal[String(date)]);
        }
    }
    
    callback(meal, calendar);
}
