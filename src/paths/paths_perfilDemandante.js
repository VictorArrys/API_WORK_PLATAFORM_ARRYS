const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');

path.put('/v1/perfilDemandantes/:idPerfilDemandante', (req, res) => {
    const { direccion, fechaNacimiento, nombre, telefono, clave, correoElectronico, estatus,
        nombreUsuario, idPerfilUsuario, idperfilDemandante, fotografia} = req.body
    var queryOne = 'UPDATE perfil_usuario SET  nombre_usuario = ?, estatus = ?, clave = ?, correo_electronico = ?, fotografia = ? WHERE id_perfil_usuario = ? ;';
    var querytwo = 'UPDATE perfil_demandante SET nonbre = ?, fecha_nacimiento = ?, telefono = ?, direccion = ? WHERE id_perfil_demandante = ? ;'
    mysqlConnection.query(queryOne, [nombreUsuario, estatus, clave, correoElectronico, fotografia, idPerfilUsuario], (err, rows, fields) => {
        if (!err) {
            console.log('actualizado');
          } else {
              console.log(err)
              res.json({
                  "resBody" : {
                  "menssage" : "error interno del servidor"
              }
              });
              res.status(500)
            
          }
    })

    mysqlConnection.query(querytwo, [nombre, fechaNacimiento, telefono, direccion, idperfilDemandante], (err, rows, fields) => {
        if (!err) {
            res.status(204);
            res.json({
              "resBody" : {
              "menssage" : "Actualización exitosa xd"
              }
              });
          } else {
              console.log(err)
              res.json({
                  "resBody" : {
                  "menssage" : "error interno del servidor"
              }
              });
              res.status(500)
            
          }
    })
    
});

module.exports = path;