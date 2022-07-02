const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const mensajes = require('../../utils/mensajes');;
const { GestionServicios } = require('../componentes/GestionServicios/GestionServicios');
const GestionToken = require('../utils/GestionToken');
/*
Estatus de solicitudes servicio:
Pendiente: 0, Rechazado -1, Aceptado: 1

Estatus de contratacion servicio
Activa: 0, finalizada: 1
*/

path.get("/v1/perfilDemandantes/:idPerfilDemandante/contratacionesServicios", (req, res) => {
    const idDemandante = req.params['idPerfilDemandante'];
    const token = req.headers['x-access-token'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Demandante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.getContratacionesServicioDemandante(idDemandante, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

path.patch("/v1/perfilDemandantes/:idPerfilDemandante/contratacionesServicios/:idContratacionServicio/evaluarAspirante", (req, res) => {
    const token = req.headers['x-access-token'];
    const idDemandante = req.params['idPerfilDemandante'];
    const idContratacion = req.params['idContratacionServicio'];
    const puntuacion =  req.body['puntuacion'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Demandante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.evaluarAspirante(idDemandante, idContratacion, puntuacion, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

path.patch("/v1/perfilDemandantes/:idPerfilDemandante/contratacionesServicios/:idContratacionServicio/finalizada", (req, res) => {
    const token = req.headers['x-access-token'];
    const idDemandante = req.params['idPerfilDemandante'];
    const idContratacion = req.params['idContratacionServicio'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Demandante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.finalizarContratacionServicio(idDemandante, idContratacion,(codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

module.exports = path;