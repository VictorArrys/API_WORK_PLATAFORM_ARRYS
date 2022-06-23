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
                const reportesVacios = []
                callback(200, reportesVacios)
     
            }else{
                
                var reportesEmpleo = resultadoReportesEmpleo;                         
                callback(200, reportesEmpleo)

            }
        });
    }

    static getReporteEmpleo(idReporteEmpleo, callback) {
        var pool = mysqlConnection;

        pool.query('SELECT * FROM reporte_empleo WHERE id_reporte_empleo = ?', [idReporteEmpleo] , (error, resultadoReporteEmpleo)=>{
            if(error){ 
                MostrarError.MostrarError(error, 'GetReporteEmpleo')
                callback(500,mensajes.errorInterno)
            }else if(resultadoReporteEmpleo[0].length == 0){
    
                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                
                var reporteEmpleo = resultadoReporteEmpleo[0];
                
                //Caso que el reporte ya fue atendido
                if(reporteEmpleo['estatus'] == 0){
                    callback(404, mensajes.peticionNoEncontrada)
                //Caso que el reporte fue rechazado
                }else if(reporteEmpleo['estatus'] == -1){
                    callback(400, mensajes.peticionIncorrecta)
                //El reporte esta pendiente
                }else if(reporteEmpleo['estatus'] == 1){

                    callback(200,reporteEmpleo)
                    
                }else{
                    callback(400, mensajes.peticionIncorrecta)
                }          
    
            }
        });
    }

    static aceptarReporteEmpleo(idReporteEmpleo, callback) {
        var pool = mysqlConnection;

        pool.query('SELECT reporte_empleo.*, perfil_empleador.id_perfil_empleador as idEmpleador FROM reporte_empleo INNER JOIN perfil_aspirante ON perfil_aspirante.id_perfil_aspirante = reporte_empleo.id_perfil_aspirante_re INNER JOIN oferta_empleo ON reporte_empleo.id_oferta_empleo_re = oferta_empleo.id_oferta_empleo INNER JOIN perfil_empleador ON perfil_empleador.id_perfil_empleador = oferta_empleo.id_perfil_oe_empleador WHERE id_reporte_empleo = ?;',[idReporteEmpleo] , (error, resultadoReporteEmpleo)=>{
            if(error){ 
                console.log(error)
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoReporteEmpleo[0].length == 0){
                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                var reporteEmpleo = resultadoReporteEmpleo[0];
                
                //Caso que el reporte ya fue atendido
                if(reporteEmpleo['estatus'] == 0){
                    callback(404, mensajes.peticionNoEncontrada)
                //Caso que el reporte fue rechazado
                }else if(reporteEmpleo['estatus'] == -1){
                    callback(400, mensajes.peticionIncorrecta)
                //El reporte esta pendiente
                }else if(reporteEmpleo['estatus'] == 1){

                    pool.query('UPDATE reporte_empleo SET estatus = 0 WHERE id_oferta_empleo_re = ?;',[reporteEmpleo['id_oferta_empleo_re']] , (error, resultadoReporteEmpleo)=>{
                        if(error){ 
                            console.log(error)
                            callback(500, mensajes.errorInterno)                           
                            
                        }else if(resultadoReporteEmpleo.length == 0){
                            callback(404, mensajes.peticionNoEncontrada)
                
                        }else{
                            callback(200, reporteEmpleo)            
                
                        }
                    });

                }else{
                    res.status(400)
                    res.json(mensajes.peticionIncorrecta);
                }          
    
            }
        });

        
    }

    static rechazarReporteEmpleo(idReporteEmpleo, callback) {
        var pool = mysqlConnection;

        pool.query('UPDATE reporte_empleo SET estatus = -1 WHERE id_reporte_empleo = ?;',[idReporteEmpleo] , (error, resultadoReporteEmpleo)=>{
            if(error){ 
                callback(500, mensajes.errorInterno)
            }else if(resultadoReporteEmpleo.length == 0){
                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                
                callback(200, '')
            }
        });
    }

    //Aspirante
    static postReporteEmpleo(reporteNuevo, callback) {
        
    }
}