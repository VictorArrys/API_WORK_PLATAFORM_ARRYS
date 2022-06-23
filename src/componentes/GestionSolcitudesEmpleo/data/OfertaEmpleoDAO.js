const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.OfertaEmpleoDAO = class OfertaEmpleoDAO {

    static reducirVacante(idOfertaEmpleo, callback){

        var updateQuery = 'UPDATE oferta_empleo SET vacantes = vacantes - 1 WHERE id_oferta_empleo = ?;' 
        mysqlConnection.query(updateQuery,[idOfertaEmpleo], (err, rows, fields) => {
            if (!err) {
                console.log(rows['changedRows'])
                callback(200, rows['changedRows'])
            } else {
                MostrarError.MostrarError(err, 'OfertaEmpleoDAO | Metodo: reducirVacante')
                callback(500, mensajes.errorInterno)
            }
        }); 
     
     }
}