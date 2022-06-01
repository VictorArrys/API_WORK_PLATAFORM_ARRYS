const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { NULL } = require('mysql/lib/protocol/constants/types');
const res = require('express/lib/response');

//Respuestas
const mensajes = require('../../utils/mensajes')

//Función para verificar el token
function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
        console.log(tokenData);
  
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

path.get('/v1/ofertasEmpleo-E', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)

    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT * FROM oferta_empleo WHERE id_perfil_oe_empleador= ?;', [req.query.idPerfilEmpleador], (error, resultadoOfertasEmpleo)=>{
            if(error){ 
                res.json(mensajes.errorInterno);
                res.status(500)
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

path.get('/v1/ofertasEmpleo-E/:idOfertaEmpleo', (req, res) => {
    
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
 
    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT * FROM oferta_empleo WHERE id_oferta_empleo= ?;', [req.params.idOfertaEmpleo], (error, resultadoOfertaEmpleo)=>{
            
            if(error){ 
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
                        res.status(500)
                    res.json(mensajes.errorInterno);
                    }else{
                        if(result.length > 0){
                            const usuario = result[0]
                            const idUsuario = usuario['id_perfil_usuario_empleador']
                            
                            //Id usuario es el mismo que el del token
                            if(idUserToken == idUsuario){
                                
                                res.status(200);
                                res.json(ofertaEmpleo);
            
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

path.post('/v1/ofertasEmpleo-E', (req, res) => {
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
            res.status(201);
            res.json(mensajes.registroExitoso);
            } else {
            console.log(err)
            res.json(mensajes.errorInterno);
                res.status(500)
            
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
                                console.log(err)
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