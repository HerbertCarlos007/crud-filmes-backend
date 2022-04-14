const router = require('express').Router()
const Movies = require('../models/Movies')

router.post('/', async (req, res) => {
    
    const {name, genre, synopsis, duration, url, urlImage, releaseYear} = req.body

    if(!name){
        res.status(422).json({error: 'O nome é obrigátorio'})
        return
    }

    const movie = {
        name,
        genre,
        synopsis,
        duration,
        url,
        releaseYear
    }

    try {
        await Movies.create(movie)

        res.status(201).json({message: 'Filme criado com sucesso'})

    } catch (error) {
        res.status(500).json({error: error})
    }

})


router.get('/', async (req, res) => {
    
    try {
        
        const movie = await Movies.find()
        res.status(200).json(movie)

    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.get('/:id', async (req, res) => {
    
    const id = req.params.id

    try {
        const movie = await Movies.findOne({_id: id})

        if(!movie){
            res.status(422).json({message: 'Filme nao encotrado'})
            return
        }

        res.status(200).json(movie)
    
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.patch('/:id', async (req, res) => {
    
    const id = req.params.id
    const {name, genre, synopsis, duration, url } = req.body

    const movie = {
        name,
        genre,
        synopsis,
        duration,
        url
    }

    try {
        
        const updateMovie = await Movies.updateOne({_id: id}, movie)

        if(updateMovie.matchedCount === 0) {
            res.status(422).json({message: 'O filme nao foi encontrado'})
            return
        }

        res.status(200).json(movie)

    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.delete('/:id', async (req, res) => {

    const id = req.params.id

    const movies = await Movies.findOne({_id: id})

    if(!movies){
        res.status(422).json({message: 'Filme não encontrado'})
        return
    }

    try {
        
       await Movies.deleteOne({_id: id})
       res.status(200).json({message: 'Filme deletado com sucesso'})

    } catch (error) {
        res.status(500).json({error: error})
    }
})

module.exports = router