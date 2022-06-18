const {AspiranteDAO} = require('./data/AspiranteDAO');
const {DemandanteDAO} = require('./data/DemandanteDAO');
const {UsuarioDAO} = require('./data/UsuarioDAO');

exports.GestionUsuarios = class {
    //Usuario
    static getUsuarios(callback) {
        UsuarioDAO.getUsuarios(callback);
    }

    static getUsuario(idUsuario, callback) {
        this.getUsuario(idUsuario, callback);
    }

    static patchFotografiaUsuario(idUsuario, fotografia, callback) {
        
    }


    //Aspirante
    static getAspirantes(callback) {
        AspiranteDAO.getAspirantes(callback);
    }

    static getAspirante(idUsuario, callback) {
        AspiranteDAO.getAspirante(idUsuario, callback);
    }

    static getVideoAspirante(idAspirante, callback) {
        AspiranteDAO.getVideoAspirante(idAspirante, callback);
    }

    static postAspirante(aspirante, callback) {
        AspiranteDAO.postAspirante(aspirante, callback);
    }

    static putAspirante(aspirante, callback) {
        AspiranteDAO.putAspirante(aspirante, callback);
    }

    //Demandante
    static getDemandantes(callback) {
        DemandanteDAO.getDemandantes(callback);
    }

    static getDemandante(idUsuario, callback) {
        DemandanteDAO.getDemandante(idUsuario, callback);
    }

    static postDemandante(demandante, callback) {
        DemandanteDAO.postDemandante(demandante, callback);
    }

    static putDemandante(demandante, callback) {
        DemandanteDAO.putDemandante(demandante, callback);
    }

    //Empleador


    //Administrador
}