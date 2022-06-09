const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');
const req = require('express/lib/request');
const res = require('express/lib/response');
const pool = require('../../utils/conexion');

function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
        console.log(tokenData);
  
        if (tokenData["tipo"] == "Administrador" || tokenData["tipo"] == "Demandante") {
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

path.get('/v1/perfilDemandantes', (req, res) => { // probar y validar
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)

    try{
        if(respuesta == 200){
            var query = 'SELECT * FROM perfil_demandante;'
            pool = mysqlConnection

            pool.query(query, (error, resultadoDemandantes) => {
                if(error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoDemandantes.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var demandantes = resultadoDemandantes

                    res.status(200)
                    res.json(demandantes)
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

path.get('/v1/perfilDemandantes/:idPerfilUsuarioDemandante', (req, res) => { 
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
    const { idPerfilUsuarioDemandante } = req.params

    try {
        if (respuesta == 200){
            var query = 'SELECT * FROM perfil_demandante WHERE id_perfil_usuario_demandante = ?;'
            pool = mysqlConnection

            pool.query(query, [idPerfilDemandante], (error, resultadoDemandante) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoDemandante.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var demandante = resultadoDemandante

                    res.status(200)
                    res.json(demandante)
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

path.post('/v1/perfilDemandantes', (req, res) => { // probar y validar 
    var idDeUsuario = 0
    const { direccion, fechaNacimiento, nombre, telefono, clave, correoElectronico, estatus,
        nombreUsuario, tipo } = req.body
    
    try {
        var queryOne = 'INSERT INTO perfil_usuario (nombre_usuario, estatus,  clave, correo_electronico, tipo_usuario) VALUES (?, ?, ?, ?, ? ) ;'
        var queryTwo = 'INSERT INTO perfil_demandante (id_perfil_usuario_demandante, nonbre, fecha_nacimiento, telefono, direccion) VALUES ( ?, ?, ?, ?, ?);'

        mysqlConnection.query(queryOne, [nombreUsuario, estatus, clave, correoElectronico, tipo], (error, registrarUsuarioDemandante) => {
            if (error){
                res.status(500)
                res.json(mensajes.errorInterno)
            }else if (registrarUsuarioDemandante.length == 0){
                //
            }else{
                console.log('Exito al registrar el usuario demandante')
                idDeUsuario = registrarUsuarioDemandante.insertId

                mysqlConnection.query(queryTwo, [idDeUsuario, nombre, fechaNacimiento, telefono, direccion], (error, registrarPerfilDemandante) => {
                    if (error){
                        res.status(500)
                        res.json(mensajes.errorInterno)
                    }else if(registrarPerfilDemandante.length == 0){
                        //
                    }else{
                        var usuarioDemandante = registrarUsuarioDemandante
                        var perfilDemandante = registrarPerfilDemandante
                        var arrayFotografia = Uint8ClampedArray.from(Buffer.from(usuarioDemandante.fotografia, 'base64'))

                        const registroDemandante = {}
                        registroDemandante['application/json'] = {
                            "clave": usuarioDemandante['clave'],
                            "correoElectronico": usuarioDemandante['correo_electronico'],
                            "direccion": perfilDemandante['direccion'],
                            "estatus": usuarioDemandante['estatus'],
                            "fechaNacimiento": perfilDemandante['fecha_nacimiento'],
                            "idPerfilUsuario": usuarioDemandante['id_perfil_usuario'],
                            "nombre": perfilDemandante['nonbre'],
                            "nombreUsuario": usuarioDemandante['nombre_usuario'],
                            "telefono": perfilDemandante['telefono'],
                            "idperfilDemandante": perfilDemandante['id_perfil_demandante'],
                            "fotografia": arrayFotografia
                        };
                        res.status(201)
                        res.json(registroDemandante['application/json'])
                    }
                })
            }
        })
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.put('/v1/perfilDemandantes/:idPerfilDemandante', (req, res) => { // probar y validar
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
    const { idperfilDemandante } = req.params
    const { direccion, fechaNacimiento, nombre, telefono, clave, correoElectronico, estatus,
        nombreUsuario, idPerfilUsuario} = req.body

    try {
        if (respuesta == 200){
            var queryOne = 'UPDATE perfil_usuario SET  nombre_usuario = ?, estatus = ?, clave = ?, correo_electronico = ? WHERE id_perfil_usuario = ? ;'
            var queryTwo = 'UPDATE perfil_demandante SET nonbre = ?, fecha_nacimiento = ?, telefono = ?, direccion = ? WHERE id_perfil_demandante = ? ;'

            mysqlConnection.query(queryOne, [nombreUsuario, estatus, clave, correoElectronico, idPerfilUsuario], (error, actualizarUsuarioDemandante) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (actualizarUsuarioDemandante.length == 0){
                    //
                }else{
                    console.log('exito al registrar cuenta del demandante')
                    mysqlConnection.query(queryTwo, [nombre, fechaNacimiento, telefono, direccion, idperfilDemandante], (error, actualizarPerfilDemandante) => {
                        if (error){
                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else if (actualizarPerfilDemandante.length == 0){
                            // aqui podriamos eliminar el registro de arriba 
                        }else{
                            var modificarUsuarioDemandante = actualizarUsuarioDemandante
                            var modificarPerfilDemandante = actualizarPerfilDemandante
                            var arrayFotografia = Uint8ClampedArray.from(Buffer.from(modificarUsuarioDemandante.fotografia, 'base64'))

                            const modificarRegistrDemandante = {}
                            modificarRegistrDemandante['application/json'] = {
                                "clave": modificarUsuarioDemandante['clave'],
                                "correoElectronico": modificarUsuarioDemandante['correo_electronico'],
                                "direccion": modificarPerfilDemandante['direccion'],
                                "estatus": modificarUsuarioDemandante['estatus'],
                                "fechaNacimiento": modificarPerfilDemandante['fecha_nacimiento'],
                                "idPerfilUsuario": modificarUsuarioDemandante['id_perfil_usuario'],
                                "nombre": modificarPerfilDemandante['nonbre'],
                                "nombreUsuario": modificarUsuarioDemandante['nombre_usuario'],
                                "telefono": modificarPerfilDemandante['telefono'],
                                "idperfilDemandante": modificarPerfilDemandante['id_perfil_demandante'],
                                "fotografia": arrayFotografia
                            };

                            res.status(200)
                            res.json(modificarRegistrDemandante['application/json'])
                        }
                    })
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
})

module.exports = path;