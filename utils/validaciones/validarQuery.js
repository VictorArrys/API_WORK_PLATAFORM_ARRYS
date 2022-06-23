const { validateResult } = require('./validatorHelper')
const { query } = require('express-validator')

/*
Para verificar la query se utiliza la palabra predefinida query
*/

const validarQueryOferta = [

    query('idPerfilEmpleador')
        .notEmpty()
        .isInt()
        .isLength({min: 1}),
    (req, res, next) => {
        validateResult(req, res, next)
    }

]

module.exports = { validarQueryOferta }