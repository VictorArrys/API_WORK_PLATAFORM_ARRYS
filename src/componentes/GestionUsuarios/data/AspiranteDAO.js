const {Aspirante} = require('../modelo/Aspirante');
const {OficioDAO} = require('./OficioDAO');
const {UsuarioDAO} = require('./UsuarioDAO')

var mysqlConnection = require('../../../../utils/conexion');

var mensajes = require('../../../../utils/mensajes');

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
                        aspirante.idPerfilAspirante = elemento['id_perfil_aspirante'];
                        aspirante.direccion = elemento['direccion'];
                        aspirante.fechaNacimiento = elemento['fecha_nacimiento'];
                        aspirante.nombre = elemento['nombre'];
                        aspirante.telefono = elemento['telefono'];
                        OficioDAO.getOficios(aspirante.idPerfilAspirante, (errorOficios, resultadoOficios)=> {
                            if(errorOficios) {
                                callback(errorOficios);
                            } else {
                                //resultadoOficios es un arreglo de <<Oficio>>
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
        mysqlConnection.query(query, [idUsuario], (error, resultadoConsulta) => {
            if (error) {
                callback(500, mensajes.errorInterno);
            } else {
                if (resultadoConsulta.length == 0) {
                    callback(404, mensajes.peticionNoEncontrada);
                } else {
                    var perfilAspirante = new Aspirante();
                    perfilAspirante.direccion = resultadoConsulta[0]['direccion'];
                    perfilAspirante.fechaNacimiento = resultadoConsulta[0]['fecha_nacimiento'];
                    perfilAspirante.idPerfilAspirante = resultadoConsulta[0]['id_perfil_aspirante'];
                    perfilAspirante.nombre = resultadoConsulta[0]['nombre'];
                    perfilAspirante.idPerfilUsuario = resultadoConsulta[0]['id_perfil_usuario_aspirante'];
                    perfilAspirante.telefono = resultadoConsulta[0]['telefono'];

                    callback(200, perfilAspirante);
                }

                /*aspirante['application/json'] = {
                        'direccion': getAspirante['direccion'],
                        'fechaNacimiento': getAspirante['fecha_nacimiento'],
                        'idPerfilAspirante': getAspirante['id_perfil_aspirante'],
                        'nombre': getAspirante['nombre'],
                        'idPerfilUsuario': getAspirante['id_perfil_usuario_aspirante'],
                        'telefono': getAspirante['telefono'],
                        //'video': arrayVideo
                    }*/
            }
        });
    }

    static getVideoAspirante(idAspirante, callback) {
        
    }

    static postAspirante(aspiranteNuevo, callback) {
        UsuarioDAO.postUsuario(aspiranteNuevo, (codigoRespuesta, cuerpoRespuestaUsuario) => {
            if(codigoRespuesta == 201) {
                mysqlConnection.query('',[], (error, resuldadoRegistro)=>{
                    if (error) {
                        callback(500, mensajes.errorInterno);
                    } else {
                        AspiranteDAO.#getNuevoRegistro(resuldadoRegistro.insertId, callback);
                    }
                })
            } else {

            }
        })
    }

    static putAspirante(aspirante, callback) {

    }

    static #getNuevoRegistro(idAspirante, callback){
        
    }
}