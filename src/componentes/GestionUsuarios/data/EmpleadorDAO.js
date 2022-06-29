const { Aspirante } = require("../modelo/Empleador");
var mysqlConnection = require("../../../../utils/conexion");
var mensajes = require("../../../../utils/mensajes");

const { Usuario } = require("../modelo/Usuario");
const { UsuarioDAO } = require("./UsuarioDAO");

exports.EmpleadorDAO = class EmpleadorDAO {
  static getEmpleadores(callback) {
    var query = "SELECT * FROM perfil_empleador;";

    mysqlConnection.query(query, (error, resultadoEmpleadores) => {
      if (error) {
        callback(500, mensajes.errorInterno);
      }else if (resultadoEmpleadores.length == 0){
        callback(200, [])
      } 
      else {
        var cont = 0;
        var empleadores = [];

        do {
          empleadores.push(cont);

          empleadores[cont] = {
            idPerfilEmpleador:
              resultadoEmpleadores[cont]["id_perfil_empleador"],
            idPerfilUsuarioEmpleador:
              resultadoEmpleadores[cont]["id_perfil_usuario_empleador"],
            nombreOrganizacion:
              resultadoEmpleadores[cont]["nombre_organizacion"],
            nombre: resultadoEmpleadores[cont]["nombre"],
            direccion: resultadoEmpleadores[cont]["direccion"],
            fechaNacimiento: resultadoEmpleadores[cont]["fecha_nacimiento"],
            telefono: resultadoEmpleadores[cont]["telefono"],
            amonestaciones: resultadoEmpleadores[cont]["amonestaciones"],
          };

          cont++;
        } while (cont < resultadoEmpleadores.length);

        callback(200, empleadores);
      }
    });
  }

  static getEmpleador(idEmpleador, callback) {
    var query =
      "SELECT * FROM perfil_empleador WHERE id_perfil_usuario_empleador = ?;";

    mysqlConnection.query(query, [idEmpleador], (error, resultadoEmpleador) => {
      if (error) {
        callback(500, mensajes.errorInterno);
      }else if (resultadoEmpleador.length == 200){
        callback(404, mensajes.errorInterno)
      } else {
        var empleador = resultadoEmpleador[0];
        var getEmpleador = {};

        getEmpleador["application/json"] = {
          idPerfilEmpleador: empleador["id_perfil_empleador"],
          idPerfilUsuarioEmpleador: empleador["id_perfil_usuario_empleador"],
          nombreOrganizacion: empleador["nombre_organizacion"],
          nombre: empleador["nombre"],
          direccion: empleador["direccion"],
          fechaNacimiento: empleador["fecha_nacimiento"],
          telefono: empleador["telefono"],
          amonestaciones: empleador["amonestaciones"],
        };

        callback(200, getEmpleador["application/json"]);
      }
    });
  }

  static postEmpleador(empleadorNuevo, callback) {
    var queryTwo =
      "INSERT INTO perfil_empleador (id_perfil_usuario_empleador, nombre_organizacion, nombre, direccion, fecha_nacimiento, telefono, amonestaciones) VALUES (?, ?, ?, ?, ?, ?, ?);";

    comprobarRegistro(
      empleadorNuevo.nombreUsuario,
      empleadorNuevo.correoElectronico,
      function (codigoRespuesta, cuerpoRespuestaRegistro) {
        if (codigoRespuesta == 500) {
          callback(500, mensajes.errorInterno);
        } else if (cuerpoRespuestaRegistro >= 1) {
          callback(422, mensajes.instruccionNoProcesada);
        } else {
          UsuarioDAO.postUsuario(
            empleadorNuevo,
            function (codigoRespuesta, cuerpoRespuesta) {
              if (codigoRespuesta == 500) {
                callback(500, mensajes.errorInterno);
              } else if (codigoRespuesta == 404) {
                callback(404, mensajes.peticionNoEncontrada);
              } else {
                var idUsuario = 0;
                idUsuario = cuerpoRespuesta.idPerfilUsuario;

                mysqlConnection.query(
                  queryTwo,
                  [
                    idUsuario,
                    empleadorNuevo.nombreOrganizacion,
                    empleadorNuevo.nombre,
                    empleadorNuevo.direccion,
                    empleadorNuevo.fechaNacimiento,
                    empleadorNuevo.telefono,
                    empleadorNuevo.amonestaciones,
                  ],
                  (error, registroPerfilEmpleador) => {
                    if (error) {
                      console.log(error);
                      callback(500, mensajes.errorInterno);
                    } else if (registroPerfilEmpleador.length == 0) {
                      callback(404, mensajes.peticionNoEncontrada);
                    } else {
                      if (registroPerfilEmpleador["affectedRows"] == 1) {
                        var idEmpleador = registroPerfilEmpleador.insertId;

                        const nuevoEmpleador = {};
                        nuevoEmpleador["application/json"] = {
                          idPerfilUsuario: idUsuario,
                          idPerfilEmpleador: idEmpleador,
                        };

                        callback(201, nuevoEmpleador["application/json"]);
                      }
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  static putEmpleador(empleador, callback) {
    var query =
      "UPDATE perfil_empleador SET nombre_organizacion = ?, nombre = ?, direccion = ?, fecha_nacimiento = ?, telefono = ? WHERE id_perfil_empleador = ? ;";

    UsuarioDAO.putUsuario(
      empleador,
      function (codigoRespuesta, cuerpoRespuesta) {
        if (codigoRespuesta == 500) {
          callback(500, mensajes.errorInterno);
        } else if (codigoRespuesta == 404) { 
          callback(404, mensajes.peticionNoEncontrada);
        } else {
          mysqlConnection.query(
            query,
            [
              empleador.nombreOrganizacion,
              empleador.nombre,
              empleador.direccion,
              empleador.fechaNacimiento,
              empleador.telefono,
              empleador.idPerfilEmpleador,
            ],
            (error, actualizacionPerfilEmpleador) => {
              if (error) {
                console.log(error);
                callback(500, mensajes.errorInterno);
              } else if (actualizacionPerfilEmpleador.length == 0) {
                callback(404, mensajes.peticionNoEncontrada);
              } else {
                const edicionEmpleador = {};

                edicionEmpleador["application/json"] = {
                  idPerfilUsuario: empleador.idPerfilUsuario,
                  idPerfilEmpleador: empleador.idPerfilEmpleador,
                };

                callback(200, edicionEmpleador["application/json"]);
              }
            }
          );
        }
      }
    );
  }

  static comprobarRegistro(nombreUsuario, correoElectronico, callback) {
    var queryOne =
      "SELECT count(id_perfil_usuario) as Comprobacion FROM perfil_usuario WHERE nombre_usuario = ? OR  correo_electronico = ? ;";
    mysqlConnection.query(
      queryOne,
      [nombreUsuario, correoElectronico],
      (error, comprobacion) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else {
          callback(200, comprobacion[0]["Comprobacion"]);
        }
      }
    );
  }
};
