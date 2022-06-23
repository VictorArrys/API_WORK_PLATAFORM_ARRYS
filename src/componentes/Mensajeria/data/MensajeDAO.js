var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
const { Mensaje } = require('../modelo/Mensaje');


exports.MensajeDAO = class MensajeDAO {
    static postMensajeDemandante(idDemandante, idConversacion, mensaje, callback){
        var queryConversacion = "INSERT INTO mensaje (id_conversación_mensaje, id_usuario_remitente, mensaje, fechaRegistro) " +
                                "VALUES (?,(SELECT id_perfil_usuario_demandante FROM perfil_demandante WHERE id_perfil_demandante = ?),?,NOW());";
        
        mysqlConnection.query(queryConversacion, [idConversacion, idDemandante, mensaje], (error, resultadoMensaje) => {
            if(error){ 
                callback(500, mensajes.errorInterno)
            } else {
                var queryMensaje = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_mensaje = ?";
                mysqlConnection.query(queryMensaje, [resultadoMensaje.insertId], (error, resultado) => {
                    if(error){ 
                        callback(500, mensajes.errorInterno)
                    } else {
                        var fila = resultado[0];
                        var nuevoMensaje = new Mensaje();
                        nuevoMensaje.idMensaje = fila["idMensaje"];
                        nuevoMensaje.idUsuarioRemitente = fila["idUsuarioRemitente"];
                        nuevoMensaje.fechaRegistro = fila["fechaRegistro"];
                        nuevoMensaje.remitente = fila["remitente"];
                        nuevoMensaje.contenidoMensaje = fila["contenidoMensaje"];
                        nuevoMensaje.tipoUsuario = fila["tipoUsuario"];
                        callback(201, nuevoMensaje);
                    }
                });
            }
        });
    }

    static postMensajeAspirante(idAspirante, idConversacion, mensaje, callback) {
        var queryConversacion = "INSERT INTO mensaje (id_conversación_mensaje, id_usuario_remitente, mensaje, fechaRegistro) " +
                                "VALUES (?,(SELECT id_perfil_usuario_aspirante FROM perfil_aspirante WHERE id_perfil_aspirante = ?),?,NOW());";
        
        mysqlConnection.query(queryConversacion, [idConversacion, idAspirante, mensaje], (error, resultadoMensaje) => {
            if(error){ 
                callback(500, mensajes.errorInterno)
            } else {
                var queryMensaje = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_mensaje = ?";
                mysqlConnection.query(queryMensaje, [resultadoMensaje.insertId], (error, resultado) => {
                    if(error){ 
                        callback(500, mensajes.errorInterno)
                    } else {
                        var fila = resultado[0];
                        var nuevoMensaje = new Mensaje();
                        nuevoMensaje.idMensaje = fila["idMensaje"];
                        nuevoMensaje.idUsuarioRemitente = fila["idUsuarioRemitente"];
                        nuevoMensaje.fechaRegistro = fila["fechaRegistro"];
                        nuevoMensaje.remitente = fila["remitente"];
                        nuevoMensaje.contenidoMensaje = fila["contenidoMensaje"];
                        nuevoMensaje.tipoUsuario = fila["tipoUsuario"];
                        callback(201, nuevoMensaje);
                    }
                });
            }
        });
    }

    static postMensajeEmpleador(idEmpleador, idConversacion, mensaje, callback) {
        var queryConversacion = "INSERT INTO mensaje (id_conversación_mensaje, id_usuario_remitente, mensaje, fechaRegistro) " +
                                "VALUES (?,(SELECT id_perfil_usuario_empleador FROM perfil_empleador WHERE id_perfil_empleador = ?),?,NOW());";
        
        mysqlConnection.query(queryConversacion, [idConversacion, idEmpleador, mensaje], (error, resultadoMensaje) => {
            if(error){ 
                callback(500, mensajes.errorInterno)
            } else {
                var queryMensaje = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_mensaje = ?";
                mysqlConnection.query(queryMensaje, [resultadoMensaje.insertId], (error, resultado) => {
                    if(error){ 
                        callback(500, mensajes.errorInterno)
                    } else {
                        var fila = resultado[0];
                        var nuevoMensaje = new Mensaje();
                        nuevoMensaje.idMensaje = fila["idMensaje"];
                        nuevoMensaje.idUsuarioRemitente = fila["idUsuarioRemitente"];
                        nuevoMensaje.fechaRegistro = fila["fechaRegistro"];
                        nuevoMensaje.remitente = fila["remitente"];
                        nuevoMensaje.contenidoMensaje = fila["contenidoMensaje"];
                        nuevoMensaje.tipoUsuario = fila["tipoUsuario"];
                        callback(201, nuevoMensaje);
                    }
                });
            }
        });
    }

    static getMensajes(idConversacion, callback) {
        var queryMensajes = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_conversación_mensaje = ?";
        mysqlConnection.query(queryMensajes, [idConversacion], (error, resultado) => {
            if(error){ 
                callback(500, mensajes.errorInterno);
            } else {
                var listaMensajes = [];
                resultado.forEach( fila => {
                    var mensaje = new Mensaje();
                    mensaje.idMensaje = fila["idMensaje"];
                    mensaje.idUsuarioRemitente = fila["idUsuarioRemitente"];
                    mensaje.fechaRegistro = fila["fechaRegistro"];
                    mensaje.contenidoMensaje = fila["contenidoMensaje"];
                    mensaje.tipoUsuario = fila["tipoUsuario"];
                    listaMensajes.push(mensaje);
                });
               
                callback(200, listaMensajes);
            }
        });
    }
}