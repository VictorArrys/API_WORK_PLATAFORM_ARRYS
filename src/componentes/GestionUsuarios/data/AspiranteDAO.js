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
                        aspirante.idPerfilAspirante = elemento['id_perfil_aspirante']
                        aspirante.direccion = elemento['direccion']
                        aspirante.fechaNacimiento = elemento['fecha_nacimiento']
                        aspirante.nombre = elemento['nombre']
                        aspirante.telefono = elemento['telefono']
                        aspirante.idPerfilUsuario = elemento['id_perfil_usuario_aspirante']
                        OficioDAO.getOficios(aspirante.idPerfilAspirante, (errorOficios, resultadoOficios)=> {
                            if(errorOficios) {
                                callback(errorOficios)
                            } else {
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