const jwt = require('jsonwebtoken')

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log(authHeader.split(' ')[1])
    const token = authHeader && authHeader.split(" ")[1]
    

    if(!token){
        return res.status(401).json({message: 'Acesso negado!'})
    }

    try {

        const secret = process.env.SECRET
         jwt.verify(token, secret)
        
        next()
        
    } catch (error) {
        console.error(error.message)
        res.status(400).json({message: error.message})
    }
}

module.exports = checkToken