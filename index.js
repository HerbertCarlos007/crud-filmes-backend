const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

const movieRoutes = require('./movieRoutes')

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') })

app.use(
    express.urlencoded({
        extended:true
    })
)

app.use(cors())

app.use(express.json())

app.use('/movies', movieRoutes)

app.get('/', (req, res) => {
    res.json({message: 'Oi express!'})
})

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Conectamos ao MongoDB')
})
.catch((err) => console.log(err))

app.listen(process.env.PORT, () => {
    console.log(process.env.MONGO_URL)
})