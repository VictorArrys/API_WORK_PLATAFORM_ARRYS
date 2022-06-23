const {ReporteEmpleo} = require('./modelo/ReporteEmpleo');
const {ReporteEmpleoDAO} = require('./data/ReporteEmpleoDAO');
const {EmpleadorDAO} = require('./data/EmpleadorDAO');

exports.ResportesEmpleo = class ReportesEmpleo {
    //Administrador
    static getReportesEmpleo(callback) {
        ReporteEmpleoDAO.getReportesEmpleo(callback);
    }

    static getReporteEmpleo(idReporteEmpleo, callback) {
        ReporteEmpleoDAO.getReporteEmpleo(idReporteEmpleo, callback);
    }

    static aceptarReporteEmpleo(idReporteEmpleo, callback) {
        ReporteEmpleoDAO.aceptarReporteEmpleo(idReporteEmpleo, (codigoRespuesta, cuerpoReporteEmpleo)=>{
            if(codigoRespuesta == 200) {
                EmpleadorDAO.amonestarEmpleador(cuerpoReporteEmpleo['idEmpleador'], (codigoRespuesta, resultadoAmonestar)=>{

                    callback(codigoRespuesta, resultadoAmonestar)
                })

            }else {
                callback(codigoRespuesta, cuerpoReporteEmpleo)
            }
        });
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