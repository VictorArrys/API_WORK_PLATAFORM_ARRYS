const {Demandante} = require('../modelo/Demandante')
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
const { UsuarioDAO } = require('./UsuarioDAO');

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
        var queryTwo = 'INSERT INTO perfil_demandante (id_perfil_usuario_demandante, nonbre, fecha_nacimiento, telefono, direccion) VALUES ( ?, ?, ?, ?, ?);'

        this.#comprobarRegistro(demandante.nombreUsuario, demandante.correoElectronico, function(codigoRespuesta, cuerpoRespuestaRegistrarDemandante) {
            if (codigoRespuesta == 500){
                callback(500, mensajes.errorInterno)
            }else if (cuerpoRespuestaRegistrarDemandante >= 1){
                callback(422, mensajes.instruccionNoProcesada)
            }else{
                UsuarioDAO.postUsuario(demandante, function(codigoRespuesta, cuerpoRespuesta){
                    if (codigoRespuesta == 500){
                        callback(500, mensajes.errorInterno)
                    }else if (codigoRespuesta == 404){
                        callback(404, mensajes.peticionNoEncontrada)
                    }else{
                        var idUsuario = 0
                        idUsuario = cuerpoRespuesta.idPerfilUsuario

                        mysqlConnection.query(queryTwo, [idUsuario, demandante.nombre, demandante.fechaNacimiento, demandante.telefono, demandante.direccion], (error, registroPerfilEmpleador) =>{
                            if (error){
                                callback(500, mensajes.errorInterno)
                            }else if (registroPerfilEmpleador.length == 0){
                                callback(404, mensajes.peticionNoEncontrada)
                            }else{
                                if (registroPerfilEmpleador['affectedRows'] == 1){
                                    
                                    var idDemandante = registroPerfilEmpleador.insertId
                                    const nuevoDemandante = {}
    
                                    nuevoDemandante['application/json'] = {
                                        'idPerfilUsuario': idUsuario,
                                        'idPerfilDemandante': idDemandante
                                    };
    
                                    callback(201, nuevoDemandante['application/json'])
                                }
                            }
                        })
                    }

                })
            }
        })
    }

    static putDemandante(demandante, callback) {
        var query = 'UPDATE perfil_demandante SET nonbre = ?, fecha_nacimiento = ?, telefono = ?, direccion = ? WHERE id_perfil_demandante = ? ;'

        UsuarioDAO.putUsuario(demandante, function(codigoRespuesta, cuerpoRespuesta){
            if (codigoRespuesta == 500){
                callback(500, mensajes.errorInterno)
            }else if (codigoRespuesta == 404){
                callback(404, mensajes.peticionNoEncontrada)
            }else{

                mysqlConnection.query(query, [demandante.nombre, demandante.fechaNacimiento, demandante.telefono, demandante.direccion, demandante.idPerfilDemandante], (error, actualizacionPerfilDemandante) =>{
                    if (error){
                        callback(500, mensajes.errorInterno)
                    }else if (actualizacionPerfilDemandante.length == 0){
                        callback(404, mensajes.peticionNoEncontrada)
                    }else{
                        const edicionDemandante = {}

                        edicionDemandante['application/json'] = {
                            'idPerfilUsuario': demandante.idPerfilUsuario,
                            'idPerfilDemandante': demandante.idPerfilDemandante
                        }

                        callback(200, edicionDemandante['application/json'])
                    }
                })
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
}