var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
const { Mensaje } = require('../modelo/Mensaje');


exports.MensajeDAO = class MensajeDAO {
    static postMensajeDemandante(idDemandante, idConversacion, mensaje, callback){

    }

    static postMensajeAspirante(idAspirante, idConversacion, mensaje, callback) {

    }

    static postMensajeEmpleador(idAspirante, idConversacion, mensaje, callback) {

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