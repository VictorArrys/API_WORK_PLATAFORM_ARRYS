const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const mensajes = require('../../utils/mensajes');
const {GestionServicios} = require('../componentes/GestionServicios')
const GestionToken = require('../utils/GestionToken');
const { GestionContratacionesEmpleo } = require('../componentes/GestionContratacionesEmpleo/GestionContratacionesEmpleo');


path.get("/v1/perfilAspirantes/:idPerfilAspirante/contratacionesServicios", (req, res) => {
    var idAspirante = req.params['idPerfilAspirante'];
    
    const token = req.headers['x-access-token'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.getContratacionesServicioAspirante(idAspirante, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilAspirantes/:idPerfilAspirante/contratacionesEmpleo", (req, res) => {
    var idAspirante = req.params['idPerfilAspirante'];
    const token = req.headers['x-access-token'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionContratacionesEmpleo.getContratacionesDeAspirante(idAspirante, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        })
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilAspirantes/:idPerfilAspirante/contratacionesEmpleo/:idContratacionEmpleoAspirante", (req, res) => {
    var idAspirante = req.params['idPerfilAspirante'];
    var idContratacionEmpleo = req.params['idContratacionEmpleoAspirante'];
    const token = req.headers['x-access-token'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionContratacionesEmpleo.getContratacionDeAspirante(idAspirante,idContratacionEmpleo, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});


//Estatus de la contratación {1: En curso, 0: Terminada}
path.patch("/v1/perfilAspirantes/:idPerfilAspirante/contratacionesEmpleo/:idContratacionEmpleoAspirante/evaluarEmpleador", (req, res) => {
    const idAspirante = req.params['idPerfilAspirante'];
    const idContratacionEmpleo = req.params['idContratacionEmpleoAspirante'];
    const puntuacion = req.body['puntuacion'];
    const token = req.headers['x-access-token'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionContratacionesEmpleo.evaluarEmpleador(idAspirante,idContratacionEmpleo,puntuacion, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        })
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

module.exports = path;