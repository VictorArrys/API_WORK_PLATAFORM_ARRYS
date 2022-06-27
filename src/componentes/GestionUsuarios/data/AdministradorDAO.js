const { Administrador } = require("../modelo/Administrador");
const { Usuario } = require("../modelo/Usuario");
var mysqlConnection = require("../../../../utils/conexion");
var mensajes = require("../../../../utils/mensajes");

exports.AdministradorDAO = class AdministradorDAO {
  static getAdministradores(callback) {
    var query = "SELECT * FROM perfil_administrador;";

    mysqlConnection.query(query, (error, resultadoAdministradores) => {
      if (error) {
        callback(500, mensajes.errorInterno);
      } else if (resultadoAdministradores.length == 0) {
        callback(200, []);
      } else {
        var cont = 0;
        var administradores = [];

        do {
          administradores.push(cont);

          administradores[cont] = {
            idPerfilAdministrador:
              resultadoAdministradores[cont]["id_perfil_administrador"],
            idPerfilUsuarioAdmin:
              resultadoAdministradores[cont]["id_perfil_usuario_admin"],
            nombre: resultadoAdministradores[cont]["nombre"],
            telefono: resultadoAdministradores[cont]["telefono"],
          };

          cont++;
        } while (cont < resultadoAdministradores.length);

        callback(200, administradores);
      }
    });
  }

  static getAdministrador(idUsuario, callback) {
    var query =
      "SELECT * FROM perfil_administrador WHERE id_perfil_usuario_admin = ?;";

    mysqlConnection.query(
      query,
      [idUsuario],
      (error, resultadoAdministrador) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else if (resultadoAdministrador.length == 0) {
          callback(404, mensajes.peticionNoEncontrada);
        } else {
          callback(200, resultadoAdministrador[0]);
        }
      }
    );
  }

  static putAdministrador(administrador, callback) {
    // falta mandar el error de la funcion
    var queryTwo =
      "UPDATE perfil_administrador SET nombre = ?, telefono = ? WHERE id_perfil_administrador = ?;";
    this.#actualizarUsuarioAdministrador(
      administrador,
      function (codigoRespuesta, cuerpoRespuesta) {
        if (codigoRespuesta == 500) {
          callback(500, mensajes.errorInterno);
        } else if (codigoRespuesta == 404) {
          callback(404, mensajes.peticionNoEncontrada);
        } else {
          mysqlConnection.query(
            queryTwo,
            [
              administrador.nombre,
              administrador.telefono,
              administrador.idPerfilAdministrador,
            ],
            (error, actualizacionAdministrador) => {
              if (error) {
                callback(500, mensajes.errorInterno);
              } else if (actualizacionAdministrador.length == 0) {
                callback(404, mensajes.peticionNoEncontrada);
              } else {
                const putAdministrador = {};

                putAdministrador["application/json"] = {
                  idPerfilUsuario: administrador.idPerfilUsuario,
                  idPerfilAdministrador: administrador.idPerfilAdministrador,
                };

                callback(200, putAdministrador["application/json"]);
              }
            }
          );
        }
      }
    );
  }

  static #actualizarUsuarioAdministrador(administrador, callback) {
    var queryOne =
      "UPDATE perfil_usuario SET nombre_usuario = ?, clave = ?, correo_electronico = ? WHERE id_perfil_usuario = ?;";
    var usuario = new Usuario();

    usuario.idPerfilUsuario = administrador.idPerfilUsuario;
    usuario.nombreUsuario = administrador.nombreUsuario;
    usuario.clave = administrador.clave;
    usuario.correoElectronico = administrador.correoElectronico;

    mysqlConnection.query(
      queryOne,
      [
        usuario.nombreUsuario,
        usuario.clave,
        usuario.correoElectronico,
        usuario.idPerfilUsuario,
      ],
      (error, actualizacionUsuario) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else if (actualizacionUsuario.length == 0) {
          callback(200, mensajes.peticionNoEncontrada);
        } else {
          const modificarUsuario = {};

          modificarUsuario["application/josn"] = {
            clave: usuario.clave,
            correoElectronico: usuario.correoElectronico,
            idPerfilUsuario: usuario.idPerfilUsuario,
            nombreUsuario: usuario.nombreUsuario,
          };

          callback(200, modificarUsuario["application/josn"]);
        }
      }
    );
  }
};
