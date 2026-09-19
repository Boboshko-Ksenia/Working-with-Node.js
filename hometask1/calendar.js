const moment = require('moment')

function getCurrentDay() {
    console.log(moment().format('dddd'))
}
getCurrentDay()

function getCurrentMonth() {
    console.log(moment().format('MMMM'))
}
getCurrentMonth()

function getCurrentYear() {
    console.log(moment().format('YYYY'))
}
getCurrentYear()