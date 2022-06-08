const { validateResult } = require('./validatorHelper')
const { param } = require('express-validator')

/*
Para verificar parametros se utiliza param
*/

// Verificar que no esten vacios los parametros
const validarParamId = [

    param()
        .exists()
        .not()
        .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }

]

module.exports = { validarParamId }
