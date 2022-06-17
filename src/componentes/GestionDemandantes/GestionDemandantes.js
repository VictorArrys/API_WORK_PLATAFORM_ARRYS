const {DemandanteDAO} = require('./dao/DemandanteDAO')

exports.GestionDemandantes = class GestionDemandantes {
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
}