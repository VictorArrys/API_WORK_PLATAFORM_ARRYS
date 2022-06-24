const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.AspiranteDAO = class AspiranteDAO {
    static getAspirante(idAspirante, callback) {

    }

    static nombreAspirante(idAspirante, callback){
        var pool = mysqlConnection
    
        pool.query('SELECT nombre FROM perfil_aspirante WHERE id_perfil_aspirante = ?;',[idAspirante] , (error, resultadoNombreAspirante)=>{
            if(error){
                callback(500, mensajes.errorInterno)
    
            }else if(resultadoNombreAspirante.length == 0){
                         
                console.log('No existe la contratación')
                callback(404, mensajes.peticionNoEncontrada)
    
            }else{ //En caso de existir la contratación solo agregamos el aspirante a ella
                console.log(resultadoNombreAspirante[0]['nombre'])
                callback(200, resultadoNombreAspirante[0]['nombre'])
                
            }
    
        });  
    
    }

}