var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
const { ConversacionDemandante } = require('../datatype/Conversacion');
const { MensajeDAO } = require('./MensajeDAO');

exports.ConversacionDAO = class ConversacionDAO {
    static getConversacionesAspirante(idAspirante, callback) {

    }

    static getConversacionAspirante(idAspirante, idConversacion, callback){

    }

    static getConversacionesDemandante(idDemandante, callback) {

    }

    static getConversacionDemandante(idDemandante, idConversacion, callback){
        var queryConversacion = "SELECT id_conversacion, nombre_empleo FROM " +
                                "conversacion AS c INNER JOIN contratacion_servicio as cs " +
                                "ON cs.id_contratacion_servicio = c.id_conversacion WHERE " +
                                "c.id_conversacion = ? AND cs.id_perfil_demandante_cs = ?;";
        
        mysqlConnection.query(queryConversacion, [idConversacion, idDemandante], (error, resultado) => {
            if(error){ 
                callback(500, mensajes.errorInterno);
            } else if(resultado.length == 0){
                callback(404, mensajes.peticionNoEncontrada);
            } else {
                MensajeDAO.getMensajes(idConversacion, (codigoRespuesta, cuerpoRespuesta) => {
                    if (codigoRespuesta == 200) {
                        var conversacion = new ConversacionDemandante();
                        conversacion.idConversacion = resultado[0]['id_conversacion'];
                        conversacion.tituloSolicitud = resultado[0]['nombre_empleo'];
                        conversacion.mensajes = cuerpoRespuesta;
                    } else {
                        callback(codigoRespuesta, cuerpoRespuesta);
                    }
                });
            }
        });
    }

    static getConversacionesEmpleador(idEmpleador, callback) {

    }

    static getConversacionEmpleador(idEmpleador, idConversacion, callback){
        
    }
}