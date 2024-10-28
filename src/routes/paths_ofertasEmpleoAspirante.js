const { Router, query } = require('express');
const path = Router();
const GestionToken = require('../utils/GestionToken');
const { GestionOfertasEmpleo } = require('../componentes/GestionOfertasEmpleo/GestionOfertasEmpleo');
const mensajes = require('../../utils/mensajes');

const {ValidarCategorias} = require('../../utils/validaciones/ofertaEmpleoAspirante')


path.get("/ofertasEmpleo-A", ValidarCategorias, (req, res) => {
    const token = req.headers['x-access-token'];
    const categoriasEmpleo = req.query['categoriasEmpleo'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionOfertasEmpleo.getOfertasEmpleoAspirante(categoriasEmpleo, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

path.get("/ofertasEmpleo-A/:idOfertaEmpleo", (req, res) => {
    const token = req.headers['x-access-token'];
    const idOfertaEmpleo = req.params['idOfertaEmpleo'];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionOfertasEmpleo.getOfertaEmpleoAspirante(idOfertaEmpleo, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

module.exports = path;