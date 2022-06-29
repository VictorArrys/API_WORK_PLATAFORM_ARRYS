const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');
const mensajes = require('../../utils/mensajes');
const res = require('express/lib/response');

/*
Estatus de solicitudes servicio:
Pendiente: 0, Rechazado -1, Aceptado: 1

Estatus de contratacion servicio
Activa: 0, finalizada: 1
*/

//Verfica que el token le pertenesca a Demandante
function verificarTokenDemandante(token, idPerfilDemandante) {
    try{
        const tokenData = jwt.verify(token, keys.key);
        if (tokenData['tipo'] == "Demandante")
            return true;
        else
            return false;
    } catch (error) {
        return false;
    }
}

path.get("/v1/perfilDemandantes/:idPerfilDemandante/contratacionesServicios", (req, res) => {
    const token = req.headers['x-access-token'];
    var tokenValido = verificarTokenDemandante(token);
    const idDemandante = req.params['idPerfilDemandante'];
    if (tokenValido) {
        var query = "SELECT * FROM deser_el_camello.contratacion_servicio where id_perfil_demandante_cs = ?;"
        mysqlConnection.query(query, [idDemandante], (error, resultadoConsulta)=> {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno);
            } else {
                var listaContratacionesServicio = [];
                resultadoConsulta.forEach(fila => {
                    var contratacionServicio = {};
                    contratacionServicio = {
                        "idContratacionServicio": fila['id_contratacion_servicio'],
                        "idPerfilDemandante": fila['id_perfil_demandante_cs'],
                        "fechaFinalizacion": fila['fecha_finalizacion'],
                        "estatus": fila['estatus'],
                        "fechaContratacion":  fila['fecha_contratacion'],
                        "valoracionDemandante": fila['valoracion_aspirante'],
                        "idPerfilAspirante": fila['id_perfil_aspirante_cs']
                    }
                    listaContratacionesServicio.push(contratacionServicio);
                });
                res.status(200);
                res.send(listaContratacionesServicio);
            }
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.patch("/v1/perfilDemandantes/:idPerfilDemandante/contratacionesServicios/:idContratacionServicio/evaluarAspirante", (req, res) => {
    const token = req.headers['x-access-token'];
    const idDemandante = req.params['idPerfilDemandante'];
    const idContratacion = req.params['idContratacionServicio'];
    const puntuacion =  req.body['puntuacion'];
    var queryComprobacion = "SELECT count(*) as estaFinalizada FROM contratacion_servicio WHERE id_perfil_demandante_cs = ? AND id_contratacion_servicio = ? AND estatus = 1; ";
    var queryEvaluacion = "UPDATE contratacion_servicio SET valoracion_aspirante = ? WHERE id_perfil_demandante_cs = ? AND id_contratacion_servicio = ?;"
    var tokenValido = verificarTokenDemandante(token);

    if (tokenValido) {
        mysqlConnection.query(queryComprobacion, [idDemandante, idContratacion], (error, resultadoComprobacion) => {
            if (error) {
                res.status(500);
                res.send(mensajes.errorInterno);
            } else {
                var sePuedeEvaluar = resultadoComprobacion[0]['estaFinalizada'];
                if (sePuedeEvaluar == 1) {
                    mysqlConnection.query(queryEvaluacion, [puntuacion, idDemandante, idContratacion], (error, resultado)=> {
                        if(error){ 
                            res.status(500);
                            res.send(mensajes.errorInterno);
                        } else {
                            res.status(204);
                            res.send(mensajes.aspiranteEvaluado);
                        }
                    });
                } else {
                    res.status(409).send(mensajes.evaluacionDeAspiranteDenegada);
                }
            }
        });
    } else {
        res.status(401);
        res.send(mensajes.tokenInvalido);
    }
});

path.patch("/v1/perfilDemandantes/:idPerfilDemandante/contratacionesServicios/:idContratacionServicio/finalizada", (req, res) => {
    const token = req.headers['x-access-token'];
    const idDemandante = req.params['idPerfilDemandante'];
    const idContratacion = req.params['idContratacionServicio'];

    var tokenValido = verificarTokenDemandante(token);
    if (tokenValido) {
        var queryComprobacion = "SELECT if(count(*) = 1, true, false) as estaActiva FROM deser_el_camello.contratacion_servicio where (id_perfil_demandante_cs = ? AND id_contratacion_servicio = ?) AND estatus = 0;"
        var queryFinalizar = "UPDATE contratacion_servicio SET estatus = 1 WHERE (id_perfil_demandante_cs = ? AND id_contratacion_servicio = ?);"
        mysqlConnection.query(queryComprobacion, [idDemandante, idContratacion], (error, resultadoComprobacion) => {
            if (error) {
                res.status(500);
                res.send(mensajes.errorInterno);
            } else {
                var sePuedeFinalizar = resultadoComprobacion[0]['estaActiva'];
                if (sePuedeFinalizar == 1) {
                    mysqlConnection.query(queryFinalizar, [idDemandante, idContratacion], (error, resultado)=> {
                        if(error){ 
                            res.status(500);
                            res.send(mensajes.errorInterno);
                        } else {
                            res.status(204);
                            res.send(mensajes.contratacionServicioFinalizada);
                        }
                    });
                } else {
                    res.status(409).send(mensajes.contratacionServicioPreviamenteFinalizada);
                }
            }
        });
    } else {
        res.status(401);
        res.send(mensajes.tokenInvalido);
    }
});

    


module.exports = path;