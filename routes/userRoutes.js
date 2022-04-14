const router = require('express').Router()
const Users = require('../models/Users')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({message: 'Acesso negado!'})
    }

    try {

        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
        
    } catch (error) {
        res.status(400).json({message: 'Token inválido'})
    }
}

router.get('/:id', checkToken, async(req, res) => {
    const id = req.params.id
    
    const user = await Users.findById(id, '-password')

    if(!user) {
        return res.status(404).json({message: 'Usuário não encontrado'})
    }

    res.status(200).json({ user })
})

router.post('/register', async(req, res) => {

    const { name, email, password, confirmPassword} = req.body

    if(!name) {
        return res.status(422).json({message: 'O nome é obrigatório'})
    }

    if(!email) {
        return res.status(422).json({message: 'O email é obrigatório'})
    }

    if(!password) {
        return res.status(422).json({message: 'A senha é obrigatória'})
    }

    if(password !== confirmPassword) {
        return res.status(422).json({message: 'A senhas não são iguais'})
    }

    const userExists = await Users.findOne({email: email})

    if(userExists){
       return res.status(422).json({message: 'Esse e-mail já foi ultilizado, por favor tente outro e-mail!'})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new Users({
        name,
        email,
        password: passwordHash
    })

    try {

        await user.save()
        res.status(201).json({message: 'Usuário criado com sucesso!'})
        
    } catch (error) {
        res.status(500).json({message: error})
    }

})

router.post('/login', async(req, res) => {
    const { email, password} = req.body

    if(!email) {
        return res.status(422).json({message: 'O e-mail é obrigatório'})
    }

    if(!password) {
        return res.status(422).json({message: 'A senha é obrigatório'})
    }

    const user = await Users.findOne({email: email})

    if(!user){
        return res.status(404).json({message: 'Usuário não encontrado'})
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({message: 'Senha inválida'})
    }

    try {

        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user._id
        }, secret)

        res.status(200).json({message: 'Autenticação realizada com sucesso!', token})
        
    } catch (error) {
        res.status(500).json({message: error})
    }
})



module.exports = router
