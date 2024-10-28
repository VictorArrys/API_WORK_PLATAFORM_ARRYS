const { Router } = require("express");
const path = Router();
const mensajes = require("../../utils/mensajes");

const GestionToken = require("../utils/GestionToken");

const { Mensajeria } = require("../componentes/Mensajeria/Mensajeria");

const {
  ConversacionesEmpleaodor,
  ConversacionDemandante,
  ConversacionesDemandante,
  MensajeDemandante,
  ConversacionEmpleador,
  MensajeEmpleaodor,
} = require("../../utils/validaciones/mesajeria");

//Consulta de conversaciones
path.get(
  "/perfilDemandantes/:idPerfilDemandante/conversaciones",
  ConversacionesDemandante,
  (req, res) => {
    const token = req.headers["x-access-token"];
    const idPerfilDemandante = req.params["idPerfilDemandante"];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(
      token,
      "Demandante"
    );

    if (validacionToken.statusCode == 200 && validacionToken.tokenData['estatus'] == 1) {
      Mensajeria.getConversacionesDemandante(
        idPerfilDemandante,
        (codigoRespuesta, cuerpoRespuesta) => {
          res.status(codigoRespuesta).json(cuerpoRespuesta);
        }
      );
    } else {
      res.status(401);
      res.send(mensajes.tokenInvalido);
    }
  }
);

//Consulta de una conversación
path.get(
  "/perfilDemandantes/:idPerfilDemandante/conversaciones/:idConversacion",
  ConversacionDemandante,
  (req, res) => {
    const token = req.headers["x-access-token"];
    const idPerfilDemandante = req.params["idPerfilDemandante"];
    const idConversacion = req.params["idConversacion"];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(
      token,
      "Demandante"
    );

    if (validacionToken.statusCode == 200 && validacionToken.tokenData['estatus'] == 1) {
      Mensajeria.getConversacionDemandante(
        idPerfilDemandante,
        idConversacion,
        (codigoRespuesta, cuerpoRespuesta) => {
          res.status(codigoRespuesta).json(cuerpoRespuesta);
        }
      );
    }else if (validacionToken.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensajes.prohibido)
    } else {
      res.status(401);
      res.send(mensajes.tokenInvalido);
    }
  }
);

path.post(
  "/perfilDemandantes/:idPerfilDemandante/conversaciones/:idConversacion",
  MensajeDemandante,
  (req, res) => {
    const token = req.headers["x-access-token"];
    const idPerfilDemandante = req.params["idPerfilDemandante"];
    const idConversacion = req.params["idConversacion"];
    const mensaje = req.body["mensaje"];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(
      token,
      "Demandante"
    );

    if (validacionToken.statusCode == 200 && validacionToken.tokenData['estatus'] == 1) {
      Mensajeria.postMensajeDemandante(
        idPerfilDemandante,
        idConversacion,
        mensaje,
        (codigoRespuesta, cuerpoRespuesta) => {
          res.status(codigoRespuesta).json(cuerpoRespuesta);
        }
      );
    }else if (validacionToken.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensaje.prohibido)
    } else {
      res.status(401);
      res.send(mensajes.tokenInvalido);
    }
  }
);

path.get(
  "/perfilEmpleadores/:idPerfilEmpleador/conversaciones",
  ConversacionesEmpleaodor,
  (req, res) => {
    const token = req.headers["x-access-token"];
    const idPerfilEmpleador = req.params["idPerfilEmpleador"];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(
      token,
      "Empleador"
    );

    if (validacionToken.statusCode == 200 && validacionToken.tokenData['estatus'] == 1) {
      Mensajeria.getConversacionesEmpleador(
        idPerfilEmpleador,
        (codigoRespuesta, cuerpoRespuesta) => {
          res.status(codigoRespuesta).json(cuerpoRespuesta);
        }
      );
    }else if (validacionToken.tokenData['estatus'] == 1){
      res.status(403)
      res.json(mensajes.prohibido)
    } else {
      res.status(401);
      res.send(mensajes.tokenInvalido);
    }
  }
);

path.get(
  "/perfilEmpleadores/:idPerfilEmpleador/conversaciones/:idConversacion",
  ConversacionEmpleador,
  (req, res) => {
    const token = req.headers["x-access-token"];
    const idPerfilEmpleador = req.params["idPerfilEmpleador"];
    const idConversacion = req.params["idConversacion"];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(
      token,
      "Empleador"
    );

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
      Mensajeria.getConversacionEmpleador(
        idPerfilEmpleador,
        idConversacion,
        (codigoRespuesta, cuerpoRespuesta) => {
          res.status(codigoRespuesta).json(cuerpoRespuesta);
        }
      );
    }else if (validacionToken.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensajes.prohibido)
    } else {
      res.status(401);
      res.send(mensajes.tokenInvalido);
    }
  }
);

path.post(
  "/perfilEmpleadores/:idPerfilEmpleador/conversaciones/:idConversacion",
  MensajeEmpleaodor,
  (req, res) => {
    const token = req.headers["x-access-token"];
    const idPerfilEmpleador = req.params["idPerfilEmpleador"];
    const idConversacion = req.params["idConversacion"];
    const mensaje = req.body["mensaje"];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(
      token,
      "Empleador"
    );
    if (validacionToken.statusCode == 200 && validacionToken.tokenData['estatus'] == 1) {
      Mensajeria.postMensajeEmpleador(
        idPerfilEmpleador,
        idConversacion,
        mensaje,
        (codigoRespuesta, cuerpoRespuesta) => {
          res.status(codigoRespuesta).json(cuerpoRespuesta);
        }
      );
    }else if (validacionToken.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensaje.prohibido)
    }else {
      res.status(401);
      res.send(mensajes.tokenInvalido);
    }
  }
);

path.get(
  "/perfilAspirantes/:idPerfilAspirante/conversaciones",
  (req, res) => {
    const token = req.headers["x-access-token"];
    const idPerfilAspirante = req.params["idPerfilAspirante"];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(
      token,
      "Aspirante"
    );

    if (validacionToken.statusCode == 200 && validacionToken.tokenData['estatus'] == 1) {
      Mensajeria.getConversacionesAspirante(
        idPerfilAspirante,
        (codigoRespuesta, cuerpoRespuesta) => {
          res.status(codigoRespuesta).json(cuerpoRespuesta);
        }
      );
    }else if (validacionToken.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensajes.prohibido)
    } else {
      res.status(401);
      res.send(mensajes.tokenInvalido);
    }
  }
);

path.get(
  "/perfilAspirantes/:idPerfilAspirante/conversaciones/:idConversacion",
  (req, res) => {
    const token = req.headers["x-access-token"];
    idPerfilAspirante = req.params["idPerfilAspirante"];
    idConversacion = req.params["idConversacion"];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(
      token,
      "Aspirante"
    );
    if (validacionToken.statusCode == 200 && validacionToken.tokenData['estatus'] == 1) {
      Mensajeria.getConversacionAspirante(
        idPerfilAspirante,
        idConversacion,
        (codigoRespuesta, cuerpoRespuesta) => {
          res.status(codigoRespuesta).json(cuerpoRespuesta);
        }
      );
    }else if (validacionToken.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensajes.prohibido)
    } else {
      console.log("token invalidado");
      res.status(401).send(mensajes.tokenInvalido);
    }
  }
);

path.post(
  "/perfilAspirantes/:idPerfilAspirante/conversaciones/:idConversacion",
  (req, res) => {
    const token = req.headers["x-access-token"];
    const idPerfilAspirante = req.params["idPerfilAspirante"];
    const idConversacion = req.params["idConversacion"];
    const mensaje = req.body["mensaje"];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(
      token,
      "Aspirante"
    );
    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
      Mensajeria.postMensajeAspirante(
        idPerfilAspirante,
        idConversacion,
        mensaje,
        (codigoRespuesta, cuerpoRespuesta) => {
          res.status(codigoRespuesta).json(cuerpoRespuesta);
        }
      );
    }else if (validacionToken.tokenData['estatus'] == 2){
      res.status(403)
      res.json(mensaje.prohibido)
    }else {
      res.status(401);
      res.send(mensajes.tokenInvalido);
    }
  }
);

module.exports = path;
