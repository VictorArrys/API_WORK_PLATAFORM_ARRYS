const { Aspirante } = require('../modelo/Empleador')
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.EmpleadorDAO = class EmpleadorDAO {
    static getEmpleadores(callback) {
        var query = 'SELECT * FROM perfil_empleador;'
        
        mysqlConnection.query(query, (error, resultadoEmpleadores) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else{
                var cont = 0;
                var empleadores = []

                do{
                    empleadores.push(cont)

                    empleadores[cont] = {
                        'idPerfilEmpleador': resultadoEmpleadores[cont]['id_perfil_empleador'],
                        'idPerfilUsuarioEmpleador': resultadoEmpleadores[cont]['id_perfil_usuario_empleador'],
                        'nombreOrganizacion': resultadoEmpleadores[cont]['nombre_organizacion'],
                        'nombre': resultadoEmpleadores[cont]['nombre'],
                        'direccion': resultadoEmpleadores[cont]['direccion'],
                        'fechaNacimiento': resultadoEmpleadores[cont]['fecha_nacimiento'],
                        'telefono': resultadoEmpleadores[cont]['telefono'],
                        'amonestaciones': resultadoEmpleadores[cont]['amonestaciones']
                    }

                    cont ++
                }while(cont < resultadoEmpleadores.length)

                callback(200, empleadores)
            }
        })
    }

    static getEmpleador(idEmpleador, callback) {
        var query = 'SELECT * FROM perfil_empleador WHERE id_perfil_usuario_empleador = ?;'

        mysqlConnection.query(query, [idEmpleador], (error, resultadoEmpleador) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else{
                var empleador = resultadoEmpleador[0]
                var getEmpleador = {}

                getEmpleador['application/json'] = {
                    'idPerfilEmpleador': empleador['id_perfil_empleador'],
                    'idPerfilUsuarioEmpleador': empleador['id_perfil_usuario_empleador'],
                    'nombreOrganizacion': empleador['nombre_organizacion'],
                    'nombre': empleador['nombre'],
                    'direccion': empleador['direccion'],
                    'fechaNacimiento': empleador['fecha_nacimiento'],
                    'telefono': empleador['telefono'],
                    'amonestaciones': empleador['amonestaciones']
                }

                callback(200, getEmpleador['application/json'])
            }
        })
    }

    static postEmpleador(empleadorNuevo, callback) {

    }

    static putEmpleador(empleador, callback) {
        
    }

    static #getNuevoRegistro(idAspirante, callback){
        
    }
}