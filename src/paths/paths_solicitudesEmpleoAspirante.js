const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const mensajes = require('../../utils/mensajes');

const GestionToken = require('../utils/GestionToken');


path.post("/v1/ofertasEmpleo-A/:idOfertaEmpleo/solicitarVacante", (req, res)=>{
    const token = req.headers['x-access-token'];
    
    var idPerfilAspirante = req.body['idPerfilAspirante'];
    var idOfertaEmpleo = req.params['idOfertaEmpleo'];
    console.log(idPerfilAspirante);
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200) {
        var queryComprobacion = "SELECT COUNT(*) as numSolicitudes FROM solicitud_aspirante where id_perfil_aspirante_sa = ? and id_oferta_empleo_sa = ?;";
        mysqlConnection.query(queryComprobacion, [idPerfilAspirante,idOfertaEmpleo], (error, resultado) => {
            if (error) {
                
                res.status(500);
                res.json(mensajes.errorInterno);
            } else {
                var numSolicitud = resultado[0]['numSolicitudes'];
                if (numSolicitud == 0) {
                    querySolicitud = "INSERT INTO solicitud_aspirante ( id_perfil_aspirante_sa, id_oferta_empleo_sa, estatus, fecha_registro) VALUES ( ?, ?, 1, NOW());";
                    mysqlConnection.query(querySolicitud, [idPerfilAspirante, idOfertaEmpleo], (error, resultado) => {
                        if (error) {
                            console.log(error)
                            res.status(500);
                            res.json(mensajes.errorInterno);
                        } else {
                            nuevaSolcitud = {
                                "idSolicitudVacante": resultado.insertId,
                                "estatus": resultado['estatus'],
                                "fechaRegistro": resultado['fecha_registro'],
                                "idOfertaEmpleo": resultado['id_oferta_empleo_sa'],
                                "idPerfilAspirante": resultado['id_perfil_aspirante_sa']
                            }

                            res.status(201);
                            res.send(nuevaSolcitud);
                        }
                    });
                } else {
                    res.status(403);
                    res.send(mensajes.solicitudEmpleoRegistrada);
                }
            }
        })
        mysqlConnection.query
    } else {
        res.status(validacionToken.statusCode)
        res.json(mensajes.tokenInvalido);
    }

});

module.exports = path;