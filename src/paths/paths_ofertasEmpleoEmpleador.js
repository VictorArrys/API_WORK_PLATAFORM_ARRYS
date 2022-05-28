const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

//Respuestas
const errorInterno = {
    "resBody" : {
    "menssage" : "error interno del servidor"
    }
}

const tokenInvalido = {
    "resBody" : {
    "menssage" : "token invalido"
    }
}

const peticionIncorrecta = {
    "resBody" : {
    "menssage" : "peticion no encontrada"
    }
}

const registroExitoso = {
    "resBody" : {
    "menssage" : "Registro exitoso"
    }
}

const actualizacionExitosa = {
    "resBody" : {
    "menssage" : "Actualización exitosa"
    }
}



//Funcion para verificar que el token sea del usuario correcto
function verifyTokenUser(token, user){
    const tokenData = jwt.verify(token, keys.key);
    var pool = mysqlConnection;

        pool.query('SELECT * FROM perfil_empleador WHERE id_perfil_empleador= ? AND id_perfil_usuario_empleador = ?;', [user,tokenData["idUsuario"]], (error, result)=>{
            if(error){ 
                return false
            }else{
                if(result.length != 0){
                    console.log(result)
                    return true
                }else{
                    //Prueba para ver cuando se pone un token de empleador pero que no pertenece esa oferta
                    console.log("El token pertenece a: " + tokenData["idUsuario"] +" y la oferta es del usuario: " + user)
                    return false
                }
            }
            
    });

}

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

    console.log(respuesta)
    if(respuesta == 200){

        var pool = mysqlConnection;

        pool.query('SELECT * FROM oferta_empleo WHERE id_perfil_oe_empleador= ?;', [req.query.idPerfilEmpleador], (error, resultadoCategoria)=>{
            if(error){ 
                res.json(errorInterno);
                res.status(500)
            }else if(resultadoCategoria.length == 0){
    
                res.status(404)
                res.json(peticionIncorrecta);
     
            }else{
                var categoriasEmpleo = resultadoCategoria;
    
                res.json(categoriasEmpleo);
                res.status(200);
    
            }
        });
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(tokenInvalido);

    }else{
        res.json(errorInterno);
        res.status(500)
    }

});

path.get('/v1/ofertasEmpleo-E/:idOfertaEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
 
    console.log(respuesta)
    if(respuesta == 200){
        
        var pool = mysqlConnection;

        pool.query('SELECT * FROM oferta_empleo WHERE id_oferta_empleo= ?;', [req.params.idOfertaEmpleo], (error, resultadoCategoria)=>{
            
            if(error){ 
                res.json(errorInterno);
                res.status(500)
            }else if(resultadoCategoria.length == 0){
    
                res.status(404)
                res.json(peticionIncorrecta);
     
            }else{

                var ofertaEmpleo = resultadoCategoria[0];
            
                if(verifyTokenUser(token, ofertaEmpleo["id_perfil_oe_empleador"])){
                    res.json(ofertaEmpleo);
                    res.status(200);
                }else{
                    console.log("XD FFF")
                    res.status(respuesta)
                    res.json(tokenInvalido);
                }
    
            }
    
        });
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(tokenInvalido);

    }else{
        res.json(errorInterno);
        res.status(500)
    }

});

module.exports = path;