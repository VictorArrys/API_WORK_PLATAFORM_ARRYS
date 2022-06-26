var mysqlConnection = require('../../../../utils/conexion');
const { Demandante } = require('../modelo/Demandante');

exports.DemandanteDAO =  class {
    static getDemandante(idDemandante, callback) {
        mysqlConnection.query("select id_perfil_demandante, nonbre from perfil_demandante where id_perfil_demandante = ?", [idDemandante], (error, consultaDemandante) => {
            if (error) {
                callback(null);
            }
            if (consultaDemandante.length == 0){
                callback(null);
            }
            var demandante = new Demandante();
            demandante.idPerfilDemandante = consultaDemandante[0]['id_perfil_demandante'];
            demandante.nombre = consultaDemandante[0]['nonbre'];
            callback(demandante);
        });       
    }
}