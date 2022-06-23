const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.EmpleadorDAO = class EmpleadorDAO {

    static obtenerIdEmpleador(solicitudEmpleo, callback){
        var pool = mysqlConnection
        pool.query('SELECT id_perfil_oe_empleador FROM oferta_empleo WHERE id_oferta_empleo= ?;',[solicitudEmpleo['id_oferta_empleo_sa']] , (error, resultadoOfertaEmpleo)=>{
            if(error){ 
                
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoOfertaEmpleo.length == 0){
                
                console.log('No se encontro la oferta de empleo')
                callback(404, mensajes.peticionNoEncontrada)
    
            }else{
    
                console.log(resultadoOfertaEmpleo[0]['id_perfil_oe_empleador'])
    
                callback(200, resultadoOfertaEmpleo[0]['id_perfil_oe_empleador'])
                
            }
    
        });   
    }

    
}