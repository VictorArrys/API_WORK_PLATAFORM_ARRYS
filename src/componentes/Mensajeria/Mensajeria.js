const {MensajeDAO} = require('./data/MensajeDAO');
const {ConversacionDAO} = require('./data/ConversacionDAO');

exports.Mensajeria = class Mensajeria {
    
    //Registro de mensajes
    static postMensajeDemandante(idDemandante, idConversacion, mensaje, callback){
        MensajeDAO.postMensajeDemandante(idDemandante,idConversacion, mensaje, callback);
    }

    static postMensajeAspirante(idAspirante, idConversacion, mensaje, callback) {
        MensajeDAO.postMensajeAspirante(idAspirante, idConversacion, mensaje, callback);
    }

    static postMensajeEmpleador(idEmpleador, idConversacion, mensaje, callback) {
        MensajeDAO.postMensajeEmpleador(idEmpleador, idConversacion, mensaje, callback)
    }

    //Consulta de conversaciones
    static getConversacionesAspirante(idAspirante, callback) {
        ConversacionDAO.getConversacionesAspirante(idAspirante, callback);
    }

    static getConversacionAspirante(idAspirante, idConversacion, callback){
        ConversacionDAO.getConversacionAspirante(idAspirante, idConversacion, callback)
    }

    static getConversacionesDemandante(idDemandante, callback) {
        ConversacionDAO.getConversacionesDemandante(idDemandante, callback)
    }

    static getConversacionDemandante(idDemandante, idConversacion, callback){
        ConversacionDAO.getConversacionDemandante(idDemandante, idConversacion, callback)
    }

    static getConversacionesEmpleador(idEmpleador, callback) {
        ConversacionDAO.getConversacionesEmpleador(idEmpleador, callback);
    }

    static getConversacionEmpleador(idEmpleador, idConversacion, callback){
        ConversacionDAO.getConversacionEmpleador(idEmpleador, idConversacion, callback)
    }
}