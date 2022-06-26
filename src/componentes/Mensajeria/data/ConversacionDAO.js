var mysqlConnection = require("../../../../utils/conexion");
var mensajes = require("../../../../utils/mensajes");
const {
  ConversacionDemandante,
  ConversacionAspirante,
  ConversacionEmpleador,
} = require("../datatype/Conversacion");
const {
  ConversacionesAspirante,
  ConversacionesDemandante,
  ConversacionesEmpleador,
} = require("../datatype/Conversaciones");
const { MensajeDAO } = require("./MensajeDAO");

exports.ConversacionDAO = class ConversacionDAO {
  static getConversacionesAspirante(idAspirante, callback) {
    var queryConversaciones =
      'select id_conversacion, nombre_empleo, date_format(fecha_contratacion, "%Y-%m-%d") as fecha_contratacion from conversacion as conv inner join participacion_conversacion as parConv on parConv.id_conversacion_participacion = conv.id_conversacion where parConv.id_perfil_usuario_participacion = (select id_perfil_usuario_aspirante from perfil_aspirante where id_perfil_aspirante = ?);';

    mysqlConnection.query(
      queryConversaciones,
      [idAspirante],
      (error, resultado) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else {
          const conversaciones = [];
          resultado.forEach((fila) => {
            var conversacion = new ConversacionesAspirante();
            conversacion.fechaContratacion = fila["fecha_contratacion"];
            conversacion.tituloEmpleo = fila["nombre_empleo"];
            conversacion.idConversacion = fila["id_conversacion"];

            conversaciones.push(conversacion);
          });
          callback(200, conversaciones);
        }
      }
    );
  }

  static getConversacionAspirante(idAspirante, idConversacion, callback) {
    var queryConversaciones =
      "select conv.* from " +
      "conversacion as conv inner join participacion_conversacion as parConv " +
      "on parConv.id_conversacion_participacion = conv.id_conversacion " +
      "where parConv.id_perfil_usuario_participacion = (select id_perfil_usuario_aspirante from perfil_aspirante where id_perfil_aspirante = ?) AND conv.id_conversacion = ?;";

    mysqlConnection.query(
      queryConversaciones,
      [idAspirante, idConversacion],
      (error, resultadoConversacion) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else {
          if (resultadoConversacion.length == 1) {
            MensajeDAO.getMensajes(
              idConversacion,
              (codigoRespuesta, cuerpoRespuesta) => {
                if (codigoRespuesta == 200) {
                  var conversacionAspirante = new ConversacionAspirante();
                  conversacionAspirante.idConversacion =
                    resultadoConversacion[0]["id_conversacion"];
                  conversacionAspirante.tituloEmpleo =
                    resultadoConversacion[0]["nombre_empleo"];
                  conversacionAspirante.mensajes = cuerpoRespuesta;
                  callback(200, conversacionAspirante);
                } else {
                  callback(codigoRespuesta, cuerpoRespuesta);
                }
              }
            );
          } else {
            res.status(404);
            res.json(mensajes.peticionNoEncontrada);
          }
        }
      }
    );
  }

  static getConversacionesDemandante(idDemandante, callback) {
    var query =
      "SELECT conv.id_conversacion, conv.nombre_empleo, p_asp.nombre as nombre_aspirante, cs.fecha_contratacion " +
      "FROM conversacion AS conv INNER JOIN contratacion_servicio as cs " +
      "ON conv.id_conversacion = cs.id_conversacion_cs INNER JOIN perfil_aspirante AS p_asp " +
      "ON p_asp.id_perfil_aspirante = cs.id_perfil_aspirante_cs WHERE cs.id_perfil_demandante_cs = ?;";
    mysqlConnection.query(query, [idDemandante], (error, resultado) => {
      if (error) {
        callback(500, mensajes.errorInterno);
      } else {
        const conversaciones = [];
        resultado.forEach((fila) => {
          var conversacion = new ConversacionesDemandante();
          conversacion.fechaContratacion = fila["fecha_contratacion"];
          conversacion.idConversacion = fila["id_conversacion"];
          conversacion.nombreAspirante = fila["nombreAspirante"];
          conversacion.tituloSolicitud = fila["nombre_empleo"];
          conversaciones.push(conversacion);
        });

        callback(200, conversaciones);
      }
    });
  }

  static getConversacionDemandante(idDemandante, idConversacion, callback) {
    var queryConversacion =
      "SELECT id_conversacion, nombre_empleo FROM " +
      "conversacion AS c INNER JOIN contratacion_servicio as cs " +
      "ON cs.id_conversacion_cs = c.id_conversacion WHERE " +
      "c.id_conversacion = ? AND cs.id_perfil_demandante_cs = ?;";

    mysqlConnection.query(
      queryConversacion,
      [idConversacion, idDemandante],
      (error, resultado) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else if (resultado.length == 0) {
          callback(404, mensajes.peticionNoEncontrada);
        } else {
          MensajeDAO.getMensajes(
            idConversacion,
            (codigoRespuesta, cuerpoRespuesta) => {
              if (codigoRespuesta == 200) {
                var conversacion = new ConversacionDemandante();
                conversacion.idConversacion = resultado[0]["id_conversacion"];
                conversacion.tituloSolicitud = resultado[0]["nombre_empleo"];
                conversacion.mensajes = cuerpoRespuesta;
                callback(200, conversacion);
              } else {
                callback(codigoRespuesta, cuerpoRespuesta);
              }
            }
          );
        }
      }
    );
  }

  static getConversacionesEmpleador(idEmpleador, callback) {
    var queryConversaciones =
      "SELECT conv.id_conversacion, ofEmp.categoria, ofEmp.nombre_empleo FROM conversacion AS conv " +
      "INNER JOIN (" +
      "SELECT oe.id_oferta_empleo, catEmp.nombre as categoria, oe.nombre as nombre_empleo, oe.id_perfil_oe_empleador as idEmpleador, conEmp.id_contratacion_empleo, conEmp.id_conversacion_coe " +
      "FROM oferta_empleo AS oe INNER JOIN categoria_empleo AS catEmp ON oe.id_categoria_oe = catEmp.id_categoria_empleo " +
      "INNER JOIN contratacion_empleo AS conEmp ON conEmp.id_oferta_empleo_coe = oe.id_oferta_empleo" +
      ") AS ofEmp ON ofEmp.id_conversacion_coe = conv.id_conversacion WHERE ofEmp.idEmpleador = ?;";
    mysqlConnection.query(
      queryConversaciones,
      [idEmpleador],
      (error, resultado) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else {
          const conversaciones = [];
          resultado.forEach((fila) => {
            var conversacion = new ConversacionesEmpleador();
            conversacion.idConversacion = fila["id_conversacion"];
            conversacion.categoriaEmpleo = fila["categoria"];
            conversacion.tituloOfertaEmpleo = fila["nombre_empleo"];

            conversaciones.push(conversacion);
          });
          callback(200, conversaciones);
        }
      }
    );
  }

  static getConversacionEmpleador(idEmpleador, idConversacion, callback) {
    var queryConversacion =
      "SELECT conv.id_conversacion, empleo.nombreEmpleo " +
      "FROM conversacion AS conv INNER JOIN ( " +
      "SELECT conEmp.id_conversacion_coe AS idConversacion, ofEmp.nombre as nombreEmpleo, ofEmp.id_perfil_oe_empleador as idEmpleador " +
      "FROM contratacion_empleo AS conEmp INNER JOIN oferta_empleo AS ofEmp " +
      "ON ofEmp.id_oferta_empleo = conEmp.id_oferta_empleo_coe " +
      ") AS empleo ON empleo.idConversacion = conv.id_conversacion WHERE empleo.idEmpleador = ? AND conv.id_conversacion = ?;";

    mysqlConnection.query(
      queryConversacion,
      [idEmpleador, idConversacion],
      (error, resultado) => {
        if (error) {
          callback(500, mensajes.errorInterno);
        } else if (resultado.length == 0) {
          callback(404, mensajes.peticionNoEncontrada);
        } else {
          MensajeDAO.getMensajes(
            idConversacion,
            (codigoRespuesta, cuerpoRespuesta) => {
              if (codigoRespuesta == 200) {
                var conversacion = new ConversacionEmpleador();
                conversacion.idConversacion = resultado[0]["id_conversacion"];
                conversacion.tituloEmpleo = resultado[0]["nombreEmpleo"];
                conversacion.mensajes = cuerpoRespuesta;

                callback(200, conversacion);
              }
            }
          );
        }
      }
    );
  }
};
