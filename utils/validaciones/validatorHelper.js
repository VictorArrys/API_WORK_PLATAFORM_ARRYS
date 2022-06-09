const { validationResult } = require('express-validator')

//Respuestas
const mensajes = require('../../utils/mensajes')

const validateResult = (req, res, next) =>{
    try{
        validationResult(req).throw()
        return next()
    } catch (error){
        const messageError = error.array()
        
        console.log('Error de valor(es) invalido(s): ')
        console.log(messageError)
        res.status(403)
        res.json(mensajes.prohibido)
    }

}

module.exports = { validateResult }