const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');


path.put('/v1/perfilDemandantes/:idPerfilDemandante', (req, res) => {
    res.sendStatus(200)

});

module.exports = path;