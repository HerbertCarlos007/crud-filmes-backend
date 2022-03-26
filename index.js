const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

const movieRoutes = require('./movieRoutes')

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

mongoose.connect('mongodb+srv://herbert:41568106h@apicluster.4h1bh.mongodb.net/Filmes?retryWrites=true&w=majority')
.then(() => {
    console.log('Conectamos ao MongoDB')
    app.listen(5000)
})
.catch((err) => console.log(err))