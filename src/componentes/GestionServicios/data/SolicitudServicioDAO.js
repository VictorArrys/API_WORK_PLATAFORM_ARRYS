var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.SolicitudServicioDAO = class SolicitudServicioDAO {
    static postSolicitudServicio(solicitud, callback) {
        var query = "INSERT INTO solicitud_servicio ( id_perfil_ss_aspirante, id_perfil_ss_demandante, titulo, estatus, registro, descripcion) VALUES ( ?, ?, ?, 0, NOW(), ?);";
        mysqlConnection.query(query, [solicitud.idPerfilAspirante, solicitud.idDemandante, solicitud.titulo, solicitud.descripcion], (error, resultadoRegistro) => {
            if(error){ 
                callback(500, mensajes.errorInterno);
            } else {
                var querySolicitudRegistrada = "select * from solicitud_servicio where id_solicitud_servicio = ?";
                mysqlConnection.query(querySolicitudRegistrada, [resultadoRegistro.insertId], (error, resultadoSelect) => {
                    if (error){
                        callback(500, mensajes.errorInterno);
                    } else {
                        var solicitudNueva = {};
                        solicitudNueva = {
                            "idSolicitudServicio": resultadoSelect[0]['id_solicitud_servicio'],
                            "titulo": resultadoSelect[0]['titulo'],
                            "descripcion": resultadoSelect[0]['descripcion'],                  
                            "estatus": resultadoSelect[0]['estatus'],
                            "fechaRegistro": resultadoSelect[0]['registro'],
                            "idPerfilDemandante": resultadoSelect[0]['id_perfil_ss_demandante'],
                            "idPerfilAspirante": resultadoSelect[0]['id_perfil_ss_aspirante']
                        }

                        callback(201, solicitudNueva);
                    }
                });
            }
        });
    }

    static getSolicitudesServicioDemandante(idDemandante, callback) {
        var query = "SELECT * FROM deser_el_camello.solicitud_servicio where id_perfil_ss_demandante = ?;";
        mysqlConnection.query(query, [idDemandante], (error, resultado) => {
            if(error){ 
                callback(500, mensajes.errorInterno)
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
                callback(200, listaSolicitudes);
            }
        });
    }

    static getSolicitudesServicioAspirante(idAspirante, estatus, callback) {
        var filtroEstatus = "";
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

        var query = "SELECT ss.*, pd.nonbre FROM solicitud_servicio as ss inner join perfil_demandante as pd ON ss.id_perfil_ss_demandante = pd.id_perfil_demandante where id_perfil_ss_aspirante = ? " + filtroEstatus + ";";
        mysqlConnection.query(query, [idAspirante], (error, resultado) => {
            if(error){ 
                callback(500, mensajes.errorInterno)
            } else {
                var listaSolicitudes = [];
                resultado.forEach(fila => {
                    var solicitud = {};
                    solicitud = {
                        "idSolicitudServicio": fila['id_solicitud_servicio'],
                        "titulo": fila['titulo'],
                        //"descripcion": fila['descripcion'],                  
                        "estatus": fila['estatus'],
                        "fechaRegistro": fila['registro'],
                        "demandante" : {
                            "idPerfilDemandante" : fila['id_perfil_ss_demandante'],
                            "nombre" : fila["nombre"],
                        },
                        "idPerfilAspirante": fila['id_perfil_ss_aspirante']
                    }
                    listaSolicitudes.push(solicitud);
                });
                callback(200, listaSolicitudes);
            }
        });
    }

    static getSolicitudServicioAspirante(idAspirante, idSolicitud, callback) {
        var query = "SELECT ss.*, pd.nonbre as nombre FROM solicitud_servicio as ss inner join perfil_demandante as pd ON (ss.id_perfil_ss_demandante = pd.id_perfil_demandante) where id_perfil_ss_aspirante = ? AND id_solicitud_servicio = ?;";
        mysqlConnection.query(query, [idAspirante, idSolicitud], (error, resultado) => {
            if(error){ 
                callback(500, mensajes.errorInterno);
            } else {
                if (resultado.length > 0) {
                    var solicitudServicio = resultado[0];
                    var solicitud = {};
                    solicitud = {
                        "idSolicitudServicio": solicitudServicio['id_solicitud_servicio'],
                        "titulo": solicitudServicio['titulo'],
                        "estatus": solicitudServicio['estatus'],
                        "fechaRegistro": solicitudServicio['registro'],
                        "descripcion": solicitudServicio['descripcion'],
                        "demandante" : {
                            "idPerfilDemandante" : solicitudServicio['id_perfil_ss_demandante'],
                            "nombre" : solicitudServicio["nombre"],
                        },
                        "idPerfilAspirante": solicitudServicio['id_perfil_ss_aspirante']
                    }
                    callback(200, solicitud);
                } else {
                    callback(404, mensajes.peticionNoEncontrada);
                }
            }
        });
    }

    static aceptarSolicitud(idAspirante, idSolicitudServicio, callback) {
        //comprobar que la solicitud este pendiente
        var queryComprobacion = "select count(*) as estaPendiente from solicitud_servicio where id_solicitud_servicio = ? AND estatus = 0"
        mysqlConnection.query(queryComprobacion, [idSolicitudServicio], (error, resultadoComprobacion) => {
            if (error) {
                console.log("Error comprobación")
                callback(500, mensajes.errorInterno);
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
                                        var queryConversacion = "INSERT INTO conversacion (nombre_empleo , nombre, fecha_contratacion) VALUES ( (SELECT titulo FROM solicitud_servicio WHERE id_solicitud_servicio = ?), (SELECT nonbre FROM perfil_demandante INNER JOIN solicitud_servicio ON (id_perfil_demandante = id_perfil_ss_demandante) WHERE id_solicitud_servicio = ?), date_format(NOW(), \"%Y-%m-%d\") );";
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
                                                        
                                                        var queryParticipantes = "INSERT INTO participacion_conversacion (id_conversacion_participacion, id_perfil_usuario_participacion ) VALUES (?, (SELECT id_perfil_usuario_aspirante FROM deser_el_camello.perfil_aspirante where id_perfil_aspirante = ?)), (?, (SELECT pd.id_perfil_usuario_demandante FROM solicitud_servicio as ss inner join perfil_demandante as pd on pd.id_perfil_demandante = ss.id_perfil_ss_demandante where ss.id_solicitud_servicio = ?))";
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
                                                                    } else {
                                                                        callback(200, mensajes.solicitudServicioAceptada)
                                                                    }
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
                    callback(500, mensajes.errorInterno);
                } 
            } else {
                callback(409, mensajes.solicitudServicioAtendida);
            }
        });
    }

    static rechazarSolicitud(idAspirante, idSolicitud, callback) {
        var queryComprobacion = "select count(*) as estaPendiente from solicitud_servicio where id_solicitud_servicio = ? AND estatus = 0"
        mysqlConnection.query(queryComprobacion, [idSolicitud], (error, resultadoComprobacion) => {
            if (error) {
                callback(500, mensajes.errorInterno);
            } else if (resultadoComprobacion[0]['estaPendiente'] == 1) {
                var queryAceptarReporte = "UPDATE solicitud_servicio SET estatus = -1 WHERE id_solicitud_servicio = ? and id_perfil_ss_aspirante = ?;"
                mysqlConnection.query(queryAceptarReporte, [idSolicitud, idAspirante], (error, resultadoAceptar) => {
                    if (error) {
                        callback(500, mensajes.errorInterno);
                    } else {
                        if(resultadoAceptar.affectedRows == 1) {
                            callback(200, mensajes.solicitudServicioRechazada);
                        }
                    }
                });
            } else {
                callback(422, mensajes.solicitudServicioAtendida);
            }
        })
    }
}