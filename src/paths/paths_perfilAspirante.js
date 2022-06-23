const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const ruta = require('path');
const multer = require('multer');
const { GestionUsuarios } = require('../componentes/GestionUsuarios/GestionUsuarios')
const GestionToken = require('../utils/GestionToken')
var fileSystem = require('fs');


//Respuestas
const mensajes = require('../../utils/mensajes');
const pool = require('../../utils/conexion');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { on } = require('events');
const { body } = require('express-validator');

function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
  
        if (tokenData["tipo"] == "Empleador" || tokenData['tipo'] == 'Administrador' || tokenData['tipo'] == 'Aspirante' || tokenData['tipo'] == 'Demandante') {
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

function ComprobarRegistro(nombreUsuario, correoElectronico, res, resultado){
    var queryOne = 'SELECT count(id_perfil_usuario) as Comprobacion FROM perfil_usuario WHERE nombre_usuario = ? OR  correo_electronico = ? ;'
    mysqlConnection.query(queryOne, [nombreUsuario, correoElectronico], (error, comprobacion) =>{
        if (error){
            console.log(error)
            res.status(500)
            res.json(mensajes.errorInterno)
        }else{
            resultado(comprobacion[0]['Comprobacion'])
        }
    })
}

function actualizarUsuarioAspirante(registroAspirante, res, callback){
    var queryOne = 'UPDATE perfil_usuario SET nombre_usuario = ?, clave = ?, correo_electronico = ? WHERE id_perfil_usuario = ?;'

    var idUsuario = registroAspirante['idPerfilUsuario']
    var nombre = registroAspirante['nombreUsuario']
    var clave = registroAspirante['clave']
    var correoElectronico = registroAspirante['correoElectronico']

    mysqlConnection.query(queryOne, [nombre, clave, correoElectronico, idUsuario], (error, actualizacion) =>{
        if (error){
            console.log(error)
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if (actualizacion.length == 0){
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
                    'nombreUsuario': nombre
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

function borrarOficios(idAspirtante, res, callback){
    var queryTwo = 'DELETE FROM categoria_aspirante WHERE id_aspirante_ca = ?;'
    var resultado = false
    mysqlConnection.query(queryTwo, [idAspirtante], (error, suprimir) =>{
        if (error){
            console.log(error)
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if (suprimir.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            resultado = true
            console.log('elimino con éxito')
            callback(resultado)
        }
    })
}

function registrarUsuarioAspirante(datoAspirante, res, callback){
    var queryTwo = 'INSERT INTO perfil_usuario (nombre_usuario, estatus, clave, correo_electronico, tipo_usuario) VALUES (?, ?, ?, ?, ?);'

    var nombreU = datoAspirante['nombreUsuario']
    var estatus = datoAspirante['estatus']
    var clave = datoAspirante['clave']
    var correoElectronico = datoAspirante['correoElectronico']
    var tipo = 'Aspirante'

    mysqlConnection.query(queryTwo, [nombreU, estatus, clave, correoElectronico, tipo], (error, registro) =>{
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
            }
        }
    })

}

const multerUpload = multer({storage:multer.memoryStorage(), limits:{fileSize:8*1024*1024*3}})

path.patch('/v1/perfilAspirantes/:idPerfilAspirante/video', multerUpload.single('video'), (req, res) => {
    var query = "UPDATE perfil_aspirante SET video = ? WHERE id_perfil_aspirante = ?;"
    const { idPerfilAspirante } = req.params


    try{
        mysqlConnection.query(query, [req.file.buffer, idPerfilAspirante], (error, resultadoVideo) => {
            if (error){
                console.log(error)
                res.status(500)
                res.json(mensajes.errorInterno)
            }else if(resultadoVideo.length == 0){
                //
            }else{
                console.log(resultadoVideo)
                res.status(200)
                res.json(mensajes.actualizacionExitosa)
            }
        })
    }catch (error){
        console.log(error)
    }
    
    
});


path.get('/v1/perfilAspirantes/:idPerfilAspirante/video', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = GestionToken.ValidarToken(token)
    var query = 'SELECT video FROM perfil_aspirante WHERE id_perfil_aspirante = ?'
    const { idPerfilAspirante } = req.params

    mysqlConnection.query(query, [idPerfilAspirante], (error, video) =>{
        if (error){
            console.log('error de consulta')
        }else if (video.length == 0){
            console.log('no encontrado')
        }else{
            var arrayVideo = null
            arrayVideo = Uint8Array.from(Buffer.from(video[0]['video'].buffer, 'base64'))
            var rutaVideo = __dirname+ruta.sep+'video'+idPerfilAspirante+'.mp4'
            var stream = fileSystem.createWriteStream(rutaVideo, {
                flags: "w"
            })
            stream.write(arrayVideo)
            stream.on('finish', function(){

                console.log(fileSystem.existsSync(rutaVideo))
                

                res.status(200)
                res.sendFile(rutaVideo, function(error){
                    if (error){
                        console.log(error)
                    }else{
                        fileSystem.unlink(rutaVideo, (error) => {
                            if (error){
                                console.log(error)
                            }else{
                                console.log('archivo eliminado')
                            }
                        })
                    }
                })
            })

            stream.end('end')
            
        }
    })
})

function agregarOficiosAspirante(datoAspirante, callback){
    getOficios(datoAspirante['id_perfil_aspirante'], function(arregloOficios) {
        var nuevoAspirante = {
            'direccion': datoAspirante['direccion'],
            'fechaNacimiento': datoAspirante['fecha_nacimiento'],
            'idPerfilAspirante': datoAspirante['id_perfil_aspirante'],
            'nombre': datoAspirante['nombre'],
            'idPerfilusuario': datoAspirante['id_perfil_usuario_aspirante'],
            'oficios': arregloOficios,
            'telefono': datoAspirante['telefono']
        };
        
        callback(nuevoAspirante)
    })
}

function getOficios(id, callback){ 
    var query = 'SELECT * FROM categoria_aspirante where id_aspirante_ca = ?;'
    mysqlConnection.query(query, [id], (error, resultadoOficios) => {
        if (error){
            res.status(500)
            res.json(mensajes.errorInterno)
        }else{
            var arreglo = []
            for (var i = 0; i < resultadoOficios.length; i++){
                arreglo.push(i)
                arreglo[i] = {
                    'idAspirante': resultadoOficios[i]['id_aspirante_ca'],
                    'idCategoria': resultadoOficios[i]['id_categoria_ca'],
                    'experiencia': resultadoOficios[i]['experiencia']
                }
            }
            callback(arreglo)
        }
    })
}

function getAspirante(datoAspirante, callback){
    getOficios(datoAspirante, function(arregloOficios) {
        var registroAspirante = {
            'direccion': datoAspirante['direccion'],
            'fechaNacimiento': datoAspirante['fecha_nacimiento'],
            'idPerfilAspirante': datoAspirante['id_perfil_aspirante'],
            'nombre': datoAspirante['nombre'],
            'idPerfilusuario': datoAspirante['id_perfil_usuario_aspirante'],
            'oficios': arregloOficios,
            'telefono': datoAspirante['telefono']
        };
        
        callback(registroAspirante)
    })
}

path.get('/v1/perfilAspirantes', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = GestionToken.ValidarToken(token)
    var query = 'SELECT * FROM perfil_aspirante;'
    try {
        if (respuesta.statusCode == 200){
            GestionUsuarios.getAspirantes(function(codigoRespuesta, cuerpoRespuesta){
                res.status(codigoRespuesta);
                res.json(cuerpoRespuesta);
            })
        }else if (respuesta.statusCode == 401){
            res.status(401);
            res.json(mensajes.tokenInvalido);
        }
    }catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
})



path.get('/v1/perfilAspirantes/:idPerfilUsuarioAspirante', (req, res) => {
    const token = req.headers['x-access-token'];
    const { idPerfilUsuarioAspirante } = req.params;
    var validacionToken = GestionToken.ValidarToken(token);

    if ( validacionToken.statusCode == 200) {
        var query = 'SELECT * FROM perfil_aspirante WHERE id_perfil_usuario_aspirante = ?;'
        mysqlConnection.query(query, [idPerfilUsuarioAspirante], (error, resultadoAspirante) =>{
            if (error){
                console.log(error)
            }else{
                
                const aspirante = {}
                var arregloOficios = []
                var getAspirante = resultadoAspirante[0]
                console.log(resultadoAspirante[0]['id_perfil_aspirante'])

                getOficios(resultadoAspirante[0]['id_perfil_aspirante'], function(oficios){
                    aspirante['application/json'] = {
        
                        'direccion': getAspirante['direccion'],
                        'fechaNacimiento': getAspirante['fecha_nacimiento'],
                        'idPerfilAspirante': getAspirante['id_perfil_aspirante'],
                        'nombre': getAspirante['nombre'],
                        'idPerfilUsuario': getAspirante['id_perfil_usuario_aspirante'],
                        'oficios': oficios,
                        'telefono': getAspirante['telefono']
                    }
        
                    res.status(200)
                    res.json(aspirante['application/json'])
                })
            }
        })
        const aspirante = {}
        var arregloOficios = []
    } else {
        res.status(401)
        res.json(mensajes.tokenInvalido)
    }
})

path.post('/v1/perfilAspirantes', (req, res) => {
    var idDeUsuario = 0
    const {clave, correoElectronico, direccion, estatus, fechaNacimiento, nombre, nombreUsuario, oficios, telefono } = req.body
    var queryThree = 'INSERT INTO perfil_aspirante ( id_perfil_usuario_aspirante, nombre, direccion, fecha_nacimiento, telefono) VALUES (?, ?, ?, ?, ?); '
    var queryFour = 'INSERT INTO categoria_aspirante (id_aspirante_ca, id_categoria_ca, experiencia) VALUES ? ;'
    
    try {
        ComprobarRegistro(nombreUsuario, correoElectronico, res, function(resultado) {
            if (resultado >= 1){
                res.status(422)
                res.json(mensajes.instruccionNoProcesada)
            }else{
                registrarUsuarioAspirante(req.body, res, function(registroUAspirante){
                    if (res.error){
                        console.log(res.error)
                        res.status(500)
                        res.json(mensajes.errorInterno)
                    }else{
                        var idDeUsuario = 0;
                        idDeUsuario = registroUAspirante['application/json']['idPerfilUsuario']

                        mysqlConnection.query(queryThree, [idDeUsuario, nombre, direccion, fechaNacimiento, telefono], (error, registroPerfil) =>{
                            if (error){
                                console.log(error)
                                res.status(500)
                                res.json(mensajes.errorInterno)
                            }else if (registroPerfil.length == 0){
                                console.log('404 perfil')
                                res.status(404)
                                res.json(mensajes.peticionNoEncontrada)
                            }else{
                                var idPerfil = registroPerfil.insertId

                                var cont = 0

                                var valores = []

                                for(var i = 0; i < oficios.length; i++){
                                    valores.push(i)
                                }

                                do{
                                    valores[cont] = [idPerfil, oficios[cont].idCategoria, oficios[cont].experiencia]
                                    cont ++
                                }while(cont < oficios.length)

                                mysqlConnection.query(queryFour, [valores], (error, registroOficios) =>{
                                    if (error){
                                        console.log(error)
                                        res.status(500)
                                        res.json(mensajes.errorInterno)
                                    }else if(registroOficios.length == 0){
                                        res.status(404)
                                        res.json(mensajes.prohibido)
                                    }else{
                                        if (registroPerfil['affectedRows'] == 1){
                                            const edicionAspirante = {}

                                            nuevoEmpleador['application/json'] ={
                                                'idPerfilUsuario': registroUAspirante['application/json']['idPerfilUsuario'],
                                                'idPerfilAspirante': idPerfil
                                            }

                                            res.status(200)
                                            res.json(nuev['application/json'])
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }



});

path.put('/v1/perfilAspirantes/:idPerfilAspirante', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante")
    const { idPerfilAspirante } = req.params
    const {clave, correoElectronico, direccion, estatus, fechaNacimiento, idPerfilUsuario, nombre, nombreUsuario, telefono,
        oficios } = req.body
    var queryThree = 'UPDATE perfil_aspirante SET nombre = ?, direccion = ?, fecha_nacimiento = ?, telefono = ? WHERE id_perfil_aspirante = ?;'
    var queryFour = 'INSERT INTO categoria_aspirante (id_aspirante_ca, id_categoria_ca, experiencia) VALUES ? ;'
    
    try {
        if (respuesta.statusCode == 200){
            actualizarUsuarioAspirante(req.body, res, function(actualizacionAspirante){
                if (res.error){
                    consoleError(error, 'Funcion: actualizar usuario. Paso: error al actualizar usuario aspirante')

                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else{
                    borrarOficios(idPerfilAspirante, res, function(resultado) {
                        if (res.error){
                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else{

                            console.log(idPerfilAspirante)
                            mysqlConnection.query(queryThree, [nombre, direccion, fechaNacimiento, telefono, idPerfilAspirante], (error, actualizacionPerfil) => {
                                if (error){
                                    consoleError(error, 'Funcion: actualizar aspirante. Paso: error al actualizar perfil aspirante')

                                    res.status(500)
                                    res.json(mensajes.errorInterno)
                                }else if (actualizacionPerfil.length == 0){
                                    console.log('no encuentra en aspirante')
                                    res.status(404)
                                    res.json(mensajes.peticionNoEncontrada)
                                }else{
                                    var cont = 0

                                    var valores = []

                                    for (var i = 0; i < oficios.length; i++){
                                        valores.push(i)
                                    }

                                    do{
                                        valores[cont] = [idPerfilAspirante, oficios[cont].idCategoria, oficios[cont].experiencia]
                                        cont ++
                                    }while(cont < oficios.length)

                                    mysqlConnection.query(queryFour, [valores], (error, actualizaroficios) =>{
                                        if (error){
                                            console.log(error)
                                            res.status(500)
                                            res.json(mensajes.errorInterno)
                                        }else if (actualizaroficios.length == 0){
                                            console.log('no encuentra en oficios')
                                            res.status(404)
                                            res.json(mensajes.peticionNoEncontrada)
                                        }else{
                                            if (actualizacionPerfil['affectedRows'] >= 0){
                                                const edicionAspirante = {}
    
                                                edicionAspirante['application/json'] ={
                                                    'idPerfilUsuario': idPerfilUsuario,
                                                    'idPerfilAspirante': idPerfilAspirante
                                                }
    
                                                res.status(200)
                                                res.json(edicionAspirante['application/json'])
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }else if (respuesta.statusCode == 401){
            res.status(respuesta.statusCode)
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