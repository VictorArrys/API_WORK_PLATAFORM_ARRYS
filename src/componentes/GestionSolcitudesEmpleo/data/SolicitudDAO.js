const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.SolicitudDAO = class SolicitudDAO {

    static getSolicitudesEmpleo(idOfertaEmpleo, callback){
        var pool = mysqlConnection
        var querySolicitudes = 'SELECT solicitud_aspirante.*, perfil_aspirante.nombre, perfil_aspirante.id_perfil_usuario_aspirante FROM solicitud_aspirante INNER JOIN perfil_aspirante ON perfil_aspirante.id_perfil_aspirante = solicitud_aspirante.id_perfil_aspirante_sa WHERE id_oferta_empleo_sa = ?;'
        // estatus de la solicitud de empleo {1: pendiente, 0: aprobada, -1: rechazada }
        pool.query(querySolicitudes, [idOfertaEmpleo], (error, resultadoSolicitudesEmpleo)=>{
            if(error){ 
                MostrarError.MostrarError(error, 'SolicitudDAO | Metodo: getSolicitudesEmpleo')
                callback(500, mensajes.errorInterno)
            }else if(resultadoSolicitudesEmpleo.length == 0){

                console.log('No se encontro solicitudes de empleo de esta oferta de empleo')
                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                
                var solcitudesEmpleo = resultadoSolicitudesEmpleo;
                callback(200, solcitudesEmpleo)       
    
            }
        });
    }

    static getSolicitudEmpleo(idSolicitudEmpleo, callback){
        var pool = mysqlConnection
        pool.query('SELECT * FROM solicitud_aspirante WHERE id_solicitud_aspirante = ?;',[idSolicitudEmpleo] , (error, resultadoSolicitudEmpleo)=>{
            if(error){ 
                MostrarError.MostrarError(error, 'SolicitudDAO | Metodo: getSolicitudEmpleo')
                callback(500, mensajes.errorInterno)
            }else if(resultadoSolicitudEmpleo.length == 0){
    
                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                
                var solicitudEmpleo = resultadoSolicitudEmpleo[0];
                
                //Caso que el reporte ya fue atendido
                if(solicitudEmpleo['estatus'] == 0){
                    callback(400, mensajes.peticionIncorrecta)
                //Caso que el reporte fue rechazado
                }else if(solicitudEmpleo['estatus'] == -1){
                    callback(400, mensajes.peticionIncorrecta)
                //El reporte esta pendiente
                }else if(solicitudEmpleo['estatus'] == 1){
                    callback(200, solicitudEmpleo)

                }else{
                    callback(400, mensajes.peticionIncorrecta)
                }          
    
            }
        });
    }

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

    static rechazarSolicitud(idSolicitudEmpleo, callback) {
        var pool = mysqlConnection
        pool.query('SELECT * FROM solicitud_aspirante WHERE id_solicitud_aspirante = ?;',[idSolicitudEmpleo] , (error, resultadoSolicitudEmpleo)=>{
            if(error){ 
                MostrarError.MostrarError(error, 'SolicitudDAO | Metodo: rechazarSolicitud')
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoSolicitudEmpleo[0].length == 0){
    
                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                
                var solicitudEmpleo = resultadoSolicitudEmpleo[0];
                
                //Caso que el reporte ya fue atendido
                if(solicitudEmpleo['estatus'] == 0){
                    callback(400, mensajes.peticionIncorrecta)
                //Caso que el reporte fue rechazado
                }else if(solicitudEmpleo['estatus'] == -1){
                    callback(400, mensajes.peticionIncorrecta)
                //El reporte esta pendiente
                }else if(solicitudEmpleo['estatus'] == 1){
                    
                    pool.query('UPDATE solicitud_aspirante SET estatus = ? WHERE id_solicitud_aspirante = ?;',[-1, idSolicitudEmpleo] , (error, resultadoSolicitudEmpleo)=>{
                        if(error){ 
                            MostrarError.MostrarError(error, 'SolicitudDAO | Metodo: rechazarSolicitud | Paso: update')
                            callback(500, mensajes.errorInterno)
                            
                        }else if(resultadoSolicitudEmpleo.length == 0){
                            callback(404, mensajes.peticionNoEncontrada)
                
                        }else{
                            callback(204, '')              
                
                        }
                    });

                }else{
                    callback(400, mensajes.peticionIncorrecta)
                }          
    
            }
        });
    }

    static postSolicitarVacante(idOfertaEmpleo, idAspirante, callback) {
        var queryComprobacion = "SELECT COUNT(*) as numSolicitudes FROM solicitud_aspirante where id_perfil_aspirante_sa = ? and id_oferta_empleo_sa = ?;";
        mysqlConnection.query(queryComprobacion, [idAspirante,idOfertaEmpleo], (error, resultado) => {
            if (error) {
                
                callback(500, mensajes.errorInterno);
            } else {
                var numSolicitud = resultado[0]['numSolicitudes'];
                if (numSolicitud == 0) {
                    querySolicitud = "INSERT INTO solicitud_aspirante ( id_perfil_aspirante_sa, id_oferta_empleo_sa, estatus, fecha_registro) VALUES ( ?, ?, 1, NOW());";
                    mysqlConnection.query(querySolicitud, [idAspirante, idOfertaEmpleo], (error, resultado) => {
                        if (error) {
                            callback(500, mensajes.errorInterno);
                        } else {
                            nuevaSolcitud = {
                                "idSolicitudVacante": resultado.insertId,
                                "estatus": resultado['estatus'],
                                "fechaRegistro": resultado['fecha_registro'],
                                "idOfertaEmpleo": resultado['id_oferta_empleo_sa'],
                                "idPerfilAspirante": resultado['id_perfil_aspirante_sa']
                            }

                            callback(201, nuevaSolcitud);
                        }
                    });
                } else {
                    var queryEstatus = "Select estatus FROM solicitud_aspirante where id_perfil_aspirante_sa = ? and id_oferta_empleo_sa = ?;";
                    mysqlConnection.query(queryEstatus, [idAspirante, idOfertaEmpleo], (error, resultadoConsulta) => {
                        if(error) {
                            callback(500, mensajes.errorInterno);
                        } else {
                            var mensajeRespuesta = "";
                            var estatus = resultadoConsulta[0]['estatus']
                            switch(estatus) {
                                case 0:
                                    mensajeRespuesta = mensajes.solicitudEmpleoAceptada
                                    break;
                                case 1:
                                    mensajeRespuesta = mensajes.solicitudEmpleoPendiente
                                    break;
                                case -1:
                                    mensajeRespuesta = mensajes.solicitudEmpleoRechazada
                                    break;    
                            }
                            callback(422, mensajeRespuesta);
                        }
                    })
                }
            }
        })
    }
}