const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
//dataType


exports.EmpleadorDAO = class EmpleadorDAO {
    static amonestarEmpleador(idEmpleador, callback){
        var pool = mysqlConnection
        pool.query('SELECT amonestaciones FROM perfil_empleador WHERE id_perfil_empleador = ?;',[idEmpleador] , (error, amonestarEmpleador)=>{
            if(error){
                console.log(error)
                callback(500, mensajes.errorInterno)
    
            }else if(amonestarEmpleador[0]['amonestaciones'] == 3){
                console.log('Este empleador cuenta con el maximo de amonestaciones ya')
                callback(403, mensajes.prohibido)
    
            }else{
    
                mysqlConnection.query('UPDATE perfil_empleador SET amonestaciones = amonestaciones + 1 WHERE id_perfil_empleador = ?',[idEmpleador] , (error, resultadoAmonestar)=>{
                    if(error){
                        console.log(error)
                        callback(500, mensajes.errorInterno)
            
                    }else if(resultadoAmonestar.length == 0){
            
                        callback(404, mensajes.peticionNoEncontrada)
            
                    }else{
                        console.log(resultadoAmonestar)
                        callback(200, resultadoAmonestar['changedRows'])
            
                    }
                })
    
            }
    
        })
    
    }


}
