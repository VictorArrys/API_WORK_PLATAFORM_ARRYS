const {Aspirante} = require('../modelo/Aspirante');
const {OficioDAO} = require('./OficioDAO');
const {UsuarioDAO} = require('./UsuarioDAO')

var mysqlConnection = require('../../../../utils/conexion');

exports.AspiranteDAO = class AspiranteDAO {
    static getAspirantes(callback) {
        var query = 'SELECT * FROM perfil_aspirante;';
        mysqlConnection.query(query, (error, resultadoConsulta) => {
            if(error) {
                callback(error);
            } else {
                var listaAspirantes = [];
                resultadoConsulta.forEach(elemento => {
                    var aspirante = new Aspirante();
                    aspirante.idPerfilAspirante = elemento['id_perfil_aspirante'];
                    //Faltan datos
                    OficioDAO.getOficios(aspirante.idPerfilAspirante, (errorOficios, resultadoOficios)=> {
                        if(errorOficios) {
                            callback(errorOficios);
                        } else {
                            //resultadoOficios es un arreglo de <<Oficio>>
                            aspirante.oficios = resultadoOficios;
                            listaAspirantes.push(aspirante);
                            if (listaAspirantes.length == resultadoConsulta.length) {
                                callback(null, listaAspirantes);
                            }
                        }
                    });
                });
            }
        });
    }

    static getAspirante(idUsuario, callback) {

    }

    static getVideoAspirante(idAspirante, callback) {
        
    }

    static postAspirante(aspiranteNuevo, callback) {
        UsuarioDAO.postUsuario(aspiranteNuevo, (error, idUsuario) => {
            //mysql.query
                //if error

                //else
                    //Registrar aspirante
        })
    }

    static putAspirante(aspirante, callback) {

    }
}