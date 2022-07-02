const { Router } = require("express");
const path = Router();
var mysqlConnection = require("../../utils/conexion");
const keys = require("../../settings/keys");
const jwt = require("jsonwebtoken");
const ruta = require("path");
const multer = require("multer");
const { GestionUsuarios } = require("../componentes/GestionUsuarios/GestionUsuarios");
const { Aspirante } = require("../componentes/GestionUsuarios/modelo/Aspirante");
const GestionToken = require("../utils/GestionToken");
var fileSystem = require("fs");

//Respuestas
const mensajes = require("../../utils/mensajes");
const pool = require("../../utils/conexion");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { json } = require("body-parser");

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

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 * 3 },
});

path.patch(
  "/v1/perfilAspirantes/:idPerfilAspirante/video",
  multerUpload.single("video"),
  (req, res) => {
    const { idPerfilAspirante } = req.params;

    try {
      GestionUsuarios.patchVideo(
        req.file.buffer,
        idPerfilAspirante,
        function (codigoRespuesta, cuerpoRespuesta) {
          res.status(codigoRespuesta);
          res.json(cuerpoRespuesta);
        }
      );
    } catch (error) {
      consoleError(
        error,
        "Funcion: registro nuevo video. Paso: Excepcion cachada"
      );

      res.status(500);
      res.json(mensajes.errorInterno);
    }
  }
);

path.get("/v1/perfilAspirantes/:idPerfilAspirante/video", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarToken(token);
  const { idPerfilAspirante } = req.params;

  try {
    if (respuesta.statusCode == 200 && respuesta.tokenData['estatus'] == 1) {
      GestionUsuarios.getVideoAspirante(
        idPerfilAspirante,
        function (codigoRespuesta, cuerpoRespuesta) {
          if (codigoRespuesta == 200) {
            res.status(codigoRespuesta);
            res.sendFile(cuerpoRespuesta, function (error) {
              if (error) {
                res.status(500);
                res.json(mensajes.errorInterno);
              } else {
                fileSystem.unlink(cuerpoRespuesta, (error) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("archivo eliminado");
                  }
                });
              }
            });
          } else {
            res.status(codigoRespuesta);
            res.json(cuerpoRespuesta);
          }
        }
      );
    }else if (respuesta.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensajes.prohibido)
    } 
    else if (respuesta.statusCode == 401) {
      res.status(500);
      res.json(mensajes.errorInterno);
    } else {
      consoleError(error, "Funcion: consultar video. Paso: Excepcion cachada");

      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(error, "Funcion: consultar video. Paso: Excepcion cachada");

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.get('/v1/perfilAspirantes', (req, res) => {
  const token = req.headers['x-access-token']
  var respuesta = GestionToken.ValidarToken(token)
  var idCategoria = req.query.idCategoria;
  
  try {
      if (respuesta.statusCode == 200 && respuesta.tokenData['estatus'] == 1){
          GestionUsuarios.getAspirantes(idCategoria, function(codigoRespuesta, cuerpoRespuesta){
              res.status(codigoRespuesta);
              res.json(cuerpoRespuesta);
          })
      }else if (respuesta.tokenData['estatus'] == 2){
          res.status(403)
          res.json(mensajes.prohibido)
      }else if (respuesta.statusCode == 401 ){
          res.status(401)
          res.json(mensajes.tokenInvalido)
      }else{
        res.status(500)
        res.json(mensajes.errorInterno)
      }
  }catch (error) {
      consoleError(error, 'Funcion: catalogo aspirantes. Paso: Excepcion cachada')

      res.status(500)
      res.json(mensajes.errorInterno)
  }
})

path.get("/v1/perfilAspirantes/:idPerfilUsuarioAspirante", (req, res) => {
  const token = req.headers["x-access-token"];
  const { idPerfilUsuarioAspirante } = req.params;
  var respuesta = GestionToken.ValidarToken(token);

  try {
    if (respuesta.statusCode == 200) {
      GestionUsuarios.getAspirante(
        idPerfilUsuarioAspirante,
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
    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.post("/v1/perfilAspirantes", (req, res) => {
  try {
    var aspirante = new Aspirante();

    aspirante.nombre = req.body.nombre;
    aspirante.nombreUsuario = req.body.nombreUsuario;
    aspirante.clave = req.body.clave;
    aspirante.correoElectronico = req.body.correoElectronico;
    aspirante.direccion = req.body.direccion;
    aspirante.estatus = req.body.estatus;
    aspirante.fechaNacimiento = req.body.fechaNacimiento;
    aspirante.oficios = req.body.oficios;
    aspirante.telefono = req.body.telefono;
    aspirante.tipoUsuario = "Aspirante";

    console.log(aspirante);

    GestionUsuarios.postAspirante(
      aspirante,
      function (codigoRespuesta, cuerpoRespuesta) {
        res.status(codigoRespuesta);
        res.json(cuerpoRespuesta);
      }
    );
  } catch (error) {
    consoleError(
      error,
      "Funcion: Registrar Aspirante. Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.put("/v1/perfilAspirantes/:idPerfilAspirante", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");
  try {
    if (respuesta.statusCode == 200 && respuesta.tokenData['estatus'] == 1) {
      var edicionAspirante = new Aspirante();

      edicionAspirante.idPerfilAspirante = req.params.idPerfilAspirante;
      edicionAspirante.idPerfilUsuario = req.body.idPerfilUsuario;
      edicionAspirante.nombre = req.body.nombre;
      edicionAspirante.nombreUsuario = req.body.nombreUsuario;
      edicionAspirante.clave = req.body.clave;
      edicionAspirante.correoElectronico = req.body.correoElectronico;
      edicionAspirante.direccion = req.body.direccion;
      edicionAspirante.estatus = req.body.estatus;
      edicionAspirante.fechaNacimiento = req.body.fechaNacimiento;
      edicionAspirante.oficios = req.body.oficios;
      edicionAspirante.telefono = req.body.telefono;

      console.log(edicionAspirante);

      GestionUsuarios.putAspirante(
        edicionAspirante,
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
      "Funcion: modificar un aspirante. Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

module.exports = path;
