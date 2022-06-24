const { check, param, body } = require("express-validator");
const { validateResult } = require("./validatorHelper");

const ConversacionesEmpleaodor = [
  param("idPerfilEmpleador").exists().isInt({ min: 1 }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const ConversacionEmpleador = [
  param("idPerfilEmpleador").exists().isInt({ min: 1 }),
  param("idConversacion").exists().isInt({ min: 1 }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const MensajeEmpleaodor = [
  param("idPerfilEmpleador").exists().isInt({ min: 1 }),
  param("idConversacion").exists().isInt({ min: 1 }),
  body("mensaje").exists().not().isEmpty().isLength({ min: 1, max: 255 }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const ConversacionesDemandante = [
  param("idPerfilDemandante").exists().isInt({ min: 1 }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const ConversacionDemandante = [
  param("idPerfilDemandante").exists().isInt({ min: 1 }),
  param("idConversacion").exists().isInt({ min: 1 }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const MensajeDemandante = [
  param("idPerfilDemandante").exists().isInt({ min: 1 }),
  param("idConversacion").exists().isInt({ min: 1 }),
  body("mensaje").exists().not().isEmpty().isLength({ min: 1, max: 255 }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  ConversacionesEmpleaodor,
  ConversacionEmpleador,
  MensajeEmpleaodor,
  ConversacionesDemandante,
  ConversacionDemandante,
  MensajeDemandante,
};
