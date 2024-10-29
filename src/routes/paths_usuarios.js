const { Router } = require("express");
const path = Router();
const multer = require("multer");
const { AccesoSistema } = require("../componentes/AccesoSistema");
const { GestionUsuarios } = require("../componentes/GestionUsuarios");
const GestionToken = require("../utils/GestionToken");

//Respuestas
const mensajes = require("../../utils/mensajes");

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
  limits: { fileSize: 8 * 1024 * 1024 * 10 },
});

path.patch(
  "/PerfilUsuarios/:idPerfilUsuario/fotografia",
  multerUpload.single("fotografia"),
  (req, res) => {
    const { idPerfilUsuario } = req.params;
    console.log(idPerfilUsuario)

    try {
      GestionUsuarios.patchFotografiaUsuario(
        req.file.buffer,
        idPerfilUsuario,
        function (codigoRespuesta, cuerpoRespuesta) {
          res.status(codigoRespuesta);
          res.json(cuerpoRespuesta);
        }
      );
    } catch (error) {
      consoleError(
        error,
        "Funcion: registrar fotografia. Paso: excepcion cachada"
      );

      res.status(500);
      res.json(mensajes.errorInterno);
    }
  }
);

path.get("/iniciarSesion", (req, res) => {
  // listo en api
  const { nombreUsuario, clave } = req.query;

  AccesoSistema.iniciarSesion(
    nombreUsuario,
    clave,
    (codigoRespuesta, cuerpoRespuesta) => {
      if (codigoRespuesta == 200) {
        const payloadToken = {
          idUsuario: cuerpoRespuesta.idPerfilUsuario,
          clave: cuerpoRespuesta.clave,
          tipo: cuerpoRespuesta.tipoUsuario,
          estatus: cuerpoRespuesta.estatus
        };
        var token = GestionToken.CrearToken(payloadToken);
        cuerpoRespuesta.token = token;
        res.setHeader("x-access-token", token);
      }
      res.status(codigoRespuesta).json(cuerpoRespuesta);
    }
  );
});

path.get("/perfilUsuarios", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarToken(token);

  try {
    if (respuesta.statusCode == 200 && respuesta.tokenData['estatus'] == 1) {
      GestionUsuarios.getUsuarios(function (codigoRespuesta, cuerpoRespuesta) {
        res.status(codigoRespuesta);
        res.json(cuerpoRespuesta);
      });
    }else if (respuesta.tokenData['estatus'] == 2){
      res.status(403)
      res.status(mensajes.prohibido)
    }else if (respuesta.statusCode == 401) {
      res.status(401);
      res.json(mensajes.peticionNoEncontrada);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(error, "funcion: catalogo usuarios. Paso: excepcion cachada");

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.get("/PerfilUsuarios/:idPerfilUsuario", (req, res) => {
  const token = req.headers["x-access-token"];
  var respuesta = GestionToken.ValidarToken(token);
  const { idPerfilUsuario } = req.params;

  try {
    if (respuesta.statusCode == 200 && respuesta.tokenData['estatus'] == 1) {
      GestionUsuarios.getUsuario(
        idPerfilUsuario,
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
      res.json(mensajes.peticionNoEncontrada);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(
      error,
      "Funcion: consultar un usuario. Paso: Excepcion cachada"
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }
});

path.patch("/perfilUsuarios/:idPerfilUsuario/habilitar", (req, res) => {
  const token = req.headers["x-access-token"]
  var respuesta = GestionToken.ValidarToken(token);

  const { idPerfilUsuario } = req.params


  try {
    if (respuesta.statusCode == 200 && respuesta.tokenData['estatus'] == 2){
      AccesoSistema.habilitarPerfil(idPerfilUsuario, function(codigoRespuesta, cuerpoRespuesta){
        if (codigoRespuesta == 200){
          const payloadToken = {
            idUsuario: respuesta.tokenData.idUsuario,
            clave: respuesta.tokenData.clave,
            tipo: respuesta.tokenData.tipo,
            estatus: 1
          };
          
          var nuevoToken = GestionToken.CrearToken(payloadToken);
          console.log(nuevoToken)
          res.setHeader("x-access-token", nuevoToken);

        }

        res.status(codigoRespuesta)
        res.json(cuerpoRespuesta)
      })
    }else if (respuesta.tokenData['estatus'] == 1){
      res.status(403)
      res.json(mensajes.prohibido)
    }else if (respuesta.statusCode == 401){
      res.status(401)
      res.json(mensajes.tokenInvalido)
    }else{
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(
      error,
      "Funcion: habilitar perfil. Paso: Excepcion cachada."
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }


  
});

path.patch("/perfilUsuarios/:idPerfilUsuario/deshabilitar", (req, res) => {
  // listo api
  const token = req.headers["x-access-token"]
  var respuesta = GestionToken.ValidarToken(token)

  const { idPerfilUsuario } = req.params;
  console.log(respuesta.tokenData)

  try {
    if (respuesta.statusCode == 200 && respuesta.tokenData['estatus'] == 1){
      AccesoSistema.deshabilitarPerfil(
        idPerfilUsuario, function(codigoRespuesta, cuerpoRespuesta){
          if (codigoRespuesta == 200){
            const payloadToken = {
              idUsuario: respuesta.tokenData.idUsuario,
              clave: respuesta.tokenData.clave,
              tipo: respuesta.tokenData.tipo,
              estatus: 2
            };
            
            var token = GestionToken.CrearToken(payloadToken);
            res.setHeader("x-access-token", token);
          }

          res.status(codigoRespuesta)
          res.json(cuerpoRespuesta)
        }
      )
    }else if (respuesta.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensajes.prohibido)
    }else if (respuesta.statusCode == 401){
      res.status(401)
      res.json(mensajes.tokenInvalido)
    }else{
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(
      error,
      "Funcion: deshabilitar perfil. Paso: Excepcion cachada."
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }

  /*try {
    if (respuesta == 200) {
      var query =
        "UPDATE perfil_usuario SET estatus = ? WHERE id_perfil_usuario = ?;";

      mysqlConnection.query(
        query,
        [2, idPerfilUsuario],
        (error, resultadoDeshabilitar) => {
          if (error) {
            consoleError(
              error,
              "Funcion: Deshabilitar usuario. Paso: error al deshabilitar"
            );

            res.status(500);
            res, json(mensajes.errorInterno);
          } else if (resultadoDeshabilitar.length == 0) {
            res.status(404);
            res.json(mensajes.peticionNoEncontrada);
          } else {
            const idPerfilDeshabilitado = {};

            idPerfilDeshabilitado["application/json"] = {
              idPerfilusuario: idPerfilUsuario,
              estatus: 2,
            };

            res.status(200);
            res.send(idPerfilDeshabilitado["application/json"]);
          }
        }
      );
    } else if (respuesta == 401) {
      res.status(respuesta);
      res.json(mensajes.tokenInvalido);
    } else {
      res.status(500);
      res.json(mensajes.errorInterno);
    }
  } catch (error) {
    consoleError(
      error,
      "Funcion: deshabilitar perfil. Paso: Excepcion cachada."
    );

    res.status(500);
    res.json(mensajes.errorInterno);
  }*/
});

module.exports = path;
