const {Aspirante} = require('../modelo/Aspirante');
const {OficioDAO} = require('./OficioDAO');
const {UsuarioDAO} = require('./UsuarioDAO');
const { Usuario } = require('../modelo/Usuario');

var mysqlConnection = require('../../../../utils/conexion');

var mensajes = require('../../../../utils/mensajes');
const { sendfile } = require('express/lib/response');
var fileSystem = require('fs');
const ruta = require('path');


exports.AspiranteDAO = class AspiranteDAO {
    static getAspirantes(callback) {
        var query = 'SELECT * FROM perfil_aspirante;';
        mysqlConnection.query(query, (error, resultadoConsulta) => {
            if(error) {
                callback(500, mensajes.errorInterno);
            } else {
                var listaAspirantes = [];
                if (resultadoConsulta.length == 0) {
                    callback(200, []);
                } else {
                    resultadoConsulta.forEach(elemento => {
                        var aspirante = new Aspirante();
                        aspirante.idPerfilAspirante = elemento['id_perfil_aspirante']
                        aspirante.direccion = elemento['direccion']
                        aspirante.fechaNacimiento = elemento['fecha_nacimiento']
                        aspirante.nombre = elemento['nombre']
                        aspirante.telefono = elemento['telefono']
                        aspirante.idPerfilUsuario = elemento['id_perfil_usuario_aspirante']
                        OficioDAO.getOficios(aspirante.idPerfilAspirante, (codigoRespuesta, resultadoOficios)=> {
                            if(codigoRespuesta == 500) {
                                callback(500, mensajes.errorInterno);
                            } else if (codigoRespuesta == 200) {
                                aspirante.oficios = resultadoOficios;
                                listaAspirantes.push(aspirante);
                                if (listaAspirantes.length == resultadoConsulta.length) {
                                    callback(200, listaAspirantes);
                                }
                            }
                        });
                    });
                }

            }
        });
    }

    static getAspirante(idUsuario, callback) {
        var query = 'SELECT * FROM perfil_aspirante WHERE id_perfil_usuario_aspirante = ?;'

        mysqlConnection.query(query, [idUsuario], (error, resultadoAspirante) =>{
            const aspirante = {}
            var arregloOficios = []
            var getAspirante = resultadoAspirante[0]

            this.#getOficios(getAspirante.id_perfil_aspirante, function(codigoRespuesta, oficios) {
                if (codigoRespuesta == 500){
                    callback(500, mensajes.errorInterno)
                } else {
                    aspirante['application/json'] = {
                        'direccion': getAspirante['direccion'],
                        'fechaNacimiento': getAspirante['fecha_nacimiento'],
                        'idPerfilAspirante': getAspirante['id_perfil_aspirante'],
                        'nombre': getAspirante['nombre'],
                        'idPerfilUsuario': getAspirante['id_perfil_usuario_aspirante'],
                        'oficios': oficios,
                        'telefono': getAspirante['telefono']
                    }
    
                    callback(200, aspirante['application/json'])
                }

                
            })
        })
    }

    static getVideoAspirante(idAspirante, callback){
        var query = 'SELECT video FROM perfil_aspirante WHERE id_perfil_aspirante = ?'

        mysqlConnection.query(query, [idAspirante], (error, video) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else if (video.length == 0){
                callback(404, mensajes.peticionNoEncontrada)
            }else if (video[0].video == null){
                callback(404, mensajes.peticionNoEncontrada)
            }else{
                var arrayVideo = null
                arrayVideo = Uint8Array.from(Buffer.from(video[0]['video'].buffer, 'base64'))
                var rutaVideo = __dirname+ruta.sep+'video'+idAspirante+'.mp4'
                var stream = fileSystem.createWriteStream(rutaVideo, {
                    flags: "w"
                })
                stream.write(arrayVideo)
                stream.on('finish', function(){
    
                    callback(200, rutaVideo)
                })

                stream.end('end')
            }
        })
    }

    static patchVideoAspirante(video, idAspirante, callback){
        var query = "UPDATE perfil_aspirante SET video = ? WHERE id_perfil_aspirante = ?;"

        mysqlConnection.query(query, [video, idAspirante], (error, resultadoVideo) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else if(resultadoVideo.length == 0){
                callback(404, mensajes.peticionNoEncontrada)
            }else{
                callback(200, mensajes.actualizacionExitosa)
            }
        })
    }

    static postAspirante(aspiranteNuevo, callback) {
        var queryTwo = 'INSERT INTO perfil_aspirante ( id_perfil_usuario_aspirante, nombre, direccion, fecha_nacimiento, telefono) VALUES (?, ?, ?, ?, ?); '
        var queryThree = 'INSERT INTO categoria_aspirante (id_aspirante_ca, id_categoria_ca, experiencia) VALUES ? ;'

        this.#comprobarRegistro(aspiranteNuevo.nombreUsuario, aspiranteNuevo.correoElectronico, function(codigoRespuesta, cuerpoRespuestaComprobacion){
            if (codigoRespuesta == 500){
                callback(500, mensajes.errorInterno)
            }else if (cuerpoRespuestaComprobacion >= 1){
                callback(422, mensajes.instruccionNoProcesada)
            }else{
                UsuarioDAO.postUsuario(aspiranteNuevo, function(codigoRespuesta, cuerpoRespuesta) {
                    if (codigoRespuesta == 500){
                        callback(500, mensajes.errorInterno)
                    }else if (codigoRespuesta == 404){
                        callback(404, mensajes.peticionNoEncontrada)
                    }else{
                        var idUsuario = 0
                        
                        idUsuario = cuerpoRespuesta.idPerfilUsuario

                        mysqlConnection.query(queryTwo, [idUsuario, aspiranteNuevo.nombre, aspiranteNuevo.direccion, aspiranteNuevo.fechaNacimiento, aspiranteNuevo.telefono], (error, registroPerfilAspirante) =>{
                            if (error){
                                callback(500, mensajes.errorInterno)
                            }else if (registroPerfilAspirante.length == 0){
                                callback(404, mensajes.peticionNoEncontrada)
                            }else{
                                var idPerfil = registroPerfilAspirante.insertId

                                var cont = 0
                                var valores = []

                                for(var i = 0; i < aspiranteNuevo.oficios.length; i++){
                                    valores.push(i)
                                }

                                do{
                                    valores[cont] = [idPerfil, aspiranteNuevo.oficios[cont].idCategoria, aspiranteNuevo.oficios[cont].experiencia]
                                    cont ++
                                }while(cont < aspiranteNuevo.oficios.length)

                                mysqlConnection.query(queryThree, [valores], (error, registroOficios) =>{
                                    if (error){
                                        callback(500, mensajes.errorInterno)
                                    }else if (registroOficios.length == 0){
                                        callback(404, mensajes.peticionNoEncontrada)
                                    }else{
                                        if (registroPerfilAspirante['affectedRows'] == 1){
                                            const nuevoAspirante = {}

                                            nuevoAspirante['application/json'] ={
                                                'idPerfilUsuario': idUsuario,
                                                'idPerfilAspirante': idPerfil
                                            }
                                            
                                            callback(201, nuevoAspirante['application/json'])
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        
    }

    static putAspirante(aspirante, callback) {
        var queryTwo = 'UPDATE perfil_aspirante SET nombre = ?, direccion = ?, fecha_nacimiento = ?, telefono = ? WHERE id_perfil_aspirante = ?;'
        var queryThree = 'INSERT INTO categoria_aspirante (id_aspirante_ca, id_categoria_ca, experiencia) VALUES ? ;'

        UsuarioDAO.putUsuario(aspirante, function(codigoRespuesta, cuerpoRespuesta){
            if (codigoRespuesta == 500){
                callback(500, mensajes.errorInterno)
            }else if (codigoRespuesta == 404){
                callback(404, mensajes.peticionIncorrecta)
            }else{
                AspiranteDAO.#borrarOficios(aspirante.idPerfilAspirante, function(codigoRespuesta, cuerpoRespuesta){
                    if (codigoRespuesta == 500){
                        callback(500, mensajes.errorInterno)
                    }else if (codigoRespuesta == 200){
                        mysqlConnection.query(queryTwo, [aspirante.nombre, aspirante.direccion, aspirante.fechaNacimiento, aspirante.telefono, aspirante.idPerfilAspirante], (error, actualizacionPerfilAspirante) =>{
                            if (error){
                                callback(500, mensajes.errorInterno)
                            }else if (actualizacionPerfilAspirante.length == 0){
                                callback(404, mensajes.peticionNoEncontrada)
                            }else{
                                var cont = 0
                                var valores = []

                                for(var i = 0; i < aspirante.oficios.length; i++){
                                    valores.push(i)
                                }

                                do{
                                    valores[cont] = [aspirante.idPerfilAspirante, aspirante.oficios[cont].idCategoria, aspirante.oficios[cont].experiencia]
                                    cont ++
                                }while(cont < aspirante.oficios.length)

                                mysqlConnection.query(queryThree, [valores], (error, registroOficios) =>{
                                    if (error){
                                        callback(500, mensajes.errorInterno)
                                    }else if (registroOficios.length == 0){
                                        callback(404, mensajes.peticionNoEncontrada)
                                    }else{
                                        const edicionAspirante = {}

                                        edicionAspirante['application/json'] ={
                                            'idPerfilUsuario': aspirante.idPerfilUsuario,
                                            'idPerfilAspirante': aspirante.idPerfilAspirante
                                        }
                                            
                                        callback(200, edicionAspirante['application/json'])
                                    }
                                })
                            }
                        })
                    }
                })
            }
            
        })
    }

    static #getOficios(idAspirante, callback){
        var query = 'SELECT * FROM categoria_aspirante where id_aspirante_ca = ?;'
        
        mysqlConnection.query(query, [idAspirante], (error, resultadoOficios) => {
            if (error){
                callback(500)
            }else if (resultadoOficios.length == 0){
                callback(200,[])
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
                callback(200,arreglo)
            }
        })
    }

    static #comprobarRegistro(nombreUsuario, correoElectronico, callback){
        var queryOne = 'SELECT count(id_perfil_usuario) as Comprobacion FROM perfil_usuario WHERE nombre_usuario = ? OR  correo_electronico = ? ;'
        mysqlConnection.query(queryOne, [nombreUsuario, correoElectronico], (error, comprobacion) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else{
                callback(200, comprobacion[0]['Comprobacion'])
            }
        })
    }

    static #borrarOficios(idAspirante, callback){
        var queryOne = 'DELETE FROM categoria_aspirante WHERE id_aspirante_ca = ?;'

        mysqlConnection.query(queryOne, [idAspirante], (error, suprimirOficios) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else{
                callback(200, mensajes.actualizacionExitosa)
            }
        })
    }
    
}
