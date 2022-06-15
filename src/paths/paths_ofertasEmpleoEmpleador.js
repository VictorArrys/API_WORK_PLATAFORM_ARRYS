const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const multer = require('multer');

//Validaciones
const { validarOfertaEmpleo } = require('../../utils/validaciones/validarBody')
const { validarQuery } = require('../../utils/validaciones/validarQuery')
const { validarParamId } = require('../../utils/validaciones/validarParam')

//Respuestas
const mensajes = require('../../utils/mensajes')

//Función para verificar el token
function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
  
        if (tokenData["tipo"] == "Empleador") {
            statusCode = 200
            return statusCode
        }else{
            //Caso que un token exista pero no contenga los permisos para la petición
            statusCode = 401
            return statusCode
          }
    
        } catch (error) { //Caso ..de un token invalido, es decir que no exista
            statusCode = 401
            return statusCode
            
        }
}

function esctructurarJSON(ofertaEmpleo,categoriaEmpleo , contratacionOfertaEmpleo){
    
    const ofertaEmpleoJson = {}

    ofertaEmpleoJson['application/json'] = {
        'cantidadPago': ofertaEmpleo['cantidad_pago'],
        'descripcion': ofertaEmpleo['descripcion'],
        'diasLaborales': ofertaEmpleo['dias_laborales'],
        'direccion': ofertaEmpleo['direccion'],
        'fechaDeFinalizacion': ofertaEmpleo['fecha_finalizacion'],
        'fechaDeIinicio': ofertaEmpleo['fecha_inicio'],
        'horaFin': ofertaEmpleo['hora_fin'],
        'horaInicio': ofertaEmpleo['hora_inicio'],
        'idCategoriaEmpleo': ofertaEmpleo['id_categoria_oe'],
        'categoriaEmpleo': categoriaEmpleo,
        'nombre': ofertaEmpleo['nombre'],
        'tipoPago': ofertaEmpleo['tipo_pago'],
        'vacantes': ofertaEmpleo['vacantes'],
        'idOfertaEmpleo': ofertaEmpleo['id_oferta_empleo'],
        'idPerfilEmpleador': ofertaEmpleo['id_perfil_oe_empleador'],
        'contratacion': contratacionOfertaEmpleo
    }

    return ofertaEmpleoJson

}



path.get('/v1/ofertasEmpleo-E', validarQuery, (req, res) => {

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)

    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT oferta_empleo.*, categoria_empleo.nombre as categoria FROM oferta_empleo INNER JOIN categoria_empleo ON oferta_empleo.id_categoria_oe = categoria_empleo.id_categoria_empleo  WHERE id_perfil_oe_empleador= ?;', [req.query.idPerfilEmpleador], (error, resultadoOfertasEmpleo)=>{
            if(error){ 
                res.status(500)
                res.json(mensajes.errorInterno);
                
            }else if(resultadoOfertasEmpleo.length == 0){
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                var ofertaEmpleo = resultadoOfertasEmpleo[0];
                var ofertasEmpleo = resultadoOfertasEmpleo;
                const tokenData = jwt.verify(token, keys.key); 
                

                // IdUsuario del token
                var idUserToken = tokenData['idUsuario']
                var idUserMatch = ofertaEmpleo["id_perfil_oe_empleador"]
 
                //Verificación de autorización de token respecto al recurso solicitado
                pool.query('SELECT id_perfil_usuario_empleador FROM perfil_empleador WHERE id_perfil_empleador = ?;', [idUserMatch], (error, result)=>{
                    if(error){ 
                        res.status(500)
                    res.json(mensajes.errorInterno);
                    }else{
                        if(result.length > 0){
                            const usuario = result[0]
                            const idUsuario = usuario['id_perfil_usuario_empleador']
                            
                            //Id usuario es el mismo que el del token
                            if(idUserToken == idUsuario){
                                
                                res.status(200);                  
                                res.json(ofertasEmpleo);
            
                            }else{
                                //Es un token valido pero no le pertenece estos recursos
                                res.status(401)
                                res.json(mensajes.tokenInvalido);
                            }
                           
                        }
                    }
                    
                });                
    
            }
        });
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

function consoleError(error, ubicacion){
    console.log('--------------------------------------------------------------------------------------')
    console.log('Se ha presentado un problema en: ' + ubicacion)
    console.log('Error(es): ' + error.message)
    console.log('--------------------------------------------------------------------------------------')
}

function contratacionesEmpleo(idOfertaEmpleo, res, callback){
    //Obtenemos la contratación
    var pool = mysqlConnection
    pool.query('SELECT * FROM contratacion_empleo WHERE id_oferta_empleo_coe = ?;',[idOfertaEmpleo] , (error, existeContratacion)=>{
        if(error){

            consoleError(error, 'Funcion: contratacionesEmpleo Paso: Consultar contratacion')

            res.status(500) 
            res.json(mensajes.errorInterno);

        }else if(existeContratacion.length == 0){
                    
            console.log('No existe la contratación')
             //Estructura JSON contración

             callback('empty') 

        }else{ //Obtener la lista de las contrataciones de aspirantes

            var idContratacion = existeContratacion['id_contratacion_empleo']
            
            pool.query('contratacion_empleo_aspirante.id_aspirante_cea,perfil_aspirante.nombre as nombre_aspirante,contratacion_empleo_aspirante.valoracion_aspirante FROM contratacion_empleo_aspirante INNER JOIN perfil_aspirante ON perfil_aspirante.id_perfil_aspirante = contratacion_empleo_aspirante.id_aspirante_cea WHERE id_contratacion_empleo_cea = ?',[idContratacion] , (error, resultadoContratacionesAspirante)=>{
                if(error){ 
                    consoleError(error, 'Funcion: contratacionesEmpleo Paso: Consultar contratacionesAspirantes')
                    
                    res.status(500)
                    res.json(mensajes.errorInterno);
            
                }else if(resultadoContratacionesAspirante.length == 0){
        
                    console.log('No se pudo obtener la contratación aspirante') 
                    //Estructura JSON contración
                    const contratacion = {}

                    contratacion['application/json'] = {
                        'estatus': existeContratacion['estatus'],
                        'fechaContratacion': existeContratacion['fecha_contratacion'],
                        'idContratacionEmpleo': existeContratacion['dias_laborales'],                        
                        'idOfertaEmpleo': existeContratacion['id_oferta_empleo_coe'],                                              
                        'fechaFinalizacion': existeContratacion['dias_laborales'],
                        'contratados': null
                    }
                    callback(contratacion)

                }else{
                    const contratacionesEmpleoAspirante = resultadoContratacionesAspirante
                    console.log('Se ha consultado correctamente las contrataciones: ' + `${contratacionesEmpleoAspirante}`)

                    //Estructura JSON contración
                    const contratacion = {}

                    contratacion['application/json'] = {
                        'estatus': existeContratacion['estatus'],
                        'fechaContratacion': existeContratacion['fecha_contratacion'],
                        'idContratacionEmpleo': existeContratacion['dias_laborales'],                        
                        'idOfertaEmpleo': existeContratacion['id_oferta_empleo_coe'],                                              
                        'fechaFinalizacion': existeContratacion['dias_laborales'],
                        'contratados': contratacionesEmpleoAspirante
                    }
                    
                    callback(contratacion)
                }
        
            });


        }

    });  
}

function categoriaOferta(idCategoriaEmpleo, res, callback){
    try {
        var query = 'SELECT id_categoria_empleo, nombre as categoria FROM categoria_empleo WHERE id_categoria_empleo = ?'
        var pool = mysqlConnection

        pool.query(query,[idCategoriaEmpleo], (error, resultadoCategoria) => {
            if(error){
                res.status(500)
                res.json(mensajes.errorInterno)
            }else if (resultadoCategoria.length == 0){
                res.status(404)
                res.json(mensajes.peticionNoEncontrada)
            }else{
                console.log(resultadoCategoria[0]['categoria'])
            
                callback(resultadoCategoria[0]['categoria'])
            }
        })
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
}

path.get('/v1/ofertasEmpleo-E:idOfertaEmpleo/fotografias', validarParamId, (req, res) =>{

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
  
    if(respuesta == 200){
    var pool = mysqlConnection;

        pool.query('SELECT * FROM fotografia WHERE id_oferta_empleo_fotografia = ?;', [req.params.idOfertaEmpleo], (error, resultadoFotografias)=>{
            
            if(error){ 
                consoleError(error, 'GET: /v1/ofertasEmpleo-E:idOfertaEmpleo/fotografias Paso: 1era query mysql')

                res.status(500)
                res.json(mensajes.errorInterno);
                
            }else if(resultadoFotografias.length == 0){
                
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                
                var fotografias = resultadoFotografias[0];
                var arrayFotografia = Uint8ClampedArray.from(Buffer.from(usuario.fotografia.buffer, 'base64'))

                const fotografiasJson = {}

                fotografiasJson['application/json'] = {
                    'fotografia1': ofertaEmpleo['cantidad_pago'],
                    'imagen': ofertaEmpleo['descripcion'],
                    'imagen': ofertaEmpleo['dias_laborales']
                }

                res.status(200);
                res.send(fotografiasJson['application/json'])

            }

    
        });
    
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
    }

})

path.get('/v1/ofertasEmpleo-E/:idOfertaEmpleo', validarParamId, (req, res) => {

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
 
    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT * FROM oferta_empleo WHERE id_oferta_empleo= ?;', [req.params.idOfertaEmpleo], (error, resultadoOfertaEmpleo)=>{
            
            if(error){ 
                consoleError(error, 'GET: ofertasEmpleo-E/:idOfertaEmpleo Paso: 1era query mysql')

                res.status(500)
                res.json(mensajes.errorInterno);
                
            }else if(resultadoOfertaEmpleo.length == 0){
                
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                
                var ofertaEmpleo = resultadoOfertaEmpleo[0];
                const tokenData = jwt.verify(token, keys.key); 
                
                // IdUsuario del token
                var idUserToken = tokenData['idUsuario']
                var idUserMatch = ofertaEmpleo["id_perfil_oe_empleador"]

                //Verificación de autorización de token respecto al recurso solicitado
                pool.query('SELECT id_perfil_usuario_empleador FROM perfil_empleador WHERE id_perfil_empleador = ?;', [idUserMatch], (error, result)=>{
                    if(error){ 
                        consoleError(error, 'GET: ofertasEmpleo-E/:idOfertaEmpleo Paso: 2da query mysql')
                        
                        res.status(500)
                        res.json(mensajes.errorInterno);
                    }else{
                        if(result.length > 0){
                            const usuario = result[0]
                            const idUsuario = usuario['id_perfil_usuario_empleador']
                            
                            //Id usuario es el mismo que el del token
                            if(idUserToken == idUsuario){
                                contratacionesEmpleo(ofertaEmpleo['id_oferta_empleo'], res, function(contratacionesOfertaEmpleo){
                                    
                                    categoriaOferta(ofertaEmpleo['id_categoria_oe'], res, function(categoriaEmpleo){
                                        const ofertaEmpleoJson = esctructurarJSON(ofertaEmpleo, categoriaEmpleo, contratacionesOfertaEmpleo)

                                        res.status(200);
                                        res.send(ofertaEmpleoJson['application/json']);

                                    })
                                   
                                })

            
                            }else{
                                //Es un token valido pero no le pertenece ese recurso
                                res.status(401)
                                res.json(mensajes.tokenInvalido);
                            }
                           
                        }else{
                            res.status(404)
                            res.json(mensajes.peticionNoEncontrada);
                        }
                    }
                    
                });
            }

    
        });

    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
       
    }


});


const multerUpload = multer({storage:multer.memoryStorage(), limits:{fileSize:undefined}})


path.post('/v1/ofertasEmpleo-E/:idOfertaEmpleo/fotografia', multerUpload.single("fotografia"), (req,res) => {

    var query = "INSERT INTO fotografia(id_oferta_empleo_fotografia, imagen) VALUES(?, ?);"
    const idOfertaEmpleo = req.params.idCategoriaEmpleo

    mysqlConnection.query(query, [idOfertaEmpleo, req.file.buffer], (error, resultadoFotografia) => {
        if (error){
            console.log('Error debido a: ')
            console.log(error.message)
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if(resultadoFotografia.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            consoleError.log('Registro de foto de la oferta exitoso')
            res.status(200)
            res.json(mensajes.actualizacionExitosa)
        }
    })
});     


path.post('/v1/ofertasEmpleo-E', validarOfertaEmpleo, (req, res) => {

    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)

    console.log(respuesta)
        if(respuesta == 200){

            console.log(req.body)

            var query = `INSERT INTO oferta_empleo(id_perfil_oe_empleador, id_categoria_oe, nombre, descripcion, vacantes, dias_laborales, tipo_pago, cantidad_pago, direccion, hora_inicio, hora_fin, fecha_inicio, fecha_finalizacion)  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
            mysqlConnection.query(query, [req.body.idPerfilEmpleador, req.body.idCategoriaEmpleo, req.body.nombre, req.body.descripcion, 
                    req.body.vacantes, req.body.diasLaborales, req.body.tipoPago, req.body.cantidadPago, req.body.direccion,
                    req.body.horaInicio, req.body.horaFin, req.body.fechaDeIinicio, req.body.fechaDeFinalizacion], (err, rows, fields) => {
                if (!err) {
                    const resultCreated = {};
                    resultCreated['application/json']={
                    'idOfertaEmpleo': rows['insertId']
                    }

                    res.status(201);
                    console.log(mensajes.registroExitoso)
                    res.send(resultCreated['application/json']);
                } else {
                    consoleError(error, 'POST: ofertasEmpleo-E Paso: 1era query mysql')                   

                    res.status(500)
                    res.json(mensajes.errorInterno);

                }
            }) 
           

        }else if(respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido);

        }else{
            res.json(mensajes.errorInterno);
            res.status(500)
        }

});


path.put('/v1/ofertasEmpleo-E/:idOfertaEmpleo', (req, res) => {
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)

    console.log(respuesta)
    if(respuesta == 200){

        console.log(req.body)

        var updateQuery = `UPDATE oferta_empleo SET id_categoria_oe = ?, nombre = ?, descripcion = ?, vacantes = ?, dias_laborales = ?, tipo_pago = ?, cantidad_pago = ?, direccion = ?, hora_inicio = ?, hora_fin = ?, fecha_inicio = ?, fecha_finalizacion = ? WHERE id_oferta_empleo = ?`; 

        const tokenData = jwt.verify(token, keys.key); 
        
        // IdUsuario del token
        var idUserToken = tokenData['idUsuario']
        var idUserMatch = req.body.idPerfilEmpleador
        console.log(idUserMatch)

        //Verificación de autorización de token respecto al recurso solicitado
        mysqlConnection.query('SELECT id_perfil_usuario_empleador FROM perfil_empleador WHERE id_perfil_empleador = ?;', [idUserMatch], (error, result)=>{
            if(error){ 
                consoleError(error, 'PUT: ofertasEmpleo-E/:idOfertaEmpleo Paso: select query mysql')

                res.status(500)
                res.json(mensajes.errorInterno);
            }else{
                if(result.length > 0){
                    const usuario = result[0]
                    const idUsuario = usuario['id_perfil_usuario_empleador']
                    
                    //Id usuario es el mismo que el del token
                    console.log(idUserToken + ' = ' + idUsuario)
                    if(idUserToken == idUsuario){
                        
                        mysqlConnection.query(updateQuery, [req.body.idCategoriaEmpleo, req.body.nombre, req.body.descripcion, 
                            req.body.vacantes, req.body.diasLaborales, req.body.tipoPago, req.body.cantidadPago, req.body.direccion,
                            req.body.horaInicio, req.body.horaFin, req.body.fechaDeIinicio, req.body.fechaDeFinalizacion, req.params.idOfertaEmpleo], (err, rows, fields) => {
                            if (!err) {
                                res.sendStatus(204);
                            } else {
                                consoleError(error, 'PUT: ofertasEmpleo-E/:idOfertaEmpleo Paso: update query mysql')
                                res.status(500)
                                res.json(mensajes.errorInterno)
                            
                            }
                        }); 
    
                    }else{
                        //Es un token valido pero no le pertenece ese recurso
                        res.status(401)
                        res.json(mensajes.tokenInvalido);
                    }
                   
                }else{
                    
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada);
                }
            }
            
        });
        

    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
    
    }

});

module.exports = path;