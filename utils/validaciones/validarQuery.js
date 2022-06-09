const { validateResult } = require('./validatorHelper')
const { query } = require('express-validator')

/*
Para verificar la query se utiliza la palabra predefinida query
*/
const validarQueryLogIn = [

    query('nombreUsuario')
        .exists()
        .not()
        .isEmpty(),
    query('clave')
        .exists()
        .not()
        .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }

]

module.exports = { validarQueryLogIn }

const validarQuery = [

    query()
        .exists()
        .not()
        .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }

]

module.exports = { validarQuery }