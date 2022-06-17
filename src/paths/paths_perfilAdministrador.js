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

function consoleError(error, ubicacion){
    console.log('--------------------------------------------------------------------------------------')
    console.log('Se ha presentado un problema en: ' + ubicacion)
    console.log('Error(es): ' + error.message)
    console.log('--------------------------------------------------------------------------------------')
}

function actualizarUsuarioAdministrador(registroAdministrador, res, callback){
    var queryTwo = 'UPDATE perfil_usuario SET nombre_usuario = ?, clave = ?, correo_electronico = ? WHERE id_perfil_usuario = ?;'

    var idUsuario = registroAdministrador['idPerfilUsuario']
    var nombreU = registroAdministrador['nombreUsuario']
    var clave = registroAdministrador['clave']
    var correoElectronico = registroAdministrador['correoElectronico']

    mysqlConnection.query(queryTwo, [nombreU, clave, correoElectronico, idUsuario], (error, acualizacion) => {
        if (error){
            consoleError(error, 'Funcion: funcion actualizar administrador. Paso: error en actualizacion')

            res.status(500)
            res.json(mensajes.errorInterno)
        }else if (acualizacion.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
                const modificacionUsuario = {}
                var id = acualizacion.insertId

                modificacionUsuario['application/json'] = {
                    'clave': clave,
                    'correoElectronico': correoElectronico,
                    'idPerfilUsuario': idUsuario,
                    'nombreUsuario': nombreU
                };

                callback(modificacionUsuario['application/json'])

        }
    })
}

function comprobarActualizacion(nombreUsuario, correoElectronico, res, resultado){
    var queryOne = 'SELECT count(id_perfil_usuario) as Comprobacion FROM perfil_usuario WHERE nombre_usuario = ? AND correo_electronico = ?';

    mysqlConnection.query(queryOne, [nombreUsuario, correoElectronico], (error, comprobacion) => {
        if(error){
            consoleError(error, 'Funcion: comprobar actualizacion. Paso: comprobacion')

            res.status(500)
            res.json(mensajes.errorInterno)
        }else{
            resultado(comprobacion[0]['Comprobacion'])
        }
    })
}

path.get('/v1/perfilAdministradores', (req, res) => { // listo Api
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    try {
        if (respuesta == 200){
            var query = 'SELECT * FROM perfil_administrador;'

            mysqlConnection.query(query, (error, resultadoAdministradores) => {
                if (error){
                    consoleError(error, 'Funcion: administradores. Paso: consultar todos los administradores')

                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoAdministradores.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var cont = 0
                    var administradores = []

                    do{
                        administradores.push(cont)

                        administradores[cont] = {
                            'idPerfilAdministrador': resultadoAdministradores[cont]['id_perfil_administrador'],
                            'idPerfilUsuarioAdmin' : resultadoAdministradores[cont]['id_perfil_usuario_admin'],
                            'nombre': resultadoAdministradores[cont]['nombre'],
                            'telefono': resultadoAdministradores[cont]['telefono']
                        };
                        cont ++
                    }while (cont < resultadoAdministradores.length)

                    res.status(200)
                    res.json(administradores)
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
        consoleError(error, 'Funcion: administradores. Paso: excepcion cachada.')

        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.get('/v1/perfilAdministradores/:idPerfilUsuarioAdmin', (req, res) => { // listo api
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    const { idPerfilUsuarioAdmin } = req.params

    try {
        if(respuesta == 200){
            var query = 'SELECT * FROM perfil_administrador WHERE id_perfil_usuario_admin = ?;'

            mysqlConnection.query(query, [idPerfilUsuarioAdmin], (error, resultadoAdministrador) => {
                if(error){
                    consoleError(error, 'Funcion: administradores. Paso: consultar administrador')

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
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        consoleError(error, 'Funcion: administradores. Paso: Excepcion cachada.')

        res.status(500)
        res.json(mensajes.errorInterno)
    }
});


path.put('/v1/perfilAdministradores/:idPerfilAdministrador', (req, res) => { // listo api
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
    const { idPerfilAdministrador } = req.params
    const { clave, correoElectronico, idPerfilUsuario, nombre, telefono, nombreUsuario} = req.body
    var queryThree = 'UPDATE perfil_administrador SET nombre = ?, telefono = ? WHERE id_perfil_administrador = ?;'

    try{
        if (respuesta == 200){
            comprobarActualizacion(nombreUsuario, correoElectronico, res, function(resultado) {
                if (resultado >= 1){
                    res.status(422)
                    res.json(mensajes.instruccionNoProcesada)
                }else{
                    actualizarUsuarioAdministrador(req.body, res, function(actualizacionAdministrador) {

                        mysqlConnection.query(queryThree, [nombre, telefono, idPerfilAdministrador], (error, modificarAdministrador) =>{
                            if (error){
                                consoleError(error, 'Funcion: modigicar administrador. Paso: error al modificar administrador')

                                res.status(500)
                                res.json(mensajes.errorInterno)
                            }else if (modificarAdministrador.length == 0){
                                res.status(404)
                                res.json(mensajes.peticionNoEncontrada)
                            }else{

                                
                                const putAdministrador = {}
                                putAdministrador['application/json'] = {
                                    'idPerfilUsuario': idPerfilUsuario,
                                    'idPerfilAdministrador': idPerfilAdministrador
                                }

                                res.status(200)
                                res.json(putAdministrador['application/json'])
                            }
                        })
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
    }catch (error){
        consoleError(error, 'Funcion: modificar administrador. Paso: Excepcion cachada')

        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

module.exports = path