const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

function obtenerFechaActual(){
    let fechaActual = new Date()
    let meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    //Estructurar la fecha

    let month = fechaActual.getMonth()
    let day = fechaActual.getDate()
    let year = fechaActual.getFullYear()

    let fechaEstructurada = year + '-'  + meses[month] + '-' + day

    console.log(fechaEstructurada)
    return fechaEstructurada
}

exports.ContratacionDAO = class ContratacionDAO {

    static existeContratacion(solicitudEmpleo, callback){
        var pool = mysqlConnection
        console.log(solicitudEmpleo)
        pool.query('SELECT * FROM contratacion_empleo WHERE id_oferta_empleo_coe = ?;',[solicitudEmpleo['id_oferta_empleo_sa']] , (error, existeContratacion)=>{
            if(error){
                MostrarError.MostrarError(error, 'ContratacionDAO | Metodo: existeContratacion')
                callback(500, mensajes.errorInterno)
    
            }else if(existeContratacion.length == 0){
                
                console.log('No existe la contratación')
                callback(200, 0)

            }else{ //En caso de existir la contratación solo agregamos el aspirante a ella
                console.log('Contratacion sssss: ' + existeContratacion[0]['id_contratacion_empleo'])
                callback(200,existeContratacion[0])
                
            }
    
        });  
    
    }

    
    static crearContratacion(solicitudEmpleo, idConversacion, callback){
        var pool = mysqlConnection
        // Si aun no existe obtenemos los datos de la oferta para luego crear la contratacion_empleo
    
        pool.query('SELECT * FROM oferta_empleo WHERE id_oferta_empleo= ?;',[solicitudEmpleo['id_oferta_empleo_sa']] , (error, resultadoOfertaEmpleo)=>{
            if(error){ 
                cMostrarError.MostrarError(error, 'ContratacionDAO | Metodo: crearContratacion | Paso: existeOfertaEmpleo')
                callback(500, mensajes.errorInterno)
            }else if(resultadoOfertaEmpleo.length == 0){
                
                console.log('No se encontro la oferta de empleo')
                callback(404, mensajes.peticionNoEncontrada)
    
            }else{
                const ofertaEmpleo = resultadoOfertaEmpleo[0]
                const fechaContratacion = obtenerFechaActual()
                const fechaFinalizacion = ofertaEmpleo['fecha_finalizacion']
                
                //Creamos la contratacion
                //Estatus de la contratación {1: En curso, 0: Terminada}
                mysqlConnection.query('INSERT INTO contratacion_empleo(id_oferta_empleo_coe, fecha_contratacion, fecha_finalizacion, estatus, id_conversacion_coe) VALUES(?, ? ,? , ?, ?);',[solicitudEmpleo['id_oferta_empleo_sa'], fechaContratacion, fechaFinalizacion, 1, idConversacion] , (error, resultadoContratacion)=>{
                    if(error){ 
                        MostrarError.MostrarError(error, 'ContratacionDAO | Metodo: crearContratacion | Paso: crear nueva conversacion')
                        callback(500, mensajes.errorInterno)
                    }else if(resultadoContratacion.length == 0){  
                        console.log('No se creo la contratación')
                        callback(404, mensajes.peticionNoEncontrada)                                         
            
                    }else{
                        
                        const contratacionNueva = resultadoContratacion
                        console.log(contratacionNueva)
                        callback(201, contratacionNueva['insertId'])
                    
                    }
    
                });    
            }
    
    });     
    
    }


    static crearContratacionAspirante(contratacion ,idAspirante, idEmpleador, callback){

        mysqlConnection.query('INSERT INTO contratacion_empleo_aspirante(id_contratacion_empleo_cea, id_perfil_aspirante_cea, id_perfil_empleador_cea, valoracion_aspirante, valoracion_empleador) VALUES(?, ?, ?, ?, ?)',[contratacion ,idAspirante, idEmpleador, 0, 0] , (error, resultadoContratacionAspirante)=>{
            if(error){ 
                MostrarError.MostrarError(error, 'ContratacionDAO | Metodo: crearContratacionAspirante')
                callback(500, mensajes.errorInterno)
            }else if(resultadoContratacionAspirante.length == 0){
    
                console.log('No se creo la contratación aspirante')
                callback(404, mensajes.peticionNoEncontrada)
            }else{
                const contratacionEmpleoAspirante = resultadoContratacionAspirante
                console.log(contratacionEmpleoAspirante['affectedRows'])
                callback(201, contratacionEmpleoAspirante['affectedRows'])
                
            }
    
        });
    }


    
}