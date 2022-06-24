const { check, param, body, query } = require("express-validator");
const { validateResult } = require("./validatorHelper");

module.exports.ValidarCategorias = [
  query("categoriasEmpleo.*").isInt(),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
