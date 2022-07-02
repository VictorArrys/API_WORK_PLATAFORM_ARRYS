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
                    callback(400, mensajes.peticionIncorrecta);
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
        //Confirmar que existe la oferta
        try {
            var queryOfertaEmpleo = "select count(id_reporte_empleo) AS estaRegistrada from contratacion_empleo_aspirante as cea inner join contratacion_empleo as ce on (cea.id_contratacion_empleo_cea = ce.id_contratacion_empleo) inner join reporte_empleo as re on (re.id_oferta_empleo_re = ce.id_oferta_empleo_coe) where cea.id_perfil_aspirante_cea = re.id_perfil_aspirante_re AND re.id_perfil_aspirante_re = ? AND ce.id_contratacion_empleo = ?;";
            mysqlConnection.query(queryOfertaEmpleo, [ reporteNuevo.idPerfilAspirante, reporteNuevo.idContratacion], (error, resultado) => {
                if(error) {
                    throw error;
                } else {
                    if(resultado[0]['estaRegistrada'] == 0) { //No hau reporte
                        var queryReporte = "INSERT INTO reporte_empleo (id_perfil_aspirante_re, id_oferta_empleo_re, motivo, estatus, fecha_registro) VALUES (?, (SELECT id_oferta_empleo_coe FROM deser_el_camello.contratacion_empleo where id_contratacion_empleo = ?), ?, ?, NOW());"
                        mysqlConnection.query(queryReporte, [reporteNuevo.idPerfilAspirante, reporteNuevo.idContratacion, reporteNuevo.contenidoReporte, reporteNuevo.estatus], (error, resultado)=> {
                            if(error) {
                                throw error;
                            } else {
                                var idNuevoReporte = resultado.insertId;
                                var queryConsulta = "select * from reporte_empleo where id_reporte_empleo = ?";
                                mysqlConnection.query(queryConsulta, [idNuevoReporte], (error, resultadoConsulta) => {
                                    if (error) {
                                        throw error;
                                    } else {
                                        var nuevoReporte = {};
                                        nuevoReporte = {
                                            "idReporteEmpleo": resultadoConsulta[0]['id_reporte_empleo'],
                                            "idOfertaEmpleo": resultadoConsulta[0]['id_oferta_empleo_re'],
                                            "idAspirante" : resultadoConsulta[0]['id_perfil_aspirante_re'],
                                            "estatus": resultadoConsulta[0]['estatus'],
                                            "fechaRegistro": resultadoConsulta[0]['fecha_registro'],
                                            "motivo": resultadoConsulta[0]['motivo']
                                        };
    
                                        callback(201,nuevoReporte);
                                    }
                                });
                            }
                        });
                    } else {
                        callback(422, mensajes.reporteEmpleoRegistrado);
                    }
                }
            });
            
        } catch (error) {
            callback(500, mensajes.errorInterno);
        }
    }
}