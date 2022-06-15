const { Router, query } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const mensajes = require('../../utils/mensajes');

/*

Estatus de solicitudes:
Pendiente: 0, Rechazado -1, Acpetado: 1

Estatus de contratacion servicio
Activa: 0, finalizada: 1
*/


//Verfica que el token le pertenezca a un demandante
function verificarTokenAspirante(token, idPerfilDemandante) {
    try{
        const tokenData = jwt.verify(token, keys.key);
        if (tokenData['tipo'] == "Aspirante")
            return true;
        else
            return false;
    } catch (error) {
        return false;
    }
}

path.get("/v1/perfilAspirantes/:idPerfilAspirante/solicitudesServicios",(req, res) => {
    const token = req.headers['x-access-token'];
    tokenValido = verificarTokenAspirante(token);
    

    if (tokenValido) {
        var estatus = req.query['estatus'];
        var filtroEstatus = "";
        var idAspirante = req.params['idPerfilAspirante'];
        switch(estatus) {
            case "Pendiente":
                filtroEstatus = "AND estatus = 0";
                break;
            case "Aceptado":
                filtroEstatus = "AND estatus = 1";
                break;
            case "Rechazado":
                filtroEstatus = "AND estatus = -1";
                break;
            default:
                filtroEstatus = "";
        }

        var query = "SELECT * FROM deser_el_camello.solicitud_servicio where id_perfil_ss_aspirante = ? " + filtroEstatus + ";";
        mysqlConnection.query(query, [idAspirante], (error, resultado) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else {
                var listaSolicitudes = [];
                resultadoresultado.forEach(fila => {
                    var solicitud = {};
                    solicitud = {
                        "idSolicitudServicio": fila['id_solicitud_servicio'],
                        "titulo": fila['titulo'],
                        "descripcion": fila['descripcion'],                  
                        "estatus": fila['estatus'],
                        "fechaRegistro": fila['registro'],
                        "idPerfilDemandante": fila['id_perfil_ss_demandante'],
                        "idPerfilAspirante": fila['id_perfil_ss_aspirante']
                    }
                    listaSolicitudes.push(solicitud);
                });
                res.status(200).send(listaSolicitudes);
            }
        });
    } else {
        res.status(401);
        res.json(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilAspirantes/:idPerfilAspirante/solicitudesServicios/:idSolicitudServicio",(req, res) => {
    const token = req.headers['x-access-token'];
    tokenValido = verificarTokenAspirante(token);
    

    if (tokenValido) {
        var idAspirante = req.params['idPerfilAspirante'];
        var idSolicitudServicio = req.params['idSolicitudServicio'];

        var query = "SELECT * FROM deser_el_camello.solicitud_servicio where id_perfil_ss_aspirante = ? AND id_solicitud_servicio = ?;";
        mysqlConnection.query(query, [idAspirante, idSolicitudServicio], (error, resultado) => {
            if(error){ 
                res.status(500);
                res.send(mensajes.errorInterno);
            } else {
                if (resultado.length > 0) {
                    var solicitudServicio = resultado[0];
                    var solicitud = {};
                    solicitud = {
                        "idSolicitudServicio": solicitudServicio['id_solicitud_servicio'],
                        "titulo": solicitudServicio['titulo'],
                        "descripcion": solicitudServicio['descripcion'],                  
                        "estatus": solicitudServicio['estatus'],
                        "fechaRegistro": solicitudServicio['registro'],
                        "idPerfilDemandante": solicitudServicio['id_perfil_ss_demandante'],
                        "idPerfilAspirante": solicitudServicio['id_perfil_ss_aspirante']
                    }
                    res.status(200);
                    res.send(solicitud);
                } else {
                    res.status(404);
                    res.json(mensajes.peticionNoEncontrada);
                }
            }
        });
    } else {
        res.status(401);
        res.json(mensajes.tokenInvalido);
    }
});

path.patch("/v1/perfilAspirantes/:idPerfilAspirante/solicitudesServicios/:idSolicitudServicio/aceptada",(req, res) => {
    const token = req.headers['x-access-token'];
    tokenValido = verificarTokenAspirante(token);

    if (tokenValido) {
        var idAspirante = req.params['idPerfilAspirante'];
        var idSolicitudServicio = req.params['idSolicitudServicio'];

        //comprobar que la solicitud este pendiente
        var queryComprobacion = "select count(*) as estaPendiente from solicitud_servicio where id_solicitud_servicio = ? AND estatus = 0"
        mysqlConnection.query(queryComprobacion, [idSolicitudServicio], (error, resultadoComprobacion) => {
            if (error) {
                res.status(500);
                res.send(mensajes.errorInterno);
            } else if (resultadoComprobacion[0]['estaPendiente'] == 1) {
                var queryAceptarReporte = "UPDATE solicitud_servicio SET estatus = 1 WHERE id_solicitud_servicio = ? and id_perfil_ss_aspirante = ?;"
                mysqlConnection.query(queryAceptarReporte, [idSolicitudServicio, idAspirante], (error, resultadoAceptar) => {
                    if (error) {
                        res.status(500);
                        res.send(mensajes.errorInterno);
                    } else {
                        if(resultadoAceptar.affectedRows == 1) {
                            //registrar conversacion y contratacion


                            res.status(204).send(mensajes.solicitudServicioAceptada);
                        }
                    }
                });
            } else {
                res.status(409).send(mensajes.solicitudServicioAtendida);
            }
        } )
        
        
    } else {
        res.status(401);
        res.json(mensajes.tokenInvalido);
    }
});

path.patch("/v1/perfilAspirantes/{idPerfilAspirante}/solicitudesServicios/{idSolicitudServicio}/rechazada",(req, res) => {
    const token = req.headers['x-access-token'];
    tokenValido = verificarTokenAspirante(token);

    if (tokenValido) {
        var idAspirante = req.params['idPerfilAspirante'];
        var idSolicitudServicio = req.params['idSolicitudServicio'];

        //comprobar que la solicitud este pendiente
        var queryComprobacion = "select count(*) as estaPendiente from solicitud_servicio where id_solicitud_servicio = ? AND estatus = 0"
        mysqlConnection.query(queryComprobacion, [idSolicitudServicio], (error, resultadoComprobacion) => {
            if (error) {
                res.status(500);
                res.send(mensajes.errorInterno);
            } else if (resultadoComprobacion[0]['estaPendiente'] == 1) {
                var queryAceptarReporte = "UPDATE solicitud_servicio SET estatus = -1 WHERE id_solicitud_servicio = ? and id_perfil_ss_aspirante = ?;"
                mysqlConnection.query(queryAceptarReporte, [idSolicitudServicio, idAspirante], (error, resultadoAceptar) => {
                    if (error) {
                        res.status(500);
                        res.send(mensajes.errorInterno);
                    } else {
                        if(resultadoAceptar.affectedRows == 1) {
                            res.status(204).send(mensajes.solicitudServicioRechazada);
                        }
                    }
                });
            } else {
                res.status(409).send(mensajes.solicitudServicioAtendida);
            }
        } )
        
        
    } else {
        res.status(401);
        res.json(mensajes.tokenInvalido);
    }
});

module.exports = path;