const { Administrador } = require('../modelo/Administrador')
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.AdministradorDAO = class AdministradorDAO {
    static getAdministradores(callback) {
        var query = 'SELECT * FROM perfil_administrador;'

        mysqlConnection.query(query, (error, resultadoAdministradores) =>{
            if (error){
                callback(500, mensajes.errorInterno)
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
                }while(cont < resultadoAdministradores.length)

                callback(200, administradores)
            }
        })
    }

    static getAdministrador(idUsuario, callback) {
        var query = 'SELECT * FROM perfil_administrador WHERE id_perfil_usuario_admin = ?;'

        mysqlConnection.query(query, [idUsuario], (error, resultadoAdministrador) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else{
                callback(200, resultadoAdministrador[0])
            }
        })
    }

    static putAdministrador(administrador, callback) {
        
    }
}