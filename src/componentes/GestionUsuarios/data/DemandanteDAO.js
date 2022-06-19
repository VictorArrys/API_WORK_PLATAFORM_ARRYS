const {Demandante} = require('../modelo/Demandante')
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.DemandanteDAO = class DemandanteDAO {
    static getDemandantes(callback) {
        var query = 'SELECT * FROM perfil_demandante;'

        mysqlConnection.query(query, (error, resultadoDemandantes) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else{
                var cont = 0;
                var demandantes = []

                do{
                    demandantes.push(cont)

                    demandantes[cont] = {
                        'direccion': resultadoDemandantes[cont]['direccion'],
                        'fechaNacimiento': resultadoDemandantes[cont]['fecha_nacimiento'],
                        'nombre': resultadoDemandantes[cont]['nonbre'],
                        'telefono': resultadoDemandantes[cont]['telefono'],
                        'idperfilDemandante': resultadoDemandantes[cont]['id_perfil_demandante']
                    }
                    cont ++
                }while(cont < resultadoDemandantes.length)

                callback(200, demandantes)
            }
        })
    }

    static getDemandante(idUsuario, callback) {
        var query = 'SELECT * FROM perfil_demandante WHERE id_perfil_usuario_demandante = ?;'

        mysqlConnection.query(query, [idUsuario], (error, resultadoDemandante) => {
            if (error){
                callback(500, mensajes.errorInterno)
            }else{
                var getdemandante = resultadoDemandante[0]

                const demandante = {}
                demandante['application/json'] = {
                    'direccion': getdemandante['direccion'],
                    'fechaNacimiento': getdemandante['fecha_nacimiento'],
                    'nombre': getdemandante['nonbre'],
                    'telefono': getdemandante['telefono'],
                    'idperfilDemandante': getdemandante['id_perfil_demandante']
                };

                callback(200, demandante['application/json'])

            }
        })
    }

    static postDemandante(demandante, callback) {
        
    }

    static putDemandante(demandante, callback) {
        
    }

    static #getNuevoRegistro(idAspirante, callback){
        
    }
}