const { Router } = require("express");
const path = Router();
var mysqlConnection = require("../../utils/conexion");
const keys = require("../../settings/keys");
const jwt = require("jsonwebtoken");
const GestionToken = require("../utils/GestionToken");
const { GestionUsuarios } = require("../componentes/GestionUsuarios");
const {
  Administrador,
} = require("../componentes/GestionUsuarios/modelo/Administrador");

//Respuestas
const mensajes = require("../../utils/mensajes");
const pool = require("../../utils/conexion");
const req = require("express/lib/request");
const res = require("express/lib/response");

function consoleError(error, ubicacion) {
  console.log(
    "--------------------------------------------------------------------------------------"
  );
  console.log("Se ha presentado un problema en: " + ubicacion);
  console.log("Error(es): " + error.message);
  console.log(
    "--------------------------------------------------------------------------------------"
  );
}

path.get("/v1/perfilAdministradores", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador");

  try {
    if (respuesta.statusCode == 200) {
      GestionUsuarios.getAdministradores(function (
        codigoRespuesta,
        cuerpoRespuesta
      ) {
        res.status(codigoRespuesta);
        res.json(cuerpoRespuesta);
      });
    } else if (respuesta.statusCode == 401) {
      res.status(respuesta.statusCode);
      res.json(mensajes.tokenInvalido);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(error, "Funcion: administradores. Paso: excepcion cachada.");

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.get("/v1/perfilAdministradores/:idPerfilUsuarioAdmin", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador");

  const { idPerfilUsuarioAdmin } = req.params;

  try {
    if (respuesta.statusCode == 200) {
      GestionUsuarios.getAdministrador(
        idPerfilUsuarioAdmin,
        function (codigoRespuesta, cuerpoRespuesta) {
          res.status(codigoRespuesta);
          res.json(cuerpoRespuesta);
        }
      );
    } else if (respuesta.statusCode == 401) {
      res.status(respuesta.statusCode);
      res.json(mensajes.tokenInvalido);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(error, "Funcion: administradores. Paso: Excepcion cachada.");

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.put("/v1/perfilAdministradores/:idPerfilAdministrador", (req, res) => {
  // listo api
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador");

  try {
    if (respuesta.statusCode == 200) {
      var administradorEdicion = new Administrador();

      administradorEdicion.idPerfilUsuario = req.body.idPerfilUsuario;
      administradorEdicion.idPerfilAdministrador =
        req.params.idPerfilAdministrador;
      administradorEdicion.nombre = req.body.nombre;
      administradorEdicion.nombreUsuario = req.body.nombreUsuario;
      administradorEdicion.clave = req.body.clave;
      administradorEdicion.correoElectronico = req.body.correoElectronico;
      administradorEdicion.telefono = req.body.telefono;

      console.log(administradorEdicion);

      GestionUsuarios.putAdministrador(
        administradorEdicion,
        function (codigoRespuesta, cuerpoRespuesta) {
          res.status(codigoRespuesta);
          res.json(cuerpoRespuesta);
        }
      );
    } else if (respuesta.statusCode == 401) {
      res.status(respuesta.statusCode);
      res.json(mensajes.tokenInvalido);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(
      error,
      "Funcion: modificar administrador. Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

module.exports = path;
