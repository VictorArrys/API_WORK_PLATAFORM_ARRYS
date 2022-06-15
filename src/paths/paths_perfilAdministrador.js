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

function actualizarUsuarioAdministrador(registroAdministrador, res, callback){
    var queryTwo = 'UPDATE perfil_usuario SET nombre_usuario = ?, clave = ?, correo_electronico = ? WHERE id_perfil_usuario = ?;'

    var idUsuario = registroAdministrador['idPerfilUsuario']
    var nombreU = registroAdministrador['nombreusuario']
    var clave = registroAdministrador['clave']
    var correoElectronico = registroAdministrador['correoElectronico']

    mysqlConnection.query(queryTwo, [nombreU, clave, correoElectronico, idUsuario], (error, acualizacion) => {
        if (error){
            console.log(error)
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if (acualizacion.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            if (acualizacion['affectedRows'] >= 0){
                const modificacionUsuario = {}
                var id = acualizacion.insertId

                modificacionUsuario['application/json'] = {
                    'clave': clave,
                    'correoElectronico': correoElectronico,
                    'idPerfilUsuario': idUsuario,
                    'nombreUsuario': nombreU
                };

                callback(modificacionUsuario['application/json'])
            }else{
                res.status(500)
                console.log('error actualizar despues de callback')
                res.json(mensajes.errorInterno)
            }
        }
    })
}

function comprobarActualizacion(nombreUsuario, correoElectronico, res, resultado){
    var queryOne = 'SELECT count(id_perfil_usuario) as Comprobacion FROM perfil_usuario WHERE nombre_usuario = ? AND correo_electronico = ?';

    mysqlConnection.query(queryOne, [nombreUsuario, correoElectronico], (error, comprobacion) => {
        if(error){
            console.log('error funcion comprobacion')
            res.status(500)
            res.json(mensajes.errorInterno)
        }else{
            resultado(comprobacion[0]['Comprobacion'])
        }
    })
}

path.get('/v1/perfilAdministradores', (req, res) => {  // jala
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    try {
        if (respuesta == 200){
            var query = 'SELECT * FROM perfil_administrador;'

            mysqlConnection.query(query, (error, resultadoAdministradores) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoAdministradores.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var cont = 0
                    var administradores = []
                    console.log(resultadoAdministradores)
                    do{
                        administradores.push(cont)

                        administradores[cont] = {
                            'idPerfilAdministrador': resultadoAdministradores[cont]['id_perfil_administrador'],
                            'idPerfilUsuarioAdmin' : resultadoAdministradores[cont]['id_perfil_usuario_admin'],
                            'nombre': resultadoAdministradores[cont]['nombre'],
                            'telefono': resultadoAdministradores[cont]['telefono']
                        };
                        cont ++
                    }while (cont < resultadoAdministradores)

                    res.status(200)
                    res.json(administradores)
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

path.get('/v1/perfilAdministradores/:idPerfilUsuarioAdmin', (req, res) => { // jala
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    const { idPerfilUsuarioAdmin } = req.params

    try {
        if(respuesta == 200){
            var query = 'SELECT * FROM perfil_administrador WHERE id_perfil_usuario_admin = ?;'

            mysqlConnection.query(query, [idPerfilUsuarioAdmin], (error, resultadoAdministrador) => {
                if(error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoAdministrador.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var administrador = resultadoAdministrador[0]
                    var getAdministrador = {}

                    getAdministrador['application/json'] = {
                        'idPerfilAdministrador': administrador['id_perfil_administrador'],
                        'idPerfilUsuarioAdmin' : administrador['id_perfil_usuario_admin'],
                        'nombre': administrador['nombre'],
                        'telefono': administrador['telefono']
                    }

                    res.status(200)
                    res.json(getAdministrador['application/json'])
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


path.put('/v1/perfilAdministradores/:idPerfilAdministrador', (req, res) => {
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
    const { idPerfilAdministrador } = req.params
    const { clave, correoElectronico, estatus, idPerfilUsuario, nombre, telefono, nombreUsuario} = req.body
    var queryThree = 'UPDATE perfil_administrador SET nombre = ?, telefono = ? WHERE id_perfil_administrador = ?;'

    try{
        if (respuesta == 200){
            comprobarActualizacion(nombreUsuario, correoElectronico, res, function(resultado) {
                if (resultado >= 1){
                    res.status(422)
                    res.json(mensajes.instruccionNoProcesada)
                }else{
                    actualizarUsuarioAdministrador(req.body, res, function(actualizacionAdministrador) {
                        if (res.error){
                            console.log('error funcion actualizar')
                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else{
                            mysqlConnection.query(queryThree, [nombre, telefono, idPerfilAdministrador], (error, actualizacionPerfil) => {
                                if (error){
                                    res.status(500)
                                    res.json(mensajes.errorInterno)
                                }else if(actualizacionPerfil.length == 401){
                                    res.status(404)
                                    res.json(mensajes.peticionNoEncontrada)
                                }else{
                                    if (actualizacionPerfil['affectedRows'] >= 0 ){
                                        const modificarAdministrador = {}

                                        modificarAdministrador['application/json'] = {
                                            'idPerfilUsuario': idPerfilUsuario,
                                            'idPerfilAdministrador': idPerfilAdministrador
                                        }

                                        res.status(200)
                                        res.json(modificarAdministrador['aplication/json'])
                                    }
                                }
                            })
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
    /*const token = req.headers['x-access-token']
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
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
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
    }*/
});

module.exports = path