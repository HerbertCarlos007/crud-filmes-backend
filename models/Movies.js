const mongoose = require('mongoose')

const Movies = mongoose.model('Movies', {

    name: String,
    genre: String,
    synopsis: String,
    duration: String,
    url: String,
    releaseYear: String
})

module.exports = Movies