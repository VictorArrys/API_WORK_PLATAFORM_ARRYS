const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
const { AspiranteDAO } = require('./AspiranteDAO');
const { Contratacion } = require('../modelo/Contratacion')

exports.ContratacionDAO = class ContratacionDAO {
    //Empleador
    static existeContratacion(idOfertaEmpleo, callback){
        var pool = mysqlConnection
    
        pool.query('SELECT * FROM contratacion_empleo WHERE id_oferta_empleo_coe = ?;',[idOfertaEmpleo] , (error, existeContratacion)=>{
            if(error){
                console.log(error)
                callback(500, mensajes.errorInterno)
    
            }else if(existeContratacion.length == 0){
                         
                console.log('No existe la contratación')
                callback(404, mensajes.peticionNoEncontrada)
    
            }else{ //En caso de existir la contratación solo agregamos el aspirante a ella
                callback(200, existeContratacion[0]['id_contratacion_empleo'])
                
            }
    
        });  
    
    }


    static getContratacionEmpleo(idOfertaEmpleo, callback) {
         //Obtenemos la contratación
         var pool = mysqlConnection

         pool.query('SELECT * FROM contratacion_empleo WHERE id_oferta_empleo_coe = ?;',[idOfertaEmpleo] , (error, existeContratacion)=>{
            if(error){
                console.log(error);
                callback(500, mensajes.errorInterno)
 
            }else if(existeContratacion.length == 0){
                         
                console.log('No existe la contratación')
                callback(404, mensajes.peticionNoEncontrada)
 
            }else{ //Obtener la lista de las contrataciones de aspirantes
                
                console.log('Muestra')
                console.log(existeContratacion[0])
                var idContratacion = existeContratacion[0]['id_contratacion_empleo']
                const contratacionEmpleoDatos = existeContratacion[0]

                pool.query('SELECT contratacion_empleo_aspirante.id_perfil_aspirante_cea, perfil_aspirante.nombre as nombre_aspirante, perfil_aspirante.telefono, perfil_aspirante.direccion, perfil_aspirante.id_perfil_usuario_aspirante as idUser,contratacion_empleo_aspirante.valoracion_aspirante FROM contratacion_empleo_aspirante INNER JOIN perfil_aspirante ON perfil_aspirante.id_perfil_aspirante = contratacion_empleo_aspirante.id_perfil_aspirante_cea WHERE id_contratacion_empleo_cea = ?',[idContratacion] , (error, resultadoContratacionesAspirante)=>{
                    if(error){ 
                        MostrarError.MostrarError(error, 'Funcion: contratacionesEmpleo Paso: Consultar contratacionesAspirantes')
                        
                        callback(500, mensajes.errorInterno)
                
                    }else if(resultadoContratacionesAspirante.length == 0){
            
                        console.log('No se pudo obtener la contratación aspirante') 
                        //Estructura JSON contración
                        const contratacionGet = new Contratacion();

                        contratacionGet.estatus = contratacionEmpleoDatos['estatus']
                        contratacionGet.fechaContratacion = contratacionEmpleoDatos['fecha_contratacion']
                        contratacionGet.idContratacionEmpleo = contratacionEmpleoDatos['id_contratacion_empleo']
                        contratacionGet.idOfertaEmpleo = contratacionEmpleoDatos['id_oferta_empleo_coe']
                        contratacionGet.fechaFinalizacion = contratacionEmpleoDatos['fecha_finalizacion']
                        contratacionGet.contratados = null

                        callback(200, contratacionGet)

                    }else{
                        const contratacionesEmpleoAspirante = resultadoContratacionesAspirante
                        //Estructurar contración con contratados
                        const contratacionGet = new Contratacion();

                        contratacionGet.estatus = contratacionEmpleoDatos['estatus']
                        contratacionGet.fechaContratacion = contratacionEmpleoDatos['fecha_contratacion']
                        contratacionGet.idContratacionEmpleo = contratacionEmpleoDatos['id_contratacion_empleo']
                        contratacionGet.idOfertaEmpleo = contratacionEmpleoDatos['id_oferta_empleo_coe']
                        contratacionGet.fechaFinalizacion = contratacionEmpleoDatos['fecha_finalizacion']
                        contratacionGet.contratados = contratacionesEmpleoAspirante             
                        
                        callback(200, contratacionGet)
                    }
            
                });


             }
 
         });  
    }

    static patchEvaluarAspiranteContratado(idOfertaEmpleo, idAspirante, valoracionAspirante, callback) {
        //Obtenemos la contratación
        ContratacionDAO.existeContratacion(idOfertaEmpleo, (codigoRespuesta,contratacionEmpleo)=>{
           if(codigoRespuesta== 200){ 
                mysqlConnection.query('UPDATE contratacion_empleo_aspirante SET valoracion_aspirante = ? WHERE id_perfil_aspirante_cea = ? AND id_contratacion_empleo_cea = ?;',[valoracionAspirante, idAspirante, contratacionEmpleo] , (error, resultadoEvaluacionAspirante)=>{
                    if(!error){ 
                        AspiranteDAO.nombreAspirante(idAspirante, (codigoRespuesta,nombreAspirante)=>{          
                            if(codigoRespuesta == 200){
                                const valoracionAspiranteR = {}

                                valoracionAspiranteR['application/json'] = {
                                    'idAspirante': idAspirante,
                                    'valoracionAspirante': valoracionAspirante,
                                    'nombreAspirante': nombreAspirante
                                }
                                callback(200, valoracionAspiranteR['application/json'])  
    
                            }else{
                                callback(codigoRespuesta, nombreAspirante)
                            }
                        })    
                        
                    }
                    else{

                        console.log(error)
                        callback(500, mensajes.errorInterno)                                  
            
                    }
                });
           }else{
            callback(codigoRespuesta, contratacionEmpleo)
           } 

    })

    }

    //Aspirante
    static getContratacionesDeAspirante(idAspirante, callback) {

    }

    static getContratacionDeAspirante(idAspirante, IdContratacionEmpleo, callback) {

    }

    static evaluarEmpleador(idAspirante, IdContratacionEmpleo, puntuacion, callback) {

    }
}

