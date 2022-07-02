const { ContratacionDAO } = require("./data/ContratacionDAO")

exports.GestionContratacionesEmpleo = class GestionContratacionesEmpleo {
    //Empleador
    static getContratacionEmpleo(idOfertaEmpleo, callback) {
        ContratacionDAO.getContratacionEmpleo(idOfertaEmpleo, callback);
    }

    static patchEvaluarAspiranteContratado(idOfertaEmpleo, idAspirante, valoracionAspirante, callback) {
        ContratacionDAO.patchEvaluarAspiranteContratado(idOfertaEmpleo, idAspirante, valoracionAspirante, callback);
    }

    //Aspirante
    static getContratacionesDeAspirante(idAspirante, callback) {
        ContratacionDAO.getContratacionesDeAspirante(idAspirante, callback);
    }

    static getContratacionDeAspirante(idAspirante, idContratacionEmpleo, callback) {
        ContratacionDAO.getContratacionDeAspirante(idAspirante, idContratacionEmpleo, callback);
    }

    static evaluarEmpleador(idAspirante, idContratacionEmpleo, puntuacion, callback) {
        ContratacionDAO.evaluarEmpleador(idAspirante, idContratacionEmpleo, puntuacion, callback);
    }
}