const { validateResult } = require('./validatorHelper')
const { param } = require('express-validator')
const req = require('express/lib/request')
const res = require('express/lib/response')

/*
Para verificar parametros se utiliza param
*/

// Verificar que no esten vacios los parametros
const validarParamOferta = [

    param('idOfertaEmpleo')
        .exists()
        .not()
        .isEmpty()
        .isInt(),
    (req, res, next) => {
        validateResult(req, res, next)
    }

]

const validarParam = [

    param('idOfertaEmpleo')
        .exists()
        .not()
        .isEmpty()
        .isInt(),
    (req, res, next) => {
        validateResult(req, res, next)
    }

]

module.exports = {
    validarParamOferta,
    validarParam
}

