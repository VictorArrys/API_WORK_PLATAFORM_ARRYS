const { validateResult } = require('./validatorHelper')
const { query } = require('express-validator')

/*
Para verificar la query se utiliza la palabra predefinida query
*/

const validarQuery = [

    query()
        .exists()
        .not()
        .isEmpty()
        .isLength({min: 5, max: 20}),
    (req, res, next) => {
        validateResult(req, res, next)
    }

]

module.exports = { validarQuery }