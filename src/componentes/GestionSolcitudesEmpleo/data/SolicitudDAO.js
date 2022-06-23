const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.SolicitudDAO = class SolicitudDAO {

    static existeSolicitud(idSolicitudEmpleo, callback){
        var pool = mysqlConnection
    
        pool.query('SELECT * FROM solicitud_aspirante WHERE id_solicitud_aspirante = ?;',[idSolicitudEmpleo] , (error, resultadoSolicitudEmpleo)=>{
            if(error){ 
                MostrarError.MostrarError(error, 'SolicitudDAO | Metodo: existeSolicitud')
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoSolicitudEmpleo.length == 0){
                console.log('No se encontro la solicitud')
                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                
                const solicitudEmpleo = resultadoSolicitudEmpleo[0];
    
                //Caso que la solicitud ya fue aceptada
                if(solicitudEmpleo['estatus'] == 0){
                    console.log('No se puede aprobar una solicitud que ya cuenta con el estado de aporbada')
                    callback(403, mensajes.prohibido)
                //Caso que la solicitud fue rechazada
                }else if(solicitudEmpleo['estatus'] == -1){
                    
                    console.log('No se puede aprobar una solicitud que ya cuenta con el estado de rechazada')
                    callback(403, mensajes.prohibido)
                //El reporte esta pendiente
                }else if(solicitudEmpleo['estatus'] == 1){
                    console.log(solicitudEmpleo)
                    callback(200, solicitudEmpleo)
    
                }else{  
                    console.log('No se pudo comprender la solicitud')
                    callback(400, mensajes.peticionIncorrecta)
                }   
    
    
            }
        });
    
    }

    static aceptarSolicitud(idSolicitudEmpleo, callback){
        var pool = mysqlConnection
    
        pool.query('UPDATE solicitud_aspirante SET estatus = 0 WHERE id_solicitud_aspirante = ?;',[idSolicitudEmpleo] , (error, resultadoSolicitudEmpleo)=>{
            if(error){ 
                    
                MostrarError.MostrarError(error, 'SolicitudDAO | Metodo: aceptarSolicitud')
                callback(500, mensajes.errorInterno)
            }else if(resultadoSolicitudEmpleo.length == 0){
                console.log('No se acepto la solicitud')
                callback(404,mensajes.peticionNoEncontrada)
                
    
            }else{
                console.log('Se proceso correctamente la acción aceptar solicitud: ' + idSolicitudEmpleo)
                callback(200, resultadoSolicitudEmpleo['changedRows'])
    
            }
        });
    
    }

    
}