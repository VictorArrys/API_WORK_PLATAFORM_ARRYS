const { validateResult } = require('./validatorHelper')
const { param } = require('express-validator')
const req = require('express/lib/request')
const res = require('express/lib/response')

/*
Para verificar parametros se utiliza param
*/

const validarParamIdUsuario = [
    param('idPerfilUsuario')
        .exists()
        .not()
        .isEmpty()
        .isInt(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

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
module.exports = { validarParamIdUsuario }
