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

const products = [
    { id: 1, name: 'laptop', price: 1000, category: 'electronics' },
    { id: 2, name: 'phone', price: 670, category: 'electronics' },
    { id: 3, name: 'headphones', price: 250, category: 'electronics' },
    { id: 4, name: 'chair', price: 100, category: 'furniture' },
    { id: 5, name: 'table', price: 130, category: 'furniture' },
]

APP.get('/products', (req, res) => {
    const { category, take } = req.query
    let filteredProducts = products.slice()

    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category == category)
    }
    if (take) {
        const takeNum = parseInt(take)
        if (Number.isInteger(takeNum) && takeNum > 0) {
             filteredProducts = filteredProducts.slice(0, takeNum)
        }   
    }
    res.json(filteredProducts)
})
    
APP.get('/products/:id', (req, res) => {
    const idNum = parseInt(req.params.id)
    if (!Number.isInteger(idNum)){
        return res.status(400).json({ error: 'Invalid product ID' })
    }
    const product = products.find(product => product.id === idNum)
    if (!product) {
        return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
})

APP.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})