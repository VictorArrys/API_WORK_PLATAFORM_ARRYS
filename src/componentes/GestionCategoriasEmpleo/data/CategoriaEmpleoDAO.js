const { CategoriaEmpleo } = require('../modelo/CategoriaEmpleo')
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.CategoriaEmpleoDAO = class CategoriaEmpleoDAO{
    static getCategoriasEmpleo(callback) {
        var query = 'SELECT * FROM categoria_empleo'

        mysqlConnection.query(query, (error, resultadoCategorias) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else{
                var cont = 0;
                var categorias = []
                
                do{
                    categorias[cont] = {
                        'idCategoriaEmpleo': resultadoCategorias[cont]['id_categoria_empleo'],
                        'nombre': resultadoCategorias[cont]['nombre']
                    }
                    cont ++
                }while(cont < resultadoCategorias.length)

                callback(200, categorias)
            }
        })
    }
    static postCategoriaEmpleo(nombre, callback) {
        
    }

    static patchCategoriaEmpleo(idCategoriaEmpleo, nombre, callback) {
        
    }

    static deleteCategoriaEmpleo(idCategoriaEmpleo, callback) {
        var query = 'DELETE FROM categoria_empleo WHERE id_categoria_empleo = ?;'

        mysqlConnection.query(query, [idCategoriaEmpleo], (error, eliminarCategoria) => {
            if (error){
                callback(500, error)
            }else{
                callback(204, eliminarCategoria)
            }
        })
    }
}