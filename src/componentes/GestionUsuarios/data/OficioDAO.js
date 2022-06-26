const { Oficio } = require("../modelo/Oficio");

var mysqlConnection = require("../../../../utils/conexion");

exports.OficioDAO = class OficioDAO {
  static putOficios(idAspirante, oficios, callback) {
    //Primero eliminar registros anteriores y volver a registrar oficios
  }

  static getOficios(idAspirante, callback) {
    var query = "SELECT * FROM categoria_aspirante where id_aspirante_ca = ?;";
    mysqlConnection.query(query, [idAspirante], (error, resultadoConsulta) => {
      if (error) {
        callback(error);
      } else {
        var listaOficios = [];
        resultadoConsulta.forEach((elemento) => {
          var oficio = new Oficio();
          (oficio.idAspirante = elemento["id_aspirante_ca"]),
            (oficio.idCategoriaEmpleo = elemento["id_categoria_ca"]),
            (oficio.experiencia = elemento["experiencia"]);
          listaOficios.push(oficio);
        });
        callback(null, listaOficios);
      }
    });
  }
};
