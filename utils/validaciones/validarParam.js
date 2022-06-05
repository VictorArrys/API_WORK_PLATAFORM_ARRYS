const { validateResult } = require('./validatorHelper')
const { param } = require('express-validator')

/*
Para verificar parametros se utiliza param
*/

const validarParamIdEmpleador = [

    param('idPerfilEmpleador')
        .exists()
        .not()
        .isEmpty()
        .isInt(),
    (req, res, next) => {
        validateResult(req, res, next)
    }

]

module.exports = { validarParamIdEmpleador }
