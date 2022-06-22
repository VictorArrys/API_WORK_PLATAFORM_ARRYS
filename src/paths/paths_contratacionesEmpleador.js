const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

//Respuestas
const mensajes = require('../../utils/mensajes')

//Función para verificar el token
function verifyToken(token, tipoUsuario){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
        console.log(tokenData);
  
        if (tokenData["tipo"] == tipoUsuario) {
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

function existeContratacion(idOfertaEmpleo, res, callback){
    var pool = mysqlConnection

    pool.query('SELECT * FROM contratacion_empleo WHERE id_oferta_empleo_coe = ?;',[idOfertaEmpleo] , (error, existeContratacion)=>{
        if(error){
            console.log(error)
            res.status(500) 
            res.json(mensajes.errorInterno);

        }else if(existeContratacion.length == 0){
                     
            console.log('No existe la contratación')
            res.status(404)
            res.json(mensajes.peticionNoEncontrada);

        }else{ //En caso de existir la contratación solo agregamos el aspirante a ella
            callback(existeContratacion[0]['id_contratacion_empleo'])
            
        }

    });  

}

function nombreAspirante(idAspirante, res, callback){
    var pool = mysqlConnection

    pool.query('SELECT nombre FROM perfil_aspirante WHERE id_perfil_aspirante = ?;',[idAspirante] , (error, resultadoNombreAspirante)=>{
        if(error){
            res.status(500) 
            res.json(mensajes.errorInterno);

        }else if(resultadoNombreAspirante.length == 0){
                     
            console.log('No existe la contratación')
            res.status(404)
            res.json(mensajes.peticionNoEncontrada);

        }else{ //En caso de existir la contratación solo agregamos el aspirante a ella
            console.log(resultadoNombreAspirante[0]['nombre'])
            callback(resultadoNombreAspirante[0]['nombre'])
            
        }

    });  

}

path.get('/v1/contratacionesEmpleo/:idOfertaEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token, 'Empleador')

    if(respuesta == 200){

        //Obtenemos la contratación
        var pool = mysqlConnection

        pool.query('SELECT * FROM contratacion_empleo WHERE id_oferta_empleo_coe = ?;',[req.params.idOfertaEmpleo] , (error, existeContratacion)=>{
            if(error){
                console.log(error);
                res.status(500) 
                res.json(mensajes.errorInterno);

            }else if(existeContratacion.length == 0){
                        
                console.log('No existe la contratación')
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);

            }else{ //Obtener la lista de las contrataciones de aspirantes

                var idContratacion = existeContratacion[0]['id_contratacion_empleo']
                
                pool.query('SELECT contratacion_empleo_aspirante.id_perfil_aspirante_cea, perfil_aspirante.nombre as nombre_aspirante, perfil_aspirante.telefono, perfil_aspirante.direccion, perfil_aspirante.id_perfil_usuario_aspirante as idUser,contratacion_empleo_aspirante.valoracion_aspirante FROM contratacion_empleo_aspirante INNER JOIN perfil_aspirante ON perfil_aspirante.id_perfil_aspirante = contratacion_empleo_aspirante.id_perfil_aspirante_cea WHERE id_contratacion_empleo_cea = ?;',[idContratacion] , (error, resultadoContratacionesAspirante)=>{
                    if(error){ 
                        console.log(error)
                        res.status(500)
                        res.json(mensajes.errorInterno);
                       
                    }else if(resultadoContratacionesAspirante.length == 0){
            
                        console.log('No se pudo obtener la contratación aspirante')
                        res.status(404)
                        res.json(mensajes.peticionNoEncontrada);     
            
                    }else{
                        const contratacionesEmpleoAspirante = resultadoContratacionesAspirante
                        console.log('Se ha consultado correctamente las contrataciones: ' + `${contratacionesEmpleoAspirante}`)
                        res.status(200)
                        res.json(contratacionesEmpleoAspirante)
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

path.patch('/v1/contratacionesEmpleo/:idOfertaEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token, 'Empleador')

    if(respuesta == 200){
       
        //Obtenemos la contratación
        existeContratacion(req.params.idOfertaEmpleo, res, function(contratacionEmpleo){
                //Agregar valoración del aspirante en caso de existir la contratación
                //Obtener datos del body
                var idAspirante = req.query.idAspirante
                var valoracionAspirante = req.body.valoracionAspirante
                mysqlConnection.query('UPDATE contratacion_empleo_aspirante SET valoracion_aspirante = ? WHERE id_perfil_aspirante_cea = ? AND id_contratacion_empleo_cea = ?;',[req.body.valoracionAspirante, idAspirante, contratacionEmpleo] , (error, resultadoEvaluacionAspirante)=>{
                    if(!error){ 
                        nombreAspirante(idAspirante, res, function(nombreAspirante){          
                            const valoracionAspiranteR = {}
    
                            valoracionAspiranteR['application/json'] = {
                                'idAspirante': idAspirante,
                                'valoracionAspirante': valoracionAspirante,
                                'nombreAspirante': nombreAspirante
                            }
                            res.status(200)
                            res.send(valoracionAspiranteR['application/json'])  

                        })    
                        
                    }
                    else{

                        console.log(error)
                        res.status(500)
                        res.json(mensajes.errorInterno);                                     
            
                    }
                });

        })

        
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

module.exports = path;
