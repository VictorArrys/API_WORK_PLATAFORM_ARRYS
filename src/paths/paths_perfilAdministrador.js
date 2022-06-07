const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

//Respuestas
const mensajes = require('../../utils/mensajes');
const pool = require('../../utils/conexion');
const req = require('express/lib/request');
const res = require('express/lib/response');

//Función para verificar el token
function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key)
        console.log(tokenData);
  
        if (tokenData["tipo"] == "Administrador") {
            statusCode = 200
            return statusCode
        }else{
            
            statusCode = 401
            return statusCode
          }
    
        } catch (error) { 
            statusCode = 401
            return statusCode
            
        }
}

path.get('/v1/perfilAdministradores', (req, res) => { //falta validaciones
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    try {
        if (respuesta == 200){
            var query = 'SELECT * FROM perfil_administrador;'
            pool = mysqlConnection

            pool.query(query, (error, resultadoAdminisdtradores) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoAdminisdtradores.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var administradores = resultadoAdminisdtradores

                    res.status(200);
                    res.json(administradores);
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.get('/v1/perfilAdministradores/:idPerfilAdministrador', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    const { idPerfilAdministrador } = req.params

    try {
        if(respuesta == 200){
            var query = 'SELECT * FROM perfil_administrador WHERE id_perfil_administrador = ?;'
            pool = mysqlConnection

            pool.query(query, [idPerfilAdministrador], (error, resultadoAdministrador) => {
                if(error){
                    es.status(500)
                    res.json(mensajes.errorInterno)
                }else if (resultadoAdministrador.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    var administrador = resultadoAdministrador

                    res.status(200);
                    res.json(administrador);
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});


path.put('/v1/perfilAdministradores/:idPerfilAdministrador', (req, res) => {//por completar
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)
    const {nombre, telefono, clave, correoElectronico, estatus, fotografia, idPerfilUsuario, idPerfilAdministrador, nombreUsuario} = req.body

    try{
        if(respuesta == 200){

        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    }catch (error){
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

module.exports = path