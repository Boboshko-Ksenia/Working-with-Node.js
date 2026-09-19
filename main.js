const moment = require('moment')
const express = require('express')

const PORT = 8000
const HOST = 'localhost'
const APP = express()
APP.use(express.json())


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


let products = [
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
    let product = products.find(product => product.id === idNum)
    if (!product) {
        return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
})
APP.get(`/health`, (req, res) => {
    res.json({
        status: 'ok'
    })
})

APP.get('/stats', (req, res) => {
    res.json({
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
        timestamp: getCurrentTimestamp()
    })

})

async function addProduct(newProduct, isFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isFail) {
                reject(new Error("Database error"))
            } else {
                products = [...products, newProduct]
                resolve(newProduct)
            }
        }, 1000)
    })
}

APP.post('/products', async (req, res) => {
    const { name, price, category, image } = req.body
    const isFail = req.query.fail === 'true'
    if (
        typeof name !== "string" || !name.trim() || 
        typeof price !== "number" || typeof category !== 'string' || 
        price <= 0 || !category.trim() || 
        (image !== undefined && typeof image !== 'string' )
    ) {
        return res.status(422).json({
            ok: false,
            description: "Invalid product data"
        })
    }
    const isDuplicate = products.some(
        product => product.name.trim().toLowerCase() === name.trim().toLowerCase()
    )
    if (isDuplicate){
        return res.status(409).json({message: "Conflict"})
    }
    const newProduct = {
        id: products.length + 1,
        name: name.trim(),
        price: price,
        category: category.trim(),
        image: image || null
    }
    try {
        const savedProducts = await addProduct(newProduct, isFail) 
        return res.status(201).json(savedProducts)
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"})
    }
    
})

APP.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})