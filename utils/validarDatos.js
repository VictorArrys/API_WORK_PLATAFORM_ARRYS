const { check } = require('express-validator')
const { validateResult } = require('../utils/validatorHelper')

/*
const validacion = [
    check('propiedad')
        .exists()
        .not()
        .isEmpty()
        .isLength({min: 5}) 
        .custom((value, {req}) =>{
            //Validaciión personalizada
            //Condición
                //Regresar true si se cumplio y paso la prueba
            // 
            throw new Error('Descripción detallada del error')
        }),
    (req, res, next) => {
        validateResult(req, res, next)
    }

]
*/

const validarOfertaEmpleo = [

    check('cantidadPago')
        .exists()
        .not()
        .isEmpty()
        .isInt(),
    check('descripcion')
        .exists()
        .not()
        .isEmpty(),
    check('direccion')
        .exists()
        .not()
        .isEmpty(),
    check('fechaDeFinalizacion')
        .exists()
        .not()
        .isEmpty()
        .isDate(),
    check('fechaDeIinicio')
        .exists()
        .not()
        .isEmpty()
        .isDate(),
    check('horaFin')
        .exists()
        .not()
        .isEmpty()
        .isLength({min: 5, max: 5}),
    check('horaInicio')
        .exists()
        .not()
        .isEmpty()
        .isLength({min: 5, max: 5}),
    check('idCategoriaEmpleo')
        .exists()
        .not()
        .isEmpty()
        .isInt(),
    check('idCategoriaEmpleo')
        .exists()
        .not()
        .isEmpty()
        .isInt(),
    check('nombre')
        .exists()
        .not()
        .isEmpty(),
    check('tipoPago')
        .exists()
        .not()
        .isEmpty(),
    check('vacantes')
        .exists()
        .not()
        .isEmpty()
        .isInt(),
    check('idPerfilEmpleador')
        .exists()
        .not()
        .isEmpty()
        .isInt(),
        //.isAlpha('ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fa-IR', 'fi-FI', 'fr-CA', 'fr-FR', 'he', 'hi-IN', 'hu-HU', 'it-IT', 'ku-IQ', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sl-SI', 'sk-SK', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA')
    (req, res, next) => {
        validateResult(req, res, next)
    }

]



module.exports = { validarOfertaEmpleo }
