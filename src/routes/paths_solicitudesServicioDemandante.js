const { Router, query } = require('express');
const path = Router();
const mensajes = require('../../utils/mensajes');
const { GestionServicios } = require('../componentes/GestionServicios/GestionServicios');
const GestionToken = require("../utils/GestionToken");

//Estatus de solicitudes:
//Pendiente: 0, Rechazado -1, Acpetado: 1 

path.get("/perfilDemandantes/:idPerfilDemandante/solicitudesServicios", (req, res) => {
    const token = req.headers['x-access-token'];
    var idDemandante = req.params['idPerfilDemandante'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Demandante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.getSolicitudesServicioDemandante(idDemandante, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        })
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

path.post("/perfilDemandantes/:idPerfilDemandante/solicitudesServicios", (req, res) => {
    const token = req.headers['x-access-token'];
    const idDemandante = req.params['idPerfilDemandante'];
    const idAspirante = req.body['idAspirante'];
    const titulo = req.body['titulo'];
    const descripcion =  req.body['descripcion'];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Demandante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.postSolicitudServicio(idAspirante,idDemandante, titulo, descripcion, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }
});

module.exports = path;