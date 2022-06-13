const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const mensajes = require('../../utils/mensajes');

function verificarTokenAspirante(token, idPerfilAspirante) {
    try{
        const tokenData = jwt.verify(token, keys.key);
        if (tokenData['tipo'] == "Aspirante")
            return {"resultado":true, "datosToken": tokenData};
        else
            return {"resultado":false, "datosToken": tokenData};
    } catch (error) {
        return {"resultado":false, "datosToken": null};
    }
}

path.post("/v1/ofertasEmpleo-A/:idOfertaEmpleo/solicitarVacante", (req, res)=>{
    const token = req.headers['x-access-token'];
    
    var idPerfilAspirante = req.body['idPerfilAspirante'];
    var idOfertaEmpleo = req.params['idOfertaEmpleo'];
    
    var {tokenValido, datosToken} = verificarTokenAspirante(token);

    if (tokenValido) {
        var queryComprobacion = "SELECT COUNT(*) as numSolicitudes FROM solicitud_aspirante where id_perfil_aspirante_sa = ? and id_oferta_empleo_sa = ?;";
        mysqlConnection.query(queryComprobacion, [], (error, resultado) => {
            if (error) {
                res.status(500);
                res.json(mensajes.errorInterno);
            } else {
                var numSolicitud = resultado[0]['numSolicitudes'];
                if (numSolicitud == 0) {
                    querySolicitud = "INSERT INTO solicitud_aspirante ( id_perfil_aspirante_sa, id_oferta_empleo_sa, estatus, fecha_registro) VALUES ( ?, ?, 1, NOW());";
                    mysqlConnection.query(querySolicitud, [], (error, resultado) => {
                        if (error) {
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
                            res.send(solcitud);
                        }
                    });
                } else {
                    res.status(409);
                    res.send(mensajes.solicitudEmpleoRegistrada);
                }
            }
        })
        mysqlConnection.query
    } else {
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);
    }

});

module.exports = path;