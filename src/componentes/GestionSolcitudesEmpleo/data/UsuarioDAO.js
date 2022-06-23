const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.UsuarioDAO = class UsuarioDAO {

    static obtenerIdUsuarioAspirante(idAspirante, callback){
        var pool = mysqlConnection
        pool.query('SELECT id_perfil_usuario_aspirante FROM perfil_aspirante WHERE id_perfil_aspirante= ?;',[idAspirante] , (error, resultadoIdUsuario)=>{
            if(error){ 
                
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoIdUsuario.length == 0){
                
                console.log('No se encontro el id del aspirante')
                callback(404, mensajes.peticionNoEncontrada)
    
            }else{
    
                console.log(resultadoIdUsuario[0])
    
                callback(200, resultadoIdUsuario[0]['id_perfil_usuario_aspirante'])
                
            }
    
        });   
    }
}