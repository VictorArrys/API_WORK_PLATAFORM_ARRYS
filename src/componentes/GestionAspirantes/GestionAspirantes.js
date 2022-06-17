const {AspiranteDAO} = require('./dao/AspiranteDAO')

exports.GestionAspirantes = class GestionAspirantes {
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
}