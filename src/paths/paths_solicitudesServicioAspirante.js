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

path.get("/v1/perfilAspirantes/:idPerfilAspirante/solicitudesServicios", (req, res) => {
    const token = req.headers['x-access-token'];
    tokenValido = verificarTokenAspirante(token);
    

    if (tokenValido) {
        var estatus = req.query['estatus'];
        var filtroEstatus = "";
        var idAspirante = req.params['idPerfilAspirante'];
        switch(estatus) {
            case "Pendientes":
                filtroEstatus = "AND estatus = 0";
                break;
            case "Aceptadas":
                filtroEstatus = "AND estatus = 1";
                break;
            case "Rechazadas":
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
                resultado.forEach(fila => {
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

        var query = "SELECT ss.*, pd.nonbre as nombre FROM solicitud_servicio as ss inner join perfil_demandante as pd ON (ss.id_perfil_ss_demandante = pd.id_perfil_demandante) where id_perfil_ss_aspirante = ? AND id_solicitud_servicio = ?;";
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
                        "idPerfilAspirante": solicitudServicio['id_perfil_ss_aspirante'],
                        "nombreDemandante": solicitudServicio['nombre']
                    }
                    console.log(solicitud )
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
                console.log("Error comprobación")
                res.status(500);
                res.send(mensajes.errorInterno);
            } else if (resultadoComprobacion[0]['estaPendiente'] == 1) {
                var queryAceptarReporte = "UPDATE solicitud_servicio SET estatus = 1 WHERE id_solicitud_servicio = ? and id_perfil_ss_aspirante = ?;"
                try {
                    mysqlConnection.getConnection(function (error, conexion) {
                        if(error) {
                            throw error;
                        }
                        conexion.beginTransaction(function (error) {
                            if (error) { 
                                console.log("Fallo al intentar iniciar la transacción")
                                throw error;
                            } else {
                                conexion.query(queryAceptarReporte, [idSolicitudServicio, idAspirante], (error, resultadoAceptar) => {
                                    if(error) {
                                        conexion.rollback(function() {
                                            console.log("No se pudo aceptar el reporte");
                                            throw error;
                                        });
                                    } else {
                                        var queryConversacion = "INSERT INTO conversacion (nombre_empleo , nombre, fecha_contratacion) " +
                                                                "VALUES ( " +
                                                                    "(SELECT titulo FROM solicitud_servicio WHERE id_solicitud_servicio = ?), " +
                                                                    "(SELECT nonbre FROM perfil_demandante INNER JOIN solicitud_servicio ON (id_perfil_demandante = id_perfil_ss_demandante) WHERE id_solicitud_servicio = ?), " +
                                                                    "date_format(NOW(), \"%Y-%m-%d\") " +
                                                                ");";
                                        conexion.query(queryConversacion, [idSolicitudServicio, idSolicitudServicio], (error, resultadoConversacion) => {
                                            if(error) {
                                                conexion.rollback(function() {
                                                    console.log("No se pudo registrar la conversación")
                                                    throw error;
                                                }); 
                                            } else {
                                                var queryContratacionServicio = "INSERT INTO contratacion_servicio ( id_perfil_demandante_cs, id_perfil_aspirante_cs, estatus, valoracion_aspirante, fecha_contratacion, id_conversacion_cs) " +
                                                                                "VALUES ( " +
                                                                                    "(SELECT id_perfil_ss_demandante FROM solicitud_servicio WHERE id_solicitud_servicio = ?), " +
                                                                                    "(SELECT id_perfil_ss_aspirante FROM solicitud_servicio WHERE id_solicitud_servicio = ?), " +
                                                                                    "0, 0, NOW(), ?);";
                                                conexion.query(queryContratacionServicio, [idSolicitudServicio, idSolicitudServicio, resultadoConversacion.insertId], (error, resultadoContratacion) => {
                                                    if(error) {
                                                        conexion.rollback(function(error) {
                                                            console.log("No se pudo registrar la contratación")
                                                            throw error;
                                                        });
                                                    } else {
                                                        
                                                        var queryParticipantes = "INSERT INTO participacion_conversacion (id_conversacion_participacion, id_perfil_usuario_participacion ) VALUES (?, ?), (?, (SELECT pd.id_perfil_usuario_demandante FROM solicitud_servicio as ss inner join perfil_demandante as pd on pd.id_perfil_demandante = ss.id_perfil_ss_demandante where ss.id_solicitud_servicio = ?))";
                                                        conexion.query(queryParticipantes, [resultadoConversacion.insertId, idAspirante, resultadoConversacion.insertId, idSolicitudServicio], (error) => {
                                                            if(error) {
                                                                conexion.rollback(function(error) {
                                                                    console.log("No se pudo registrar la contratación")
                                                                    throw error;
                                                                });
                                                            } else { 
                                                                conexion.commit(function(error) {
                                                                    if (error) {
                                                                      return connection.rollback(function() {
                                                                        throw error;
                                                                      });
                                                                    }
                                                                    res.status(200).json(mensajes.solicitudServicioAceptada)
                                                                });
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                    
                } catch (error) {
                    res.status(500).json(mensajes.errorInterno);
                } 
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
                            res.status(200).send(mensajes.solicitudServicioRechazada);
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