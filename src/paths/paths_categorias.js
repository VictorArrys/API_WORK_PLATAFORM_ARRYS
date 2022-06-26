const { Router } = require("express");
const path = Router();
var mysqlConnection = require("../../utils/conexion");
const keys = require("../../settings/keys");
const jwt = require("jsonwebtoken");
const GestionToken = require("../utils/GestionToken");
const {
  GestionCategoriasEmpleo,
} = require("../componentes/GestionCategoriasEmpleo");

//Respuestas
const mensajes = require("../../utils/mensajes");
const {
  CategoriaEmpleo,
} = require("../componentes/GestionCategoriasEmpleo/modelo/CategoriaEmpleo");

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

path.get("/v1/categoriasEmpleo", (req, res) => {
  // listo api
  try {
    GestionCategoriasEmpleo.getCategoriasEmpleo(function (
      codigoRespuesta,
      cuerpoRespuesta
    ) {
      res.status(codigoRespuesta);
      res.json(cuerpoRespuesta);
    });
  } catch (error) {
    consoleError(error, "funcion: categorias empleo. Paso: excepcion cachada");

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.post("/v1/categoriasEmpleo", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador");

  try {
    if (respuesta.statusCode == 200) {
      var categoria = new CategoriaEmpleo();

      categoria.nombre = req.body.nombre;

      console.log(categoria.nombre);

      GestionCategoriasEmpleo.postCategoriaEmpleo(
        categoria.nombre,
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
    consoleError(
      error,
      "Funcion: registrar categoria. Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.patch("/v1/categoriasEmpleo/:idCategoriaEmpleo", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador");

  try {
    if (respuesta.statusCode == 200) {
      var edicionCategoria = new CategoriaEmpleo();

      edicionCategoria.idCategoriaEmpleo = req.params.idCategoriaEmpleo;
      edicionCategoria.nombre = req.body.nombre;

      console.log(edicionCategoria);

      GestionCategoriasEmpleo.patchCategoriaEmpleo(
        edicionCategoria.idCategoriaEmpleo,
        edicionCategoria.nombre,
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
      "funcion:  modificar categoria de empleo. Paso: excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.delete("/v1/categoriasEmpleo/:idCategoriaEmpleo", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador");
  const { idCategoriaEmpleo } = req.params;

  try {
    if (respuesta.statusCode == 200) {
      GestionCategoriasEmpleo.deleteCategoriaEmpleo(
        idCategoriaEmpleo,
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
      "funcion:  eliminar categoria empleo. Paso: excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

module.exports = path;
