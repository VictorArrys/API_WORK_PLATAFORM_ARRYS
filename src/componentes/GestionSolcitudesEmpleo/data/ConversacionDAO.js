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

exports.ConversacionDAO = class ConversacionDAO {

    static crearConversacion(solicitudEmpleo, callback){
        var pool = mysqlConnection
        // Si aun no existe obtenemos los datos de la oferta para luego crear la contratacion_empleo
    
        pool.query('SELECT * FROM oferta_empleo WHERE id_oferta_empleo= ?;',[solicitudEmpleo['id_oferta_empleo_sa']] , (error, resultadoOfertaEmpleo)=>{
            if(error){ 
                MostrarError.MostrarError(error, 'ConversacionDAO | Metodo: crearConversacion | Paso: obtener datos')
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
                        MostrarError.MostrarError(error, 'ConversacionDAO | Metodo: crearConversacion')
                        callback(500, mensajes.errorInterno)
                    }else if(resultadoConversacion.length == 0){  
                        console.log('No se creo la conversación')
                        callback(404, mensajes.peticionNoEncontrada)
            
                    }else{
                        const conversacionCreada = resultadoConversacion
                        console.log(resultadoConversacion)
                        callback(201, conversacionCreada['insertId'])
    
                    }
    
                });    
            }
    
        });     
    
    }

    static agregarParticipantes(idConversacion,idUsuario, callback){
        //Creamos la conversacion
        mysqlConnection.query('INSERT INTO participacion_conversacion(id_conversacion_participacion, id_perfil_usuario_participacion) VALUES(? ,?);',[idConversacion, idUsuario] , (error, resultadoConversacion)=>{
            if(error){ 
                MostrarError.MostrarError(error, 'ConversacionDAO | Metodo: agregarParticipante')
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
    
}