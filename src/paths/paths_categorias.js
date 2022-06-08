const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

//Respuestas
const mensajes = require('../../utils/mensajes');
const pool = require('../../utils/conexion');

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

path.get('/v1/categoriasEmpleo', (req, res) => { // falta validaciones
    try {
        var query = 'SELECT * FROM categoria_empleo'
        pool.mysqlConnection

        pool.query(query, (error, resultadoCategorias) => {
            if(error){
                res.status(500)
                res.json(mensajes.errorInterno)
            }else if (resultadoCategorias.length == 0){
                res.status(404)
                res.json(mensajes.peticionNoEncontrada)
            }else{
                var categoriasEmpleo = resultadoCategorias

                res.status(200);
                res.json(categoriasEmpleo);
            }
        })
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});


path.post('/v1/categoriasEmpleo', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    const { nombre } = req.body

    try {
        if(respuesta == 200){
            var query = 'INSERT INTO categoria_empleo (nombre) VALUES(?);'

            mysqlConnection.query(query, [nombre], (error, registrarCategoria) => {
                if(error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (registrarCategoria.length == 0){
                    res.status(503)
                    res.json('por checar')
                }else{
                    const registroCategoria = {}

                    registroCategoria['application/json'] = {
                        "id_categoria_empleo": registrarCategoria.insertId,
                        "nombre": nombre
                    };

                    res.status(200)
                    res.send(registroCategoria['application/json'])
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});


path.patch('/v1/categoriasEmpleo/:idCategoriaEmpleo', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    const { idCategoriaEmpleo } = req.params
    const { nombre } = req.body

    try {
        if(respuesta == 200){
            var query = 'UPDATE categoria_empleo SET nombre = ? WHERE id_categoria_empleo = ?;'

            mysqlConnection.query(query, [nombre, idCategoriaEmpleo], (error, actualizarCateogira) => {
                if(error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if (actualizarCateogira.length == 0){
                    //por implementar
                }else{
                    const modificarCategoria = {}

                    modificarCategoria['appication/json'] = {
                        "id_categoria_empleo": idCategoriaEmpleo,
                        "nombre": nombre
                    };

                    res.status(200)
                    res.json(modificarCategoria['appication/json'])
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.delete('/v1/categoriasEmpleo/:idCategoriaEmpleo', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    const { idCategoriaEmpleo } = req.params

    try {
        if (respuesta == 200){
            var query = 'DELETE FROM categoria_empleo WHERE id_categoria_empleo = ?;'

            mysqlConnection.query(query, [idCategoriaEmpleo], (error, eliminarCategoria) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else{
                    res.sendStatus(204)
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

module.exports = path;