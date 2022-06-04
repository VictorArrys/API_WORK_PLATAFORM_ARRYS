const { validationResult } = require('express-validator')

const validateResult = (req, res, next) =>{
    try{
        validationResult(req).throw()
        return next()
    } catch (error){
        const messageError = error.array()
        console.log('Error de valor(es) invalido(s): ')
        console.log(error.array())
        res.status(400)
        res.json(messageError)
    }

}

module.exports = { validateResult }