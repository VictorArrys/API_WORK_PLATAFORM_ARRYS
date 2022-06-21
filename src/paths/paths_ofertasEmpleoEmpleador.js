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
const mensajes = require('../../utils/mensajes');
const { vary } = require('express/lib/response');
const { json } = require('body-parser');
const { GestionOfertasEmpleo } = require('../componentes/GestionOfertasEmpleo');
const GestionToken = require('../utils/GestionToken');


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

    console.log(ofertaEmpleoJson)

    return ofertaEmpleoJson

}



path.get('/v1/ofertasEmpleo-E', validarQuery, (req, res) => {

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200){
        var idUsuario = respuesta['tokenData']['idUsuario']

        GestionOfertasEmpleo.getOfertasEmpleo(req.query.idPerfilEmpleador, idUsuario, (codigoRespuesta, cuerpoRespuestaOferta)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoRespuestaOferta)

        })
    }else if(resprespuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

function consoleError(error, ubicacion){
    console.log('--------------------------------------------------------------------------------------')
    console.log('Se ha presentado un problema en: ' + ubicacion)
    console.log('Error(es): ' + error)
    console.log('--------------------------------------------------------------------------------------')
}

function getFotos(idOfertaEmpleo, res, callback){

    var pool = mysqlConnection;

        pool.query('SELECT * FROM fotografia WHERE id_oferta_empleo_fotografia = ?;', [idOfertaEmpleo], (error, resultadoFotografias)=>{
            
            if(error){ 
                consoleError(error, 'GET: /v1/ofertasEmpleo-E:idOfertaEmpleo/fotografias Paso: 1era query mysql')
                
                res.status(500)
                res.json(mensajes.errorInterno);
                
            }else if(resultadoFotografias.length == 0){
                
                callback([])
            }else{
                var arrayFotografia1 = null
                arrayFotografia1 = Uint8ClampedArray.from(Buffer.from(resultadoFotografias[0]['imagen'].buffer, 'base64'))
                
                /*resultadoFotografias[0]['imagen'].forEach(element => {
                    arrayFotografia1.push(element)

                });*/
                
                var arrayFotografia2 = null
                arrayFotografia2 = Uint8ClampedArray.from(Buffer.from(resultadoFotografias[1]['imagen'].buffer, 'base64'))
                
                /*resultadoFotografias[1]['imagen'].forEach(element => {
                    arrayFotografia2.push(element)
                    
                });*/
                
                var arrayFotografia3 = null
                arrayFotografia3 = Uint8ClampedArray.from(Buffer.from(resultadoFotografias[2]['imagen'].buffer, 'base64'))
                
               /* resultadoFotografias[2]['imagen'].forEach(element => {
                    arrayFotografia3.push(element)
                    
                });*/

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

                console.log(fotografiasJson)
                callback(fotografiasJson)
            }

    
        });


}

path.get('/v1/ofertasEmpleo-E/:idOfertaEmpleo', validarParamId, (req, res) => {

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200){
        var idOfertaEmpleo = req.params.idOfertaEmpleo
        var idUsuario = respuesta['tokenData']['idUsuario']

        GestionOfertasEmpleo.getOfertaEmpleo(idOfertaEmpleo, idUsuario, function(codigoRespuesta, cuerpoRespuestaOferta){

            res.status(codigoRespuesta)
            res.json(cuerpoRespuestaOferta)

        })

    }else if(respuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
       
    }


});

path.get('/v1/ofertasEmpleo-E/:idOfertaEmpleo/fotografia', (req,res) => {

    var idOfertaEmpleo =req.params.idOfertaEmpleo
    GestionOfertasEmpleo.getFotografiasOfertaEmpleo(idOfertaEmpleo, function(codigoRespuesta, cuerpoFotos){
        res.status(codigoRespuesta)
        res.json(cuerpoFotos)
    })

    /*getFotos(req.params.idOfertaEmpleo, res, function(fotos){

        res.status(200);
        res.json(fotos);
    })       */  

});    


const multerUpload = multer({storage:multer.memoryStorage(), limits:{fileSize:8*1024*1024*10}})

path.post('/v1/ofertasEmpleo-E/:idOfertaEmpleo/fotografia', multerUpload.single("fotografia"), (req,res) => {

    var query = "INSERT INTO fotografia(id_oferta_empleo_fotografia, imagen) VALUES(?, ?);"
    const idOfertaEmpleo = req.params.idOfertaEmpleo

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
            console.log('Registro de foto de la oferta exitoso')
            res.status(201)
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

path.put('/v1/ofertasEmpleo-E/:idOfertaEmpleo/:idFotografia/fotografia', multerUpload.single("fotografia"), (req,res) => {

    var query = "UPDATE fotografia SET imagen = ? WHERE id_oferta_empleo_fotografia = ? AND id_fotografia = ?;"
    const idOfertaEmpleo = req.params.idOfertaEmpleo
    const idFoto = req.params.idFotografia
    mysqlConnection.query(query, [req.file.buffer, idOfertaEmpleo, idFoto], (error, resultadoFotografia) => {
        if (error){
            console.log('Error debido a: ')
            console.log(error.message)            
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if(resultadoFotografia.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            console.log('Actualización de foto de la oferta exitoso')
            res.status(200)
            res.json(mensajes.actualizacionExitosa)
        }
    })
});   


path.put('/v1/ofertasEmpleo-E/:idOfertaEmpleo', (req, res) => {
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)

    console.log(respuesta)
    if(respuesta == 200){

        console.log(req.body)
        console.log(req.params.idOfertaEmpleo)

        var updateQuery = 'UPDATE oferta_empleo SET id_categoria_oe = ?, nombre = ?, descripcion = ?, vacantes = ?, dias_laborales = ?, tipo_pago = ?, cantidad_pago = ?, direccion = ?, hora_inicio = ?, hora_fin = ?, fecha_inicio = ?, fecha_finalizacion = ? WHERE id_oferta_empleo = ?;' 

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
                                console.log(rows)
                                const updated = {}

                                updated['application/json'] = {
                                    'cambios': rows['changedRows']
                                }
                                res.status(200);
                                res.json(updated['application/json'])
                            } else {
                                consoleError(err    , 'PUT: ofertasEmpleo-E/:idOfertaEmpleo Paso: update query mysql')
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