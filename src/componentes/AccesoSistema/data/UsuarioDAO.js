const { Usuario } = require("../modelo/Usuario");
var mysqlConnection = require("../../../../utils/conexion");
var mensajes = require("../../../../utils/mensajes");

exports.UsuarioDAO = class UsuarioDAO {
  static iniciarSesion(usuario, password, callback) {
    var query =
      "SELECT * FROM perfil_usuario WHERE nombre_usuario = ? AND clave = ?";

    mysqlConnection.query(
      query,
      [usuario, password],
      (error, resultadoInicio) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        }else if (resultadoInicio.length == 0) {
          console.log(
            "¡Credenciales incorrectas! Probablemente el usuario no exista o estan mal sus credenciales"
          );
          callback(404, mensajes.peticionNoEncontrada);
        }else if (resultadoInicio[0]['tipo_usuario'] == 'Empleador' && resultadoInicio[0]['estatus'] == 3){
          callback(403, mensajes.prohibido)
        } else {
          console.log("¡Inicio de sesión exitosa!");
          var usuario = resultadoInicio[0];
          var arrayFotografia = null;
          if (usuario.fotografia == null) {
            console.log("Fotografia vacia, se procede a poner null");
          } else {
            arrayFotografia = Uint8ClampedArray.from(
              Buffer.from(usuario.fotografia.buffer, "base64")
            );
          }

          var usuarioConectado = new Usuario();
          usuarioConectado.clave = usuario["clave"];
          usuarioConectado.estatus = usuario["estatus"];
          usuarioConectado.idPerfilUsuario = usuario["id_perfil_usuario"];
          usuarioConectado.correoElectronico = usuario["correo_electronico"];
          usuarioConectado.fotografia = arrayFotografia;
          usuarioConectado.nombre = usuario["nombre_usuario"];
          usuarioConectado.tipoUsuario = usuario["tipo_usuario"];

          callback(200, usuarioConectado);
        }
      }
    );
  }

  static restablecerContraseña(correoElectronico, callback) {
    //en construccion futuras reunion
    callback(null, {});
  }

  static habilitarPerfil(idUsuario, callback) {
    var query =
      "UPDATE perfil_usuario SET estatus = 1 WHERE id_perfil_usuario = ?;";

    mysqlConnection.query(query, [idUsuario], (error, resultadoHabilitar) => {
      if (error) {
        callback(500, mensajes.errorInterno);
      } else if (resultadoHabilitar.changedRows == 1) {
        var idPerfilHabilitado = {};

        idPerfilHabilitado = {
          idPerfilusuario: idUsuario,
          estatus: 1,
        };
        callback(200, idPerfilHabilitado);
      } else {
        callback(404, mensajes.peticionNoEncontrada);
      }
    });
  }

  static deshabilitarPerfil(idUsuario, callback) {
    var query =
      "UPDATE perfil_usuario SET estatus = 2 WHERE id_perfil_usuario = ?;";

    mysqlConnection.query(
      query,
      [idUsuario],
      (error, resultadoDeshabilitar) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else if (resultadoDeshabilitar.length == 0) {
          callback(404, mensajes.peticionNoEncontrada);
        } else if (resultadoDeshabilitar.changedRows == 1) {
          const idPerfilDeshabilitado = {};

          idPerfilDeshabilitado["application/json"] = {
            idPerfilusuario: idUsuario,
            estatus: 2,
          };

          callback(200, idPerfilDeshabilitado["application/json"]);
        }
      }
    );
  }
};
