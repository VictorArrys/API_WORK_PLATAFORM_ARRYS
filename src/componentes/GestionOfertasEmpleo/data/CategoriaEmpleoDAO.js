var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
const MostrarError = require('../../../utils/MensajesConsolaAPI');

exports.CategoriaEmpleoDAO = class CategoriaEmpleoDAO {
    static getCategoriaEmpleo(idCategoriaEmpleo, callback){
        try {
            var query = 'SELECT id_categoria_empleo, nombre as categoria FROM categoria_empleo WHERE id_categoria_empleo = ?'
            var pool = mysqlConnection
    
            pool.query(query,[idCategoriaEmpleo], (error, resultadoCategoria) => {
                if(error){
                    MostrarError.MostrarError(error, "metodo getCategoriaEmpleo en CategoriaEmpleoDAO de GestionOfertasEmpleo")
                    callback(500, mensajes.errorInterno)
                    
                }else if (resultadoCategoria.length == 0){
                    callback(404, mensajes.peticionNoEncontrada)

                    }else{
                
                    callback(200, resultadoCategoria[0]['categoria'])
                }
            })
        } catch (error) {

            callback(500, mensajes.errorInterno)
        }
    
    }
} 