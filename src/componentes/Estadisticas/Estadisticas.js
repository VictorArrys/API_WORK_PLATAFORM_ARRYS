const { EstadisticasDAO } = require("./data/EstadisticasDAO")

exports.Estadisticas = class Estadisticas {

    static estadisticaUsoPlataforma(callback) {
        EstadisticasDAO.estadisticaUsoPlataforma(callback)
    }

    static estadisticaEmpleos (callback) {
        EstadisticasDAO.estadisticaEmpleos(callback)
    }

    static estadisticasOfertasEmpleo(callback) {
        EstadisticasDAO.estadisticasOfertasEmpleo(callback)
    }

    static valoracionesAspirante(callback) {
        EstadisticasDAO.valoracionesAspirante(callback)
    }

    static valoracionesEmpleador(callback) {
        EstadisticasDAO.valoracionesEmpleador(callback)
    }

    
}