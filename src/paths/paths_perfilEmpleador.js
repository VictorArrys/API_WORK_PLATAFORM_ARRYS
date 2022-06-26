const { Router } = require("express");
const path = Router();
var mysqlConnection = require("../../utils/conexion");
const keys = require("../../settings/keys");
const jwt = require("jsonwebtoken");
const { send, status } = require("express/lib/response");
const req = require("express/lib/request");
const res = require("express/lib/response");
const pool = require("../../utils/conexion");
const mensajes = require("../../utils/mensajes");
const GestionToken = require("../utils/GestionToken");
const { GestionUsuarios } = require("../componentes/GestionUsuarios");

const { query } = require("express");
const {
  Empleador,
} = require("../componentes/GestionUsuarios/modelo/Empleador");

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

path.get("/v1/perfilEmpleadores", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarToken(token);

  try {
    if (respuesta.statusCode == 200) {
      GestionUsuarios.getEmpleadores(function (
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
    console.log(error);
    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.post("/v1/perfilEmpleadores", (req, res) => {
  try {
    var empleador = new Empleador();

    empleador.nombre = req.body.nombre;
    empleador.nombreUsuario = req.body.nombreUsuario;
    empleador.nombreOrganizacion = req.body.nombreOrganizacion;
    empleador.estatus = req.body.estatus;
    empleador.clave = req.body.clave;
    empleador.tipoUsuario = "Empleador";
    empleador.correoElectronico = req.body.correoElectronico;
    empleador.fechaNacimiento = req.body.fechaNacimiento;
    empleador.telefono = req.body.telefono;
    empleador.direccion = req.body.direccion;
    empleador.amonestaciones = 0;

    console.log(empleador);

    GestionUsuarios.postEmpleador(
      empleador,
      function (codigoRespuesta, cuerpoRespuesta) {
        res.status(codigoRespuesta);
        res.json(cuerpoRespuesta);
      }
    );
  } catch (error) {
    consoleError(
      error,
      "Funcion: registrar un empleador, Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.get("/v1/perfilEmpleadores/:idPerfilUsuarioEmpleador", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarToken(token);
  const { idPerfilUsuarioEmpleador } = req.params;

  try {
    if (respuesta.statusCode == 200) {
      GestionUsuarios.getEmpleador(
        idPerfilUsuarioEmpleador,
        function (codigoRespuesta, cuerpoRespuesta) {
          res.status(codigoRespuesta);
          res.json(cuerpoRespuesta);
        }
      );
    } else if (respuesta.statusCode == 401) {
      res.status(respuesta);
      res.json(mensajes.tokenInvalido);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(error, "Funcion: Obtener empleador. Paso: Excepcion cachada");

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.put("/v1/perfilEmpleadores/:idPerfilEmpleador", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador");

  try {
    if (respuesta.statusCode == 200) {
      var edicionEmpleador = new Empleador();
      edicionEmpleador.idPerfilUsuario = req.body.idPerfilUsuario;
      edicionEmpleador.idPerfilEmpleador = req.params.idPerfilEmpleador;
      edicionEmpleador.nombre = req.body.nombre;
      edicionEmpleador.nombreUsuario = req.body.nombreUsuario;
      edicionEmpleador.nombreOrganizacion = req.body.nombreOrganizacion;
      edicionEmpleador.clave = req.body.clave;
      edicionEmpleador.correoElectronico = req.body.correoElectronico;
      edicionEmpleador.fechaNacimiento = req.body.fechaNacimiento;
      edicionEmpleador.telefono = req.body.telefono;
      edicionEmpleador.direccion = req.body.direccion;

      console.log(edicionEmpleador);

      GestionUsuarios.putEmpleador(
        edicionEmpleador,
        function (codigoRespuesta, cuerpoRespuesta) {
          res.status(codigoRespuesta);
          res.json(cuerpoRespuesta);
        }
      );
    } else if (respuesta.statusCode == 401) {
      res.status(respuesta);
      res.json(mensajes.tokenInvalido);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(
      error,
      "Funcion: actualizar empleador. Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

module.exports = path;
