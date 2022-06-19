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

    static getContratacionDeAspirante(idAspirante, IdContratacionEmpleo, callback) {
        ContratacionDAO.getContratacionDeAspirante(idAspirante, IdContratacionEmpleo, callback);
    }

    static evaluarEmpleador(idAspirante, IdContratacionEmpleo, puntuacion, callback) {
        ContratacionDAO.evaluarEmpleador(idAspirante, IdContratacionEmpleo, puntuacion, callback);
    }
}