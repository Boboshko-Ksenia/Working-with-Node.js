const moment = require('moment')
const express = require('express')

const PORT = 8000
const HOST = 'localhost'
const APP = express()

function getCurrentDay() {
    return(moment().format('dddd'))
}

function getCurrentMonth() {
    return(moment().format('MMMM'))
}

function getCurrentYear() {
    return(moment().format('YYYY'))
}

function getCurrentTimestamp() {
    return(moment().format('YYYY-MM-DD HH:mm:ss'))
}

APP.get('/timestamp', (req, res) => {
    res.json({
        day: getCurrentDay(),
        month: getCurrentMonth(),
        year: getCurrentYear(),
        timestamp: getCurrentTimestamp()
    })
})



APP.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})