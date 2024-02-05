const { Router, query } = require("express");
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
const {
  Demandante,
} = require("../componentes/GestionUsuarios/modelo/Demandante");

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

path.get("/perfilDemandantes", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarToken(token);

  try {
    if (respuesta.statusCode == 200 && respuesta.tokenData['estatus'] == 1) {
      GestionUsuarios.getDemandantes(function (
        codigoRespuesta,
        cuerpoRespuesta
      ) {
        res.status(codigoRespuesta);
        res.json(cuerpoRespuesta);
      });
    }else if (respuesta.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensajes.prohibido)
    }else if (respuesta.statusCode == 401) {
      res.status(401);
      res.json(mensajes.tokenInvalido);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(
      error,
      "Funcion: Obtener demandantes. Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.get("/perfilDemandantes/:idPerfilUsuarioDemandante", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarToken(token);
  const { idPerfilUsuarioDemandante } = req.params;

  try {
    if (respuesta.statusCode == 200) {
      GestionUsuarios.getDemandante(
        idPerfilUsuarioDemandante,
        function (codigoRespuesta, cuerpoRespuesta) {
          res.status(codigoRespuesta);
          res.json(cuerpoRespuesta);
        }
      );
    } else if (respuesta.statusCode == 401) {
      res.status(401);
      res.json(mensajes.tokenInvalido);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(error, "Funcion: obtener demandante. Paso: Excepcion cachada");

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.post("/perfilDemandantes", (req, res) => {
  try {
    var demandante = new Demandante();

    demandante.nombreUsuario = req.body.nombreUsuario;
    demandante.nombre = req.body.nombre;
    demandante.fechaNacimiento = req.body.fechaNacimiento;
    demandante.telefono = req.body.telefono;
    demandante.direccion = req.body.direccion;
    demandante.clave = req.body.clave;
    demandante.estatus = 1;
    demandante.tipoUsuario = "Demandante";
    demandante.correoElectronico = req.body.correoElectronico;

    console.log(demandante);

    GestionUsuarios.postDemandante(
      demandante,
      function (codigoRespuesta, cuerpoRespuesta) {
        res.status(codigoRespuesta);
        res.json(cuerpoRespuesta);
      }
    );
  } catch (error) {
    consoleError(
      error,
      "Funcion: registrar demandante. Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.put("/perfilDemandantes/:idPerfilDemandante", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Demandante");

  try {
    if (respuesta.statusCode == 200  && respuesta.tokenData['estatus'] == 1) {
      var edicionDemandante = new Demandante();

      edicionDemandante.idPerfilUsuario = req.body.idPerfilUsuario;
      edicionDemandante.idPerfilDemandante = req.params.idPerfilDemandante;
      edicionDemandante.nombreUsuario = req.body.nombreUsuario;
      edicionDemandante.nombre = req.body.nombre;
      edicionDemandante.fechaNacimiento = req.body.fechaNacimiento;
      edicionDemandante.telefono = req.body.telefono;
      edicionDemandante.direccion = req.body.direccion;
      edicionDemandante.clave = req.body.clave;
      edicionDemandante.correoElectronico = req.body.correoElectronico;

      console.log(edicionDemandante);

      GestionUsuarios.putDemandante(
        edicionDemandante,
        function (codigoRespuesta, cuerpoRespuesta) {
          res.status(codigoRespuesta);
          res.json(cuerpoRespuesta);
        }
      );
    }else if (respuesta.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensajes.prohibido)
    }else if (respuesta.statusCode == 401) {
      res.status(401);
      res.json(mensajes.tokenInvalido);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(
      error,
      "Funcion: actualizar demandante. Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

module.exports = path;
