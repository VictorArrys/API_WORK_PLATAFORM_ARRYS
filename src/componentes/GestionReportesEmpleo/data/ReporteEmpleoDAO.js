const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
//dataType


exports.ReporteEmpleoDAO = class ReporteEmpleoDAO {
    //Administrador
    static getReportesEmpleo(callback) {
        var pool = mysqlConnection;
 
        pool.query('SELECT reporte_empleo.*, perfil_aspirante.nombre as aspirante, oferta_empleo.nombre, oferta_empleo.descripcion, perfil_empleador.id_perfil_empleador as idEmpleador, perfil_empleador.nombre as empleador FROM reporte_empleo INNER JOIN perfil_aspirante ON perfil_aspirante.id_perfil_aspirante = reporte_empleo.id_perfil_aspirante_re INNER JOIN oferta_empleo ON reporte_empleo.id_oferta_empleo_re = oferta_empleo.id_oferta_empleo INNER JOIN perfil_empleador ON perfil_empleador.id_perfil_empleador = oferta_empleo.id_perfil_oe_empleador WHERE estatus = 1;', (error, resultadoReportesEmpleo)=>{
            if(error){ 
                MostrarError.MostrarError(error, 'GetReportesEmpleo')
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoReportesEmpleo.length == 0){
    
                res.status(200)
                const reportesVacios = []
                res.json(reportesVacios);  
     
            }else{
                
                var reportesEmpleo = resultadoReportesEmpleo;
                res.status(200);                  
                res.json(reportesEmpleo);            
    
            }
        });
    }

    static getReporteEmpleo(idReporteEmpleo, callback) {

    }

    static aceptarReporteEmpleo(idReporteEmpleo, callback) {

    }

    static rechazarReporteEmpleo(idReporteEmpleo, callback) {
        
    }

    //Aspirante
    static postReporteEmpleo(reporteNuevo, callback) {
        
    }
}