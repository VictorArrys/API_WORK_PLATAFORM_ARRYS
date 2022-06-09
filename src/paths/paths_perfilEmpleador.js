const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');
const req = require('express/lib/request');
const res = require('express/lib/response');
const pool = require('../../utils/conexion');
const { query } = require('express');

function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
        console.log(tokenData);
  
        if (tokenData['tipo'] == 'Administrador' || tokenData['tipo'] == 'Empleador') {
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

path.get('/v1/perfilEmpleadores', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    try {
        if(respuesta == 200){
            var query = 'SELECT * FROM perfil_empleador;'
            pool = mysqlConnection

            pool.query(query, (error, resultadoEmpleadores) => {
                if(error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoEmpleadores.length == 0){
                    res.status(404)
                    res.json(peticionIncorrecta)
                }else{
                    var empleadores = resultadoEmpleadores;

                    res.status(200)
                    res.json(empleadores)
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.post('/v1/perfilEmpleadores', (req, res) => {
    var idDeUsuario = 0
    const {direccion, fechaNacimiento, nombre, nombreOrganizacion, telefono, clave, correoElectronico, estatus, nombreusuario, tipo} = req.body
    console.log(nombreusuario)

    try {
        var queryOne = 'INSERT INTO perfil_usuario (nombre_usuario, estatus,  clave, correo_electronico, tipo_usuario) VALUES (?, ?, ?, ?, ?) ;'
        var queryTwo = 'INSERT INTO perfil_empleador (id_perfil_usuario_empleador, nombre_organizacion, nombre, direccion, fecha_nacimiento, telefono, amonestaciones) VALUES (?, ?, ?, ?, ?, ?, ?);'

        mysqlConnection.query(queryOne, [nombreusuario, estatus, clave, correoElectronico, tipo], (error, registrarUsuarioEmpleador) => {
            if (error){
                res.status(500)
                res.json(mensajes.errorInterno)
            }else if (registrarUsuarioEmpleador.length == 0){
                //
            }else{
                idDeUsuario = registrarUsuarioEmpleador.insertId
                
                mysqlConnection.query(queryTwo, [idDeUsuario, nombreOrganizacion, nombre, direccion, fechaNacimiento, telefono, 0], (error, registrarPerfilEmpleador) => {
                    if (error){
                        res.status(500)
                        res.json(mensajes.errorInterno)
                    }else if (registrarPerfilEmpleador.length == 0){
                        
                    }else{
                        var usuarioEmpleador = registrarUsuarioEmpleador
                        var perfilEmpleador = registrarPerfilEmpleador

                        const registroEmpleador = {}
                        registroEmpleador['application/json'] = {
                            "clave": usuarioEmpleador['clave'],
                            "correoElectronico": usuarioEmpleador['correo_electronico'],
                            "direccion": perfilEmpleador['direccion'],
                            "estatus": usuarioEmpleador['estatus'],
                            "fechaNacimiento": perfilEmpleador['fecha_nacimiento'],
                            "idPerfilUsuario": usuarioEmpleador['id_perfil_usuario'],
                            "nombre": perfilEmpleador['nombre'],
                            "nombreOrganizacion": perfilEmpleador['nombre_organizacion'],
                            "telefono": perfilEmpleador['telefono'],
                            "idPerfilEmpleador": perfilEmpleador['id_perfil_empleador'],
                            "nombreusuario": usuarioEmpleador['nombre_usuario']
                        };
                        res.status(201)
                        res.json(registroEmpleador['application/json'])
                    }
                })
            }
        })
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.get('/v1/perfilEmpleadores/:idPerfilUsuarioEmpleador', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)
    const { idPerfilUsuarioEmpleador } = req.params

    try {
        if (respuesta == 200){
            var query = 'SELECT * FROM perfil_empleador WHERE id_perfil_usuario_empleador = ?;'
            pool = mysqlConnection

            pool.query(query, [idPerfilUsuarioEmpleador], (error, resultadoEmpleador) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoEmpleador.length == 0){
                    res.status(404)
                    res.json(peticionIncorrecta)
                }else{
                    var empleador = resultadoEmpleador

                    res.status(200)
                    res.json(empleador)
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.put('/v1/perfilEmpleadores/:idPerfilEmpleador', (req, res) => {
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
    const { idPerfilEmpleador } = req.params
    const {direccion, fechaNacimiento, nombre, nombreOrganizacion, telefono, clave, correoElectronico, estatus, idPerfilUsuario, 
        nombreusuario} = req.body

    try {
        if (respuesta == 200){
            var queryOne = 'UPDATE perfil_usuario SET  nombre_usuario = ?, estatus = ?, clave = ?, correo_electronico = ? WHERE id_perfil_usuario = ? ;'
            var queryTwo = 'UPDATE perfil_empleador SET nombre_organizacion = ?, nombre = ?, direccion = ?, fecha_nacimiento = ?, telefono = ? WHERE id_perfil_empleador = ? ;'

            mysqlConnection.query(queryOne, [nombreusuario, estatus, clave, correoElectronico, idPerfilUsuario], (error, actualizarUsuarioEmpleador) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (actualizarUsuarioEmpleador.length == 0){
                    //
                }else{
                    mysqlConnection.query(queryTwo, [nombreOrganizacion, nombre, direccion, fechaNacimiento, telefono, idPerfilEmpleador], (error, actualizarPerfilEmpleador) => {
                        if (error){
                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else if (actualizarPerfilEmpleador.length == 0){
                            //
                        }else{
                            var modificarUsuarioEmpleador = actualizarUsuarioEmpleador
                            var modificarPerfilEmpleador = actualizarPerfilEmpleador
                            var arrayFotografia = Uint8ClampedArray.from(Buffer.from(modificarUsuarioEmpleador.fotografia, 'base64'))

                            const registroEmpleador = {}
                            modificarEmpleador['application/json'] = {
                                "clave": modificarUsuarioEmpleador['clave'],
                                "correoElectronico": modificarUsuarioEmpleador['correo_electronico'],
                                "direccion": modificarPerfilEmpleador['direccion'],
                                "estatus": modificarUsuarioEmpleador['estatus'],
                                "fechaNacimiento": modificarPerfilEmpleador['fecha_nacimiento'],
                                "idPerfilUsuario": modificarUsuarioEmpleador['id_perfil_usuario'],
                                "nombre": modificarPerfilEmpleador['nombre'],
                                "nombreOrganizacion": modificarPerfilEmpleador['nombre_organizacion'],
                                "telefono": modificarPerfilEmpleador['telefono'],
                                "idPerfilEmpleador": modificarPerfilEmpleador['id_perfil_empleador'],
                                "fotografia": arrayFotografia,
                                "nombreusuario": modificarUsuarioEmpleador['nombre_usuario']
                            };
                            res.status(200)
                            res.json(modificarEmpleador['application/json'])
                        }
                    })
                }
            })
        }else if(respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});


/*path.post('/v1/perfilEmpleadores/', (req, res) => {  // este podria ser un post en usuarios 
    const {clave, correoElectronico, estatus, nombreusuario, tipo} = req.body

    try {
        var query = 'INSERT INTO perfil_usuario (nombre_usuario, estatus,  clave, correo_electronico, tipo_usuario) VALUES (?, ?, ?, ?, ?) ;'

        mysqlConnection.query(query, [nombreusuario, estatus, clave, correoElectronico, tipo], (error, registroUsuarioEmpleador) => {
            if (error){
                res.status(500)
                res.json(mensajes.errorInterno)
            }else if (registroUsuarioEmpleador.length == 0){
                // que peticion podria ir aqui
            }else{
                //codigo de momento
                res.status(100)
                //aqui devolver el id del usuario registrado
                res.json('exito al registrar, procede a registrar perfil')
            }
        })
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.post('/v1/perfilEmpleadores/:idPerfilUsuarioEmpleador', (req, res) => {
    const { idPerfilUsuarioEmpleador } = req.params

    try{
        var query = 'INSERT INTO perfil_empleador (id_perfil_usuario_empleador, nombre_organizacion, nombre, direccion, fecha_nacimiento, telefono, amonestaciones) VALUES (?, ?, ?, ?, ?, ?, ?);'

        mysqlConnection.query(query, [], (error, registroPerfilEmpleador) => {
            if (error){
                res.status(500)
                res.json(mensajes.errorInterno)
            }else if (registroPerfilEmpleador.length == 0){
                //
            }else{

            }
        })
    }catch (error){
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});*/

module.exports = path;