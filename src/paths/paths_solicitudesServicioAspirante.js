const { Router, query } = require('express');
const path = Router();
const mensajes = require('../../utils/mensajes');
const GestionToken = require('../utils/GestionToken');
const { GestionServicios } = require('../componentes/GestionServicios/GestionServicios');
/*

Estatus de solicitudes:
Pendiente: 0, Rechazado -1, Acpetado: 1

Estatus de contratacion servicio
Activa: 0, finalizada: 1
*/


path.get("/v1/perfilAspirantes/:idPerfilAspirante/solicitudesServicios", (req, res) => {
    const token = req.headers['x-access-token'];
    const estatus = req.query['estatus'];
    const idAspirante = req.params['idPerfilAspirante'];
    
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.getSolicitudesServicioAspirante(idAspirante, estatus,(codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilAspirantes/:idPerfilAspirante/solicitudesServicios/:idSolicitudServicio",(req, res) => {
    const token = req.headers['x-access-token'];
    const idAspirante = req.params['idPerfilAspirante'];
    const idSolicitudServicio = req.params['idSolicitudServicio'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.getSolicitudServicioAspirante(idAspirante, idSolicitudServicio, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

path.patch("/v1/perfilAspirantes/:idPerfilAspirante/solicitudesServicios/:idSolicitudServicio/aceptada",(req, res) => {
    const token = req.headers['x-access-token'];
    const idAspirante = req.params['idPerfilAspirante'];
    const idSolicitudServicio = req.params['idSolicitudServicio'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.aceptarSolicitudServicio(idAspirante, idSolicitudServicio, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

path.patch("/v1/perfilAspirantes/:idPerfilAspirante/solicitudesServicios/:idSolicitudServicio/rechazada",(req, res) => {
    const token = req.headers['x-access-token'];
    var idAspirante = req.params['idPerfilAspirante'];
    var idSolicitudServicio = req.params['idSolicitudServicio'];
    
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.rechazarSolicitudServicio(idAspirante, idSolicitudServicio, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

module.exports = path;