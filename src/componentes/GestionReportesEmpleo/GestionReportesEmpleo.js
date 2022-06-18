const {ReporteEmpleo} = require('./modelo/ReporteEmpleo');
const {ReporteEmpleoDAO} = require('./data/ReporteEmpleoDAO');

exports.ResportesEmpleo = class ReportesEmpleo {
    //Administrador
    static getReportesEmpleo(callback) {
        ReporteEmpleoDAO.getReportesEmpleo(callback);
    }

    static getReporteEmpleo(idReporteEmpleo, callback) {
        ReporteEmpleoDAO.getReporteEmpleo(idReporteEmpleo, callback);
    }

    static aceptarReporteEmpleo(idReporteEmpleo, callback) {
        ReporteEmpleoDAO.aceptarReporteEmpleo(idReporteEmpleo, callback);
    }

    static rechazarReporteEmpleo(idReporteEmpleo, callback) {
        ReporteEmpleoDAO.rechazarReporteEmpleo(idReporteEmpleo, callback);
    }

    //Aspirante
    static postReporteEmpleo(idOfertaEmpleo, idAspirante, contenidoReporte, callback) {
        var reporteNuevo = new ReporteEmpleo();
        reporteNuevo.estatus = 1;
        reporteNuevo.idPerfilAspirante = idAspirante;
        reporteNuevo.contenidoReporte = contenidoReporte;
        reporteNuevo.idOfertaEmpleo = idOfertaEmpleo;
        ReporteEmpleoDAO.postReporteEmpleo(reporteNuevo, callback);
    }
}