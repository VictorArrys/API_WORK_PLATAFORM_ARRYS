const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.ConversacionDAO = class ConversacionDAO {

    static crearConversacion(solicitudEmpleo, callback){
        var pool = mysqlConnection
        // Si aun no existe obtenemos los datos de la oferta para luego crear la contratacion_empleo
    
        pool.query('SELECT * FROM oferta_empleo WHERE id_oferta_empleo= ?;',[solicitudEmpleo['id_oferta_empleo_sa']] , (error, resultadoOfertaEmpleo)=>{
            if(error){ 
                console.log('Error: ')
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoOfertaEmpleo.length == 0){
                
                console.log('No se encontro la oferta de empleo')
                this.call(404, mensajes.peticionNoEncontrada)
    
            }else{
                const ofertaEmpleo = resultadoOfertaEmpleo[0]
                
                const fechaContratacion = obtenerFechaActual()
                const nombreEmpleo = ofertaEmpleo['nombre']
                
                //Creamos la conversacion
                mysqlConnection.query('INSERT INTO conversacion(nombre_empleo, nombre, fecha_contratacion) VALUES(? ,? ,?);',[nombreEmpleo, 'oferta_empleo', fechaContratacion] , (error, resultadoConversacion)=>{
                    if(error){ 
                        console.log('Error: ')
                        callback(500, mensajes.errorInterno)
                    }else if(resultadoConversacion.length == 0){  
                        console.log('No se creo la conversación')
                        callback(404, mensajes.peticionNoEncontrada)
            
                    }else{
                        const conversacionCreada = resultadoConversacion
                        callback(201, conversacionCreada['insertId'])
    
                    }
    
                });    
            }
    
        });     
    
    }


    
}