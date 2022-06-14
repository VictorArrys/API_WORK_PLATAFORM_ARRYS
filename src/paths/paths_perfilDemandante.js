const { Router, query } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');
const req = require('express/lib/request');
const res = require('express/lib/response');
const pool = require('../../utils/conexion');
const mensajes = require('../../utils/mensajes');

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

function consoleError(error, ubicacion){
    console.log('--------------------------------------------------------------------------------------')
    console.log('Se ha presentado un problema en: ' + ubicacion)
    console.log('Error(es): ' + error.message)
    console.log('--------------------------------------------------------------------------------------')
}
 

function registrarUsuarioDemandante(datoDemandante, res, callback){
    var queryTwo = 'INSERT INTO perfil_usuario (nombre_usuario, estatus,  clave, correo_electronico, tipo_usuario) VALUES (?, ?, ?, ?, ? ) ;'

    var nombreU = datoDemandante['nombreUsuario']
    var estatus = datoDemandante['estatus']
    var clave = datoDemandante['clave']
    var correoElectronico = datoDemandante['correoElectronico']
    var tipo = 'Demandante'


    mysqlConnection.query(queryTwo, [nombreU, estatus, clave, correoElectronico, tipo], (error, registro) => {
        if (error){
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if (registro.length == 0){
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
                res.status(500)
                res.json(mensajes.errorInterno)
            }

        }
    })
}

function actualizarUsuarioDemandante(registroDemandante, idusuarioDemandante, res, callback){
    var queryTwo = 'UPDATE perfil_usuario SET nombre_usuario = ?, clave = ?, correo_electronico = ? WHERE id_perfil_usuario = ? ;'
    
    var idUsuario = idusuarioDemandante['idPerfilUsuario']
    var nombreU = registroDemandante['nombreUsuario']
    var clave = registroDemandante['clave']
    var correoElectronico = registroDemandante['correoElectronico']

    mysqlConnection.query(queryTwo, [nombreU, clave, correoElectronico, idUsuario] , (error, actualizacion) => {
        if (error){
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if (actualizacion.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            if (actualizacion['affectedRows'] == 1){
                const modificacionUsuario = {}
                var id = actualizacion.insertId

                modificacionUsuario['application/json'] = {
                    'clave': clave,
                    'correoElectronico': correoElectronico,
                    'idPerfilUsuario': id,
                    'nombreUsuario': nombreU
                }

                callback(modificacionUsuario['application/json'])
            }else{
                res.status(500)
                res.json(mensajes.errorInterno)
            }
        }
    })
}

function  comprobarRegistro(nombreUsuario, correoElectronico, res, resultado){
    var queryOne = 'SELECT count(id_perfil_usuario) as Comprobacion FROM perfil_usuario WHERE nombre_usuario = ? OR  correo_electronico = ?';

    mysqlConnection.query(queryOne, [nombreUsuario, correoElectronico], (error, comprobacion) => {
        if(error){
            consoleError(error, 'Funcion: contratacionesEmpleo Paso: Consultar contratacion2')
            res.status(500)
            res.json(mensajes.errorInterno)
        }else{
            resultado(comprobacion[0]['Comprobacion'])
        }
    })
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

            mysqlConnection.query(query, [idPerfilUsuarioDemandante], (error, resultadoDemandante) => {
                if (error){
                    console.log(error)
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoDemandante.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var getdemandante = resultadoDemandante[0]

                    const demandante = {}
                    demandante['application/json'] = {
                        'direccion': getdemandante['direccion'],
                        "fechaNacimiento": getdemandante['fecha_nacimiento'],
                        "nombre": getdemandante['nonbre'],
                        "telefono": getdemandante['telefono'],
                        "idperfilDemandante": getdemandante['id_perfil_demandante']
                    };

                    res.status(200)
                    res.json(demandante['application/json'])
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
        console.log(error)
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.post('/v1/perfilDemandantes', (req, res) => { 
    var queryThree = 'INSERT INTO perfil_demandante (id_perfil_usuario_demandante, nonbre, fecha_nacimiento, telefono, direccion) VALUES ( ?, ?, ?, ?, ?);'
    const { clave, correoElectronico, direccion, estatus, fechaNacimiento, nombre, nombreUsuario, telefono  } = req.body

    comprobarRegistro(nombreUsuario, correoElectronico, res, function(resultado){
        if (resultado >= 1){
            res.status(422)
            res.json(mensajes.instruccionNoProcesada)
        }else{
            registrarUsuarioDemandante(req.body, res, function(registroUDemandante) {
                if (res.error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else{
                    var idDeUsuario = 0
                    idDeUsuario = registroUDemandante['application/json']['idPerfilUsuario']


                    mysqlConnection.query(queryThree, [idDeUsuario, nombre, fechaNacimiento, telefono, direccion], (error, registro) => {
                        if (error){
                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else if (registro.length == 0){
                            res.status(404)
                            res.json(mensajes.peticionNoEncontrada)
                        }else{                          
                            if (registro['affectedRows'] == 1){
                                
                                var idAspirante = registro.insertId
                                const demandante = {}

                                demandante['application/json'] = {
                                    'clave': registroUDemandante['application/json']['clave'],
                                    'correoElectronico': registroUDemandante['application/json']['correoElectronico'],
                                    'direccion': direccion,
                                    'estatus': registroUDemandante['application/json']['estatus'],
                                    'fechaNacimiento': fechaNacimiento,
                                    'idPerfilUsuario': registroUDemandante['application/json']['idPerfilUsuario'],
                                    'nombre': nombre,
                                    'nombreUsuario': registroUDemandante['application/json']['nombreUsuario'],
                                    'telefono': telefono,
                                    'idPerfilAspirante': idAspirante
                                };

                                res.status(201)
                                res.json(demandante['application/json'])
                            }
                        }
                    })
                }
            })
        }
    }) 

});

path.put('/v1/perfilDemandantes/:idPerfilDemandante', (req, res) => {
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
    const { idperfilDemandante } = req.params
    const { clave, correoElectronico, direccion, estatus, fechaNacimiento, idPerfilUsuario, nombre, nombreUsuario, telefono } = req.body
    var queryThree = 'UPDATE perfil_demandante SET nonbre = ?, fecha_nacimiento = ?, telefono = ?, direccion = ? WHERE id_perfil_demandante = ? ;'

    try {
        if (respuesta == 200){
            comprobarRegistro(nombreUsuario, correoElectronico, res, function(resultado) {
                if (resultado >= 1){
                    res.status(422)
                    res.json(mensajes.instruccionNoProcesada)
                }else{
                    actualizarUsuarioDemandante(req.body,req.params, res, function(actualizacionDemandante) {
                        if (error){
                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else{
                            mysqlConnection.query(queryThree, [nombre, fechaNacimiento, telefono, direccion, idperfilDemandante], (error, actualizacion) => {
                                if (error){
                                    res.status(500)
                                    res.json(mensajes.errorInterno)
                                }else if (actualizacion.length == 0){
                                    res.status(404)
                                    res.json(mensajes.peticionNoEncontrada)
                                }else{
                                    if (actualizacion['affectedRows'] == 1){

                                        const modificacionDemandante = {}

                                        modificacionDemandante['application/json'] = {
                                            'clave': actualizacionDemandante['application/json']['clave'],
                                            'correoElectronico': actualizacionDemandante['application/json']['correoElectronico'],
                                            'direccion': direccion,
                                            'fechaNacimiento': fechaNacimiento,
                                            'idPerfilUsuario': actualizacionDemandante['idPerfilUsuario'],
                                            'nombre': nombre,
                                            'nombreUsuario': actualizacionDemandante['nombreUsuario'],
                                            'telefono': telefono,
                                            'idPerfilAspirante': idperfilDemandante
                                        }

                                        res.status(200)
                                        res.json(modificacionDemandante['application/json'])
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
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
})

module.exports = path;