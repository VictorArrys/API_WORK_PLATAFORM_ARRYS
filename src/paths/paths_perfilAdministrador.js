const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

//Respuestas
const mensajes = require('../../utils/mensajes');
const pool = require('../../utils/conexion');
const req = require('express/lib/request');
const res = require('express/lib/response');

//Función para verificar el token
function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key)
        console.log(tokenData);
  
        if (tokenData["tipo"] == "Administrador") {
            statusCode = 200
            return statusCode
        }else{
            
            statusCode = 401
            return statusCode
          }
    
        } catch (error) { 
            statusCode = 401
            return statusCode
            
        }
}

path.post('/v1/perfilAdministradores/:idPerfilAdministrador/fotografia', multerUpload.single("fotografia"), (req,res) => {

    var query = "UPDATE perfil_usuario SET fotografia = ? WHERE id_perfil_usuario = ?;"
    const { idPerfilAdministrador } = req.params
    const { fotografia } = req.file.buffer

    mysqlConnection.query(query, [fotografia, idPerfilAdministrador], (error, resultadoFotografia) => {
        if (error){
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if(resultadoFotografia.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            console.log('exito al cargar fotografia')
        }
    })
});

path.post('/v1/perfilAdministradores/:idPerfilAdministrador/curriculum', (req, res) => {// path opcional
  // comvertir array de bytes a documento y a video de lado de c#
});

path.post('/v1/perfilAdministradores/:idPerfilAdministrador/video', (req, res) => {

});


//preguntar si se necesitaran patch para actualizar los multimedia
/*path.patch('/v1/perfilAdministradores/:idPerfilAdministrador/fotografia', multerUpload.single("fotografia"), (req,res) => {

    var query = "UPDATE perfil_usuario SET fotografia = ? WHERE id_perfil_usuario = ?;"
    const { idPerfilAdministrador } = req.params
    const { fotografia } = req.file.buffer

    mysqlConnection.query(query, [fotografia, idPerfilAdministrador], (error, resultadoFotografia) => {
        if (error){
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if(resultadoFotografia.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            console.log('exio al cargar fotografia')
        }
    })
});

path.patch('/v1/perfilAdministradores/:idPerfilAdministrador/curriculum', (req, res) => {// path opcional
  // comvertir array de bytes a documento y a video de lado de c#
});

path.patch('/v1/perfilAdministradores/:idPerfilAdministrador/video', (req, res) => {

});*/

path.get('/v1/perfilAdministradores', (req, res) => { //falta validaciones
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    try {
        if (respuesta == 200){
            var query = 'SELECT * FROM perfil_administrador;'
            pool = mysqlConnection

            pool.query(query, (error, resultadoAdminisdtradores) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoAdminisdtradores.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var administradores = resultadoAdminisdtradores

                    res.status(200);
                    res.json(administradores);
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.get('/v1/perfilAdministradores/:idPerfilAdministrador', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    const { idPerfilAdministrador } = req.params

    try {
        if(respuesta == 200){
            var query = 'SELECT * FROM perfil_administrador WHERE id_perfil_administrador = ?;'
            pool = mysqlConnection

            pool.query(query, [idPerfilAdministrador], (error, resultadoAdministrador) => {
                if(error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoAdministrador.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var administrador = resultadoAdministrador

                    res.status(200);
                    res.json(administrador);
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});


path.put('/v1/perfilAdministradores/:idPerfilAdministrador', (req, res) => {//probar
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)
    const { idPerfilAdministrador } = req.params
    const {nombre, telefono, clave, correoElectronico, estatus, idPerfilUsuario, nombreUsuario} = req.body

    try{
        if(respuesta == 200){
            var queryOne = 'UPDATE perfil_usuario SET  nombre_usuario = ?, estatus = ?, clave = ?, correo_electronico = ?  WHERE id_perfil_usuario = ? ;'
            var queryTwo = 'UPDATE perfil_administrador SET nombre = ?, telefono = ? WHERE id_perfil_administrador = ? ;'

            mysqlConnection.query(queryOne, [nombreUsuario, estatus, clave, correoElectronico, idPerfilUsuario], (error, actualizarUsuarioAdministrador) => {
                if(error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (actualizarUsuarioAdministrador.length == 0){
                    //por debatir
                }else{
                    console.log('exito al registrar cuenta del Administrador')
                    mysqlConnection.query(queryTwo, [nombre, telefono, idPerfilAdministrador], (error, actualizarAdministrador) => {
                        if(error){
                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else if(actualizarAdministrador.length == 0){
                            //
                        }else{
                            var perfilAdministrador = actualizarAdministrador
                            var usuarioAdministrador = actualizarUsuarioAdministrador
                            var arrayFotografia = Uint8ClampedArray.from(Buffer.from(usuarioAdministrador.fotografia, 'base64'))

                            const modificarAdministrador = {}
                            modificarAdministrador['application/json'] = {
                                "clave" : usuarioAdministrador['clave'],
                                "tipo" : usuarioAdministrador['tipo_usuario'],
                                "estatus" : usuarioAdministrador['estatus'],
                                "idPerfilusuario" : usuarioAdministrador['id_perfil_usuario'],
                                "correoElectronico" : usuarioAdministrador['correo_electronico'],
                                "fotografia" : arrayFotografia,
                                "tipoUsuario" : actualizarUsuarioAdministrador['tipo_usuario'],
                                "nombre": perfilAdministrador['nombre'],
                                "telefono": perfilAdministrador['telefono'],
                                "idPerfilAdministrador": perfilAdministrador['id_perfil_administrador']
                            };
                            res.status(200)
                            res.send(modificarAdministrador['application/json'])
                        }
                    })
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    }catch (error){
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

module.exports = path