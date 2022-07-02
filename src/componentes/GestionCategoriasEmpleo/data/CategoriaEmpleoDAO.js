//const { CategoriaEmpleo } = require("../modelo/CategoriaEmpleo");
var mysqlConnection = require("../../../../utils/conexion");
var mensajes = require("../../../../utils/mensajes");

exports.CategoriaEmpleoDAO = class CategoriaEmpleoDAO {
  static getCategoriasEmpleo(callback) {
    var query = "SELECT * FROM categoria_empleo";
    mysqlConnection.query(query, (error, resultadoCategorias) => {
      if (error) {
        callback(500, mensajes.errorInterno);
      } else if (resultadoCategorias.length == 0) {
        callback(404, mensajes.peticionNoEncontrada);
      } else {
        var cont = 0;
        var categorias = [];

        do {
          categorias[cont] = {
            idCategoriaEmpleo: resultadoCategorias[cont]["id_categoria_empleo"],
            nombre: resultadoCategorias[cont]["nombre"],
          };
          cont++;
        } while (cont < resultadoCategorias.length);

        callback(200, categorias);
      }
    });
  }

  static postCategoriaEmpleo(nombre, callback) {
    var queryTwo = "INSERT INTO categoria_empleo (nombre) VALUES(?);";

    this.comprobarRegistro( nombre, function (codigoRespuesta, cuerpoRespuestaCategoria) {
        if (codigoRespuesta == 500) {
          callback(500, mensajes.errorInterno);
        } else if (cuerpoRespuestaCategoria >= 1) {
          callback(422, mensajes.instruccionNoProcesada);
        } else {
          mysqlConnection.query(
            queryTwo,
            [nombre],
            (error, registroCategoria) => {
              if (error) {
                callback(500, mensajes.errorInterno);
              } else if (registroCategoria.length == 0) {
                callback(404, mensajes.peticionNoEncontrada);
              } else {
                const nuevaCategoria = {};

                nuevaCategoria["application/json"] = {
                  idCategoriaEmpleo: registroCategoria.insertId,
                  nombre: nombre,
                };

                callback(201, nuevaCategoria["application/json"]);
              }
            }
          );
        }
      }
    );
  }

  static patchCategoriaEmpleo(idCategoriaEmpleo, nombre, callback) {
    var query =
      "UPDATE categoria_empleo SET nombre = ? WHERE id_categoria_empleo = ?;";

    mysqlConnection.query(
      query,
      [nombre, idCategoriaEmpleo],
      (error, actualizacionCategoria) => {
        if (error) {
          console.log(error);
          callback(500, mensajes.errorInterno);
        } else if (actualizacionCategoria.length == 0) {
          callback(404, mensajes.peticionNoEncontrada);
        } else {
          const edicionCategoria = {};

          edicionCategoria["application/json"] = {
            idCategoriaEmpleo: idCategoriaEmpleo,
          };

          callback(200, edicionCategoria["application/json"]);
        }
      }
    );
  }

  static deleteCategoriaEmpleo(idCategoriaEmpleo, callback) {
    var query = "DELETE FROM categoria_empleo WHERE id_categoria_empleo = ?;";

    mysqlConnection.query(
      query,
      [idCategoriaEmpleo],
      (error, eliminarCategoria) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else {
          callback(204, mensajes.eliminarCategoria);
        }
      }
    );
  }

  static comprobarRegistro(nombre, callback) {
    var queryOne =
      "SELECT count(nombre) as Comprobacion FROM categoria_empleo WHERE nombre = ? ;";

    mysqlConnection.query(queryOne, [nombre], (error, comprobacion) => {
      if (error) {
        callback(500, mensajes.errorInterno);
      } else {
        callback(200, comprobacion[0]["Comprobacion"]);
      }
    });
  }
};
