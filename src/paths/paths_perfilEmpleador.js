const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');
const req = require('express/lib/request');
const res = require('express/lib/response');
const pool = require('../../utils/conexion');
const mensajes = require('../../utils/mensajes');
const GestionToken = require('../utils/GestionToken');
const { GestionUsuarios } = require('../componentes/GestionUsuarios');

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

function consoleError(error, ubicacion){
    console.log('--------------------------------------------------------------------------------------')
    console.log('Se ha presentado un problema en: ' + ubicacion)
    console.log('Error(es): ' + error.message)
    console.log('--------------------------------------------------------------------------------------')
}

function registrarUsuarioEmpleador(datoEmpleador, res, callback){
    var queryTwo = 'INSERT INTO perfil_usuario (nombre_usuario, estatus,  clave, correo_electronico, tipo_usuario) VALUES (?, ?, ?, ?, ?) ;'

    var nombreU = datoEmpleador['nombreusuario']
    var estatus = datoEmpleador['estatus']
    var clave = datoEmpleador['clave']
    var correoElectronico = datoEmpleador['correoElectronico']
    var tipo = 'Empleador'

    mysqlConnection.query(queryTwo, [nombreU, estatus, clave, correoElectronico, tipo], (error, registro) => {
        if (error){
            console.log(error)
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if (registro.length == 0){
            console.log('404 de la funcion')
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            if (registro['affectedRows'] == 1){
                const registroUsuario = {}
                var id = registro.insertId

                registroUsuario['application/json'] = {
                    'clave': clave,
                    'correoElectronico': correoElectronico,
                    'estatus': estatus,
                    'idPerfilUsuario': id,
                    'nombreUsuario': nombreU
                };

                callback(registroUsuario)
            }else{
                console.log('error del callback')
                res.status(500)
                res.json(mensajes.errorInterno)
            }
        }
    })
}

function actualizarUsuarioEmpleador(registroEmpleador, res, callback){
    var queryTwo = 'UPDATE perfil_usuario SET nombre_usuario = ?, clave = ?, correo_electronico = ? WHERE id_perfil_usuario = ?;'

    var idUsuario = registroEmpleador['idPerfilUsuario']
    var nombreU = registroEmpleador['nombreusuario']
    var clave = registroEmpleador['clave']
    var correoElectronico = registroEmpleador['correoElectronico']

    mysqlConnection.query(queryTwo, [nombreU, clave, correoElectronico, idUsuario], (error, actualizacion) => {
        if (error){
            console.log(error)
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if (actualizacion.length == 404){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            if (actualizacion['affectedRows'] >= 0){

                const modificacionUsuario = {}
                var id = actualizacion.insertId

                modificacionUsuario['application/json'] = {
                    'clave': clave,
                    'correoElectronico': correoElectronico,
                    'idPerfilUsuario': idUsuario,
                    'nombreUsuario': nombreU
                }

                callback(modificacionUsuario['application/json'])
            }else{
                res.status(500)
                console.log('error actualizar despues de callback')
                res.json(mensajes.errorInterno)
            }
        }
    })
}

function comprobarRegistro(nombreUsuario, correoElectronico, res, resultado){
    var queryOne = 'SELECT count(id_perfil_usuario) as Comprobacion FROM perfil_usuario WHERE nombre_usuario = ? OR  correo_electronico = ?';

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

function comprobarActualizacion(nombreUsuario, correoElectronico, res, resultado){ // verificar mañana
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

path.get('/v1/perfilEmpleadores', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = GestionToken.ValidarToken(token)

    try {
        if(respuesta.statusCode == 200){
            GestionUsuarios.getEmpleadores(function(codigoRespuesta, cuerpoRespuesta){
                res.status(codigoRespuesta)
                res.json(cuerpoRespuesta)
            })
            
        }else if (respuesta.statusCode == 401){
            res.status(respuesta.statusCode)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        console.log(error)
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.post('/v1/perfilEmpleadores', (req, res) => { // listo en api
    var queryThree = 'INSERT INTO perfil_empleador (id_perfil_usuario_empleador, nombre_organizacion, nombre, direccion, fecha_nacimiento, telefono, amonestaciones) VALUES (?, ?, ?, ?, ?, ?, ?);'
    const { clave, correoElectronico, direccion, estatus, fechaNacimiento, nombre, nombreOrganizacion, telefono, nombreusuario } = req.body
    try {
        comprobarRegistro(nombreusuario, correoElectronico, res, function(resultado) {
            if (resultado >= 1){
                res.status(422)
                res.json(mensajes.instruccionNoProcesada)
            }else{
                registrarUsuarioEmpleador(req.body, res, function(registroUempleador) {
                    if (res.error){
                        consoleError(error, 'Funcion: registrar empleador. Paso: error al registrar usuarioEmpleador')
    
                        res.status(500)
                        res.json(mensajes.errorInterno)
                    }else{
                        var idDeUsuario = 0;
                        idDeUsuario = registroUempleador['application/json']['idPerfilUsuario']
    
                        mysqlConnection.query(queryThree, [idDeUsuario, nombreOrganizacion, nombre, direccion, fechaNacimiento, telefono, 0], (error, registroPerfil) => {
                            if (error){
                                consoleError(error, 'Funcion: registrar Perfil Empleador. Paso: error al registrar perfil empleador')
    
                                res.status(500)
                                res.json(mensajes.errorInterno)
                            }else if (registroPerfil.length == 0){
                                console.log('404 perfil')
                                res.status(404)
                                res.json(mensajes.peticionNoEncontrada)
                            }else{
                                if (registroPerfil['affectedRows'] == 1){
                                    var idEmpleador = registroPerfil.insertId
    
                                    const nuevoEmpleador = {}
                                    nuevoEmpleador['application/json'] = {
                                        'idPerfilUsuario': registroUempleador['application/json']['idPerfilUsuario'],
                                        'idPerfilEmpleador': idEmpleador
                                    }
    
                                    res.status(201)
                                    res.json(nuevoEmpleador['application/json'])
                                }
                            }
                        })
                    }
                })
            }
        })
    } catch (error) {
        consoleError(error, 'Funcion: registrar empleador. Paso Excepcion cachada')

        res.status(500)
        res.json(mensajes.errorInterno)
    }

    
});

path.get('/v1/perfilEmpleadores/:idPerfilUsuarioEmpleador', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = GestionToken.ValidarToken(token)
    const { idPerfilUsuarioEmpleador } = req.params

    try {
        if (respuesta.statusCode == 200){
            GestionUsuarios.getEmpleador(idPerfilUsuarioEmpleador, function(codigoRespuesta, cuerpoRespuesta){
                res.status(codigoRespuesta)
                res.json(cuerpoRespuesta)
            })
        }else if (respuesta.statusCode == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        consoleError(error, 'Funcion: Obtener empleador. Paso: Excepcion cachada')

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
    var queryThree = 'UPDATE perfil_empleador SET nombre_organizacion = ?, nombre = ?, direccion = ?, fecha_nacimiento = ?, telefono = ? WHERE id_perfil_empleador = ? ;'
    try{
        if (respuesta == 200){
            comprobarActualizacion(nombreusuario, correoElectronico, res, function(resultado) {// validar en caso de que no cambie nada
                if (resultado >= 1){
                    res.status(422)
                    res.json(mensajes.instruccionNoProcesada)
                }else{
                    actualizarUsuarioEmpleador(req.body, res, function(actualizacionEmpleador) {
                        if (res.error){
                            consoleError(error, 'Funcion: actualizar empleador. Paso: error al actualizar usuario empleador')

                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else{
                            mysqlConnection.query(queryThree, [nombreOrganizacion, nombre, direccion, fechaNacimiento, telefono, idPerfilEmpleador], (error, actualizacionPerfil) =>{
                                if (error){
                                    consoleError(error, 'Funcion: actualizar perfil empleador. Paso: Error al acutalizar empleador')

                                    res.status(500)
                                    res.json(mensajes.errorInterno)
                                }else if(actualizacionPerfil.length == 0){
                                    res.status(404)
                                    res.json(peticionIncorrecta)
                                }else{
                                    if (actualizacionPerfil['affectedRows'] >= 1){
                                        const modificarEmpleador = {}

                                        modificarEmpleador['application/json'] ={
                                            'idPerfilUsuario': idPerfilUsuario,
                                            'idPerfilEmpleador': idPerfilEmpleador
                                        }

                                        res.status(200)
                                        res.json(modificarEmpleador['application/json'])
                                    }
                                }
                            })
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
    }catch(error){
        consoleError(error, 'Funcion: actualizar empleador. Paso: Excepcion cachada')

        res.status(500)
        res.json(mensajes.errorInterno)
    }
});


module.exports = path;