const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');


path.get('/hello', (req, res) => {
    res.json({"Title": "Hello world"});
});

path.get('/v1/iniciarSesion/:nombreUsuario/:clave', (req, res) => {
    var pool = mysqlConnection;
    console.log(req)
    pool.query('SELECT * FROM perfil_usuario WHERE nombre_usuario = ? AND clave = ?;', [req.params.nombreUsuario, req.params.clave], (error, rows)=>{
        if(error){ 
            reject({
                "resBody" : {
                  "menssage" : "error interno desde el servidor", 
                }, 
                "statusCode" : 500
            });
        }else
        {
            console.log("No hay errores");
        }
        if(rows.length == 0){

            console.log("¡Metiste credenciales incorrectas subnormal!");
        }else{
            var usuario = rows[0];

            const payload = {
                "idUsuario" : usuario['id_perfil_usuario'],
                "clave" : usuario['clave'],
                "tipo" : usuario['tipo_usuario']
            }
            
            const token = jwt.sign(payload, keys.key, { expiresIn: 60 * 60 * 24
              });

            console.log("¡Felicidades XD!");

            const resultadoJson = {};
            resultadoJson['application/json'] = {
                "resBody" : {
                "clave" : usuario['clave'],
                "tipo" : usuario['tipo_usuario'],
                "estatus" : usuario['estatus'],
                "idPerfilusuario" : usuario['id_perfil_usuario'],
                "correoElectronico" : usuario['correo_electronico'],
                "fotografia" : usuario['fotografia'],
                "tipoUsuario" : usuario['tipo_usuario'],
                "token" : token
                },
                "statusCode" : 200
            };
            res.send(resultadoJson);
            //res.json({usuario, "token" : token, "statusCode" : 200});
        }

    });
});


module.exports = path;