const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { validarParamIdUsuario } = require('../../utils/validaciones/validarParam')
const { send, status, json } = require('express/lib/response');

//Respuestas
const mensajes = require('../../utils/mensajes');
const req = require('express/lib/request');
const res = require('express/lib/response');
const pool = require('../../utils/conexion');

//Función para verficar que reciba datos y no esten vacios
function vefificarQuery(valorQuery){

    if(valorQuery.length == 0){
        console.log('Algunos campos del query estan vacios')
        return true
    }else{
        return false
    }

}


//Función para verificar el token
function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
        console.log(tokenData);
  
        if (tokenData["tipo"] == "Administrador") {
            statusCode = 200
            //mensaje agregado: 06/06/2022
            //saber procedencia del usuario
            console.log(tokenData)
            return statusCode
        }else{
            //Caso que un token exista pero no contenga los permisos para la petición
            statusCode = 401
            return statusCode
          }
    
        } catch (error) { //Caso de un token invalido, es decir que no exista
            statusCode = 401
            return statusCode
            
        }
}

function verifyTokenUser(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 

        if(tokenData["tipo"] == "Empleador" || tokenData["tipo"] == "Demandante" || tokenData["tipo"] == "Aspirante"){
            statusCode = 200
            console.log(tokenData)
            return statusCode
        }else{
            statusCode = 401
            return statusCode
        }
    }catch (error){
        statusCode = 401
        return statusCode
    }
}

path.get('/v1/iniciarSesion', (req, res) => {

    if(!vefificarQuery(req.query.nombreUsuario) && !vefificarQuery(req.query.clave)){

    var pool = mysqlConnection

    const {nombreUsuario, clave} = req.query

    pool.query('SELECT * FROM perfil_usuario WHERE nombre_usuario = ? AND clave = ?', [nombreUsuario, clave], (error, resultadoInicio)=>{
        if(error){ 
            res.status(500)
            res.send({msg: error.message})
        } else if(resultadoInicio.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)

            console.log("¡Credenciales incorrectas! Probablemente el usuario no exista o estan mal sus credenciales");
       
        }else{
            var usuario = resultadoInicio[0];

            const payload = {
                "idUsuario" : usuario['id_perfil_usuario'],
                "clave" : usuario['clave'],
                "tipo" : usuario['tipo_usuario']
            }
            
            const token = jwt.sign(payload, keys.key, { 
                expiresIn: 60 * 60 * 24
              });

            console.log("¡Inicio de sesión exitosa!")

            //var arrByte= new Uint8Array.from(Buffer.from(data))
            var array = Uint8ClampedArray.from(Buffer.from(usuario.fotografia, 'base64'))
            console.log(array.toString('base64'))

            const resultadoJson = {};
            resultadoJson['application/json'] = {
                "clave" : usuario['clave'],
                "tipo" : usuario['tipo_usuario'],
                "estatus" : usuario['estatus'],
                "idPerfilusuario" : usuario['id_perfil_usuario'],
                "correoElectronico" : usuario['correo_electronico'],
                "fotografia" : array,
                "tipoUsuario" : usuario['tipo_usuario'],
                "token" : token
            };
            res.status(200)
            res.send(resultadoJson['application/json'])
        }
    });

    }else{
        res.status(400)
        res.json(mensajes.peticionIncorrecta)
    }

});

path.get('/v1/perfilUsuarios', (req, res) => {
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)

    if(respuesta == 200){
        var query = 'SELECT * FROM perfil_usuario;'
        var pool = mysqlConnection

        pool.query(query, (error, resultadoUsuarios) => {
            if(error){ 
                res.status(500)
                res.json(mensajes.errorInterno)
            }else if(resultadoUsuarios.length == 0){
                res.status(404)
                res.json(mensajes.peticionNoEncontrada)
            }else{
                var usuarios = resultadoUsuarios;
    
                res.status(200)
                res.json(usuarios)
    
            }
        })
    }else if (respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido)
    }else{
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.get('/v1/PerfilUsuarios/:idPerfilUsuario',(req, res) => { //implementar validacion del idPerfilInexistente
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    const { idPerfilUsuario } = req.params

    if(respuesta == 200){
        var query = 'SELECT * FROM perfil_usuario WHERE id_perfil_usuario = ?;'
        pool = mysqlConnection

        pool.query(query, [idPerfilUsuario], (error, resultadoUsuario) => {
            if(error){ 
                res.status(500)
                res.json(mensajes.errorInterno)
            }else if(resultadoUsuario.length == 0){
    
                res.status(404)
                res.json(mensajes.peticionNoEncontrada)
     
            }else{
                var usuario = resultadoUsuario
                res.status(200)
                res.json(usuario)
            }
        })
    }else if (respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido)
    }else{
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.patch('/v1/restablecer', (req, res) => {
    //UNDER CONSTRUCTION
});

path.get('/v1/cerrarSesion', (req, res) => {
    //UNDER CONSTRUCTION
});

path.patch('/v1/perfilUsuarios/:idPerfilUsuario/habilitar', (req, res) => { // todos los metodos tienen que ir en un try/catch para cachar cualquier error
    try{
        const token = req.headers['x-access-token']
        var respuesta = verifyTokenUser(token)
        const { idPerfilUsuario } = req.params


        if(respuesta == 200){
            var query = 'UPDATE perfil_usuario SET estatus = ? WHERE id_perfil_usuario = ?;'

            mysqlConnection.query(query, [1, idPerfilUsuario], (error, resultadoHabilitar) => {
                if(error){ 
                    res.status(500)
                    res,json(mensajes.errorInterno)
                }else if(resultadoHabilitar.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    const idPerfilHabilitado = {}

                    idPerfilHabilitado['application/json'] = {
                        "idPerfilusuario" : idPerfilUsuario,
                        "estatus" : "Habilitado"
                    };

                    res.status(200)
                    res.send(idPerfilHabilitado['application/json'])
                }
            })
        }else if(respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    }catch (error){
        res.status(500)
        res.json(mensajes.errorInterno)
    }

});

path.patch('/v1/perfilUsuarios/:idPerfilUsuario/deshabilitar', (req, res) => { // implementar validaciones
    const token = req.headers['x-access-token'];
    var respuesta = verifyTokenUser(token)
    const { idPerfilUsuario } = req.params

    try{
        if (respuesta == 200){
            var query = 'UPDATE perfil_usuario SET estatus = ? WHERE id_perfil_usuario = ?;'

            mysqlConnection.query(query, [2, idPerfilUsuario], (error, resultadoDeshabilitar) => {
                if(error){ 
                    res.status(500)
                    res,json(mensajes.errorInterno)
                }else if(resultadoDeshabilitar.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    const idPerfilDeshabilitado = {}

                    idPerfilDeshabilitado['application/json'] = {
                        "idPerfilusuario" : idPerfilUsuario,
                        "estatus" : "Deshabilitado"
                    };

                    res.status(200)
                    res.send(idPerfilDeshabilitado['application/json'])
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    }catch (error){
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});


module.exports = path;