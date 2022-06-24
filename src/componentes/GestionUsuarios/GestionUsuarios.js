const {AspiranteDAO} = require('./data/AspiranteDAO');
const {DemandanteDAO} = require('./data/DemandanteDAO');
const {UsuarioDAO} = require('./data/UsuarioDAO');
const {EmpleadorDAO} = require('./data/EmpleadorDAO');
const {AdministradorDAO} = require('./data/AdministradorDAO');

exports.GestionUsuarios = class {
    //Usuario
    static getUsuarios(callback) {
        UsuarioDAO.getUsuarios(callback);
    }

    static getUsuario(idUsuario, callback) {
        UsuarioDAO.getUsuario(idUsuario, callback);
    }

    static patchFotografiaUsuario(idUsuario, fotografia, callback) {
        UsuarioDAO.patchFotografiaUsuario(idUsuario, fotografia, callback);
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

    static getVideo(idAspirante, callback){
        AspiranteDAO.getVideoAspirante(idAspirante, callback);
    }

    static patchVideo(video, idAspirante, callback){
        AspiranteDAO.patchVideoAspirante(video, idAspirante,callback);
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
    static getEmpleadores(callback) {
        EmpleadorDAO.getEmpleadores(callback);
    }

    static getEmpleador(idEmpleador, callback) {
        EmpleadorDAO.getEmpleador(idEmpleador, callback);
    }

    static postEmpleador(empleadorNuevo, callback) {
        EmpleadorDAO.postEmpleador(empleadorNuevo, callback);
    }

    static putEmpleador(empleador, callback) {
        EmpleadorDAO.putEmpleador(empleador, callback)
    }

    //Administrador
    static getAdministradores(callback) {
        AdministradorDAO.getAdministradores(callback);
    }

    static getAdministrador(idUsuario, callback) {
        AdministradorDAO.getAdministrador(idUsuario, callback);
    }

    static putAdministrador(administrador, callback) {
        AdministradorDAO.putAdministrador(administrador, callback);
    }
}