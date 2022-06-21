const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
//dataType
const { OfertaEmpleoDT } = require('../datatype/OfertaEmpleoDT');

exports.OfertaEmpleoDAO = class OfertaEmpleoDAO {
    //Empleador
    static getOfertasEmpleo(idEmpleador,idUserToken, callback) {
        var pool = mysqlConnection;

        pool.query('SELECT oferta_empleo.*, categoria_empleo.nombre as categoria FROM oferta_empleo INNER JOIN categoria_empleo ON oferta_empleo.id_categoria_oe = categoria_empleo.id_categoria_empleo  WHERE id_perfil_oe_empleador= ?;', [idEmpleador], (error, resultadoOfertasEmpleo)=>{
            if(error){ 

                callback(500, mensajes.errorInterno)
                
            }else if(resultadoOfertasEmpleo.length == 0){

                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                var ofertaEmpleo = resultadoOfertasEmpleo[0];
                var ofertasEmpleo = resultadoOfertasEmpleo;
                
                var idUserMatch = ofertaEmpleo["id_perfil_oe_empleador"]
 
                //Verificación de autorización de token respecto al recurso solicitado
                pool.query('SELECT id_perfil_usuario_empleador FROM perfil_empleador WHERE id_perfil_empleador = ?;', [idUserMatch], (error, result)=>{
                    if(error){ 
                        
                        callback(500, mensajes.errorInterno)
                    }else{
                        if(result.length > 0){
                            const usuario = result[0]
                            const idUsuario = usuario['id_perfil_usuario_empleador']
                            
                            //Id usuario es el mismo que el del token
                            if(idUserToken == idUsuario){

                                callback(200,ofertasEmpleo)
            
                            }else{
                                //Es un token valido pero no le pertenece estos recursos
                                callback(401, mensajes.tokenInvalido)
                            }
                           
                        }
                    }
                    
                });                
    
            }
        });


    }

    static getOfertaEmpleo(idOfertaEmpleo, idUserToken, callback) {

            var pool = mysqlConnection;

            pool.query('SELECT * FROM oferta_empleo WHERE id_oferta_empleo= ?;', [idOfertaEmpleo], (error, resultadoOfertaEmpleo)=>{
                
                if(error){ 
                    MostrarError.MostrarError(error, 'GET: ofertasEmpleo-E/:idOfertaEmpleo Paso: 1era query mysql')
                    
                    callback(500,mensajes.errorInterno)
                    
                }else if(resultadoOfertaEmpleo.length == 0){

                    callback(404, mensajes.peticionNoEncontrada)
        
                }else{
                    console.log(resultadoOfertaEmpleo[0])
                    var ofertaEmpleo = resultadoOfertaEmpleo[0];                   
                    var idUserMatch = ofertaEmpleo["id_perfil_oe_empleador"]

                    //Verificación de autorización de token respecto al recurso solicitado
                    pool.query('SELECT id_perfil_usuario_empleador FROM perfil_empleador WHERE id_perfil_empleador = ?;', [idUserMatch], (error, result)=>{
                        if(error){ 

                            MostrarError.MostrarError(error, 'GET: ofertasEmpleo-E/:idOfertaEmpleo Paso: 2da query mysql')
                            callback(500, mensajes.errorInterno)

                        }else{
                            if(result.length > 0){
                                const usuario = result[0]
                                const idUsuario = usuario['id_perfil_usuario_empleador']
                                
                                //Id usuario es el mismo que el del token
                                if(idUserToken == idUsuario){
                                    var ofertaEmpleoGet = new OfertaEmpleoDT();
                                    ofertaEmpleoGet.cantidadPago = ofertaEmpleo['cantidad_pago'];
                                    ofertaEmpleoGet.descripcion = ofertaEmpleo['descripcion'];
                                    ofertaEmpleoGet.diasLaborales = ofertaEmpleo['dias_laborales'];
                                    ofertaEmpleoGet.direccion = ofertaEmpleo['direccion'];
                                    ofertaEmpleoGet.fechaDeFinalizacion = ofertaEmpleo['fecha_finalizacion'];
                                    ofertaEmpleoGet.fechaDeIinicio = ofertaEmpleo['fecha_inicio'];
                                    ofertaEmpleoGet.horaFin = ofertaEmpleo['hora_fin'];
                                    ofertaEmpleoGet.horaInicio = ofertaEmpleo['hora_inicio'];
                                    ofertaEmpleoGet.idCategoriaEmpleo = ofertaEmpleo['id_categoria_oe'];                        
                                    ofertaEmpleoGet.nombre = ofertaEmpleo['nombre'];
                                    ofertaEmpleoGet.tipoPago = ofertaEmpleo['tipo_pago'];
                                    ofertaEmpleoGet.vacantes = ofertaEmpleo['vacantes'];
                                    ofertaEmpleoGet.idOfertaEmpleo = ofertaEmpleo['id_oferta_empleo'];
                                    ofertaEmpleoGet.idPerfilEmpleador = ofertaEmpleo['id_perfil_oe_empleador'];

                                    callback(200,ofertaEmpleoGet)
                                    
                                }else{
                                    //Es un token valido pero no le pertenece ese recurso
                                    callback(401, mensajes.tokenInvalido)
                                }
                            
                            }else{
                                callback(404, mensajes.peticionNoEncontrada)
                            }
                        }
                        
                    });
                }
    
        });
        
    }

    static getFotografiasOfertaEmpleo(idOfertaEmpleo, callback) {
        var pool = mysqlConnection;

        pool.query('SELECT * FROM fotografia WHERE id_oferta_empleo_fotografia = ?;', [idOfertaEmpleo], (error, resultadoFotografias)=>{
            
            if(error){ 
                MostrarError.MostrarError(error, 'GET: /v1/ofertasEmpleo-E:idOfertaEmpleo/fotografias Paso: 1era query mysql')
                
                callback(500,mensajes.errorInterno)
                
            }else if(resultadoFotografias.length == 0){
                
                callback(200,[])
            }else{
                var arrayFotografia1 = null
                arrayFotografia1 = Uint8ClampedArray.from(Buffer.from(resultadoFotografias[0]['imagen'].buffer, 'base64'))
                
                var arrayFotografia2 = null
                arrayFotografia2 = Uint8ClampedArray.from(Buffer.from(resultadoFotografias[1]['imagen'].buffer, 'base64'))
                
                var arrayFotografia3 = null
                arrayFotografia3 = Uint8ClampedArray.from(Buffer.from(resultadoFotografias[2]['imagen'].buffer, 'base64'))

                var foto1 = {}
                foto1={
                    'idFoto': resultadoFotografias[0]['id_fotografia'],
                    'imagen': arrayFotografia1
                }
                var foto2 = {}
                foto2 = {
                    'idFoto': resultadoFotografias[1]['id_fotografia'],
                    'imagen': arrayFotografia2
                }
                var foto3 = {}
                foto3 = {
                    'idFoto': resultadoFotografias[2]['id_fotografia'],
                    'imagen': arrayFotografia3
                }

                var fotografiasJson = []

                fotografiasJson= [
                    foto1,
                    foto2,
                    foto3
                ]
                callback(200,fotografiasJson)
            }

    
        });


    }

    static postFotografiaOfertaEmpleo(idOfertaEmpleo, fotografia, callback) {

    }

    static putFotografiaOfertaEmpleo(idOfertaEmpleo, fotografia, callback) {
        //mysql.query
            //if error
                //callback(mense)
    }

    static postOfertaEmpleo(idEmpleador, ofertaEmpleo, callback) {

    }

    static putOfertaEmpleo(ofertaEmpleo, idUsuario, callback) {

    }

    //Aspirante
    static getOfertasEmpleoAspirante(arregloIdCategoria, callback) {

    }

    static getOfertaEmpleoAspirante(idOfertaEmpleo, callback) {

    }
}