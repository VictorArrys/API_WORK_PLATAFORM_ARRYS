const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const GestionToken = require('../utils/GestionToken')
const { GestionCategoriasEmpleo } = require('../componentes/GestionCategoriasEmpleo')

//Respuestas
const mensajes = require('../../utils/mensajes');


function consoleError(error, ubicacion){
    console.log('--------------------------------------------------------------------------------------')
    console.log('Se ha presentado un problema en: ' + ubicacion)
    console.log('Error(es): ' + error.message)
    console.log('--------------------------------------------------------------------------------------')
}

function comprobarRegistro(nombre, res, resultado){
    var queryOne = 'SELECT count(nombre) as Comprobacion FROM categoria_empleo WHERE nombre = ? ;'

    mysqlConnection.query(queryOne, [nombre], (error, comprobacion) => {
        if (error){
            consoleError(error, 'Funcion: comprobar registro. Paso: consultar repetido')

            res.status(500)
            res.json(mensajes.errorInterno)
        }else{
            resultado(comprobacion[0]['Comprobacion'])
        }
    })
}

function comprobarModificacion(nombre, idCategoriaEmpleo, res, resultado){
    var queryOne = 'SELECT count(nombre) as Comprobacion FROM categoria_empleo WHERE nombre = ? AND id_categoria_empleo = ?;'

    mysqlConnection.query(queryOne, [nombre, idCategoriaEmpleo], (error, comprobacion) =>{
        if (error){
            consoleError(error, 'Funcion: comprobar actualizacion. Paso: consultar repetido')

            res.status(500)
            res.json(mensajes.errorInterno)
        }else{
            resultado(comprobacion[0]['Comprobacion'])
        }
    })
}

path.get('/v1/categoriasEmpleo', (req, res) => { // listo api
    try{
        GestionCategoriasEmpleo.getCategoriasEmpleo(function(codigoRespuesta, cuerpoRespuesta) {
            res.status(codigoRespuesta)
            res.json(cuerpoRespuesta)
        })
        
    }catch (error){
        consoleError(error, 'funcion: categorias empleo. Paso: excepcion cachada')

        res.status(500)
        res.json(mensajes.errorInterno)
    }
});


path.post('/v1/categoriasEmpleo', (req, res) => { 
    const token = req.headers['x-access-token']
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, 'Administrador')
    const { nombre } = req.body
    console.log(token)
    try{
        if (respuesta.statusCode == 200){
            var queryTwo = 'INSERT INTO categoria_empleo (nombre) VALUES(?);'

            comprobarRegistro(nombre, res, function(resultado) {
                if (resultado == 1){
                    res.status(422)
                    res.json(mensajes.instruccionNoProcesada)
                }else{
                    mysqlConnection.query(queryTwo, [nombre], (error, registrarCategoria) => {
                        if (error){
                            consoleError(error, 'Funcion: registrar categoria empleo. Paso: registrar categoria')
        
                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else if (registrarCategoria.length == 0){
                            res.status(404)
                            res.json(mensajes.peticionNoEncontrada)
                        }else{
                            const registroCategoria = {}
        
                            registroCategoria['application/json'] = {
                                'idCategoriaEmpleo': registrarCategoria.insertId,
                                "nombre": nombre
                            }
        
                            res.status(201)
                            res.json(registroCategoria['application/json'])
                        }
                    })
                }
            })
        }else if (respuesta.statusCode == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    }catch (error){
        consoleError(error, 'funcion:  registrar categoria de empleo. Paso: excepcion cachada')

        res.status(500)
        res.json(mensajes.errorInterno)
    }
    
});


path.patch('/v1/categoriasEmpleo/:idCategoriaEmpleo', (req, res) => { // listo api
    const token = req.headers['x-access-token']
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")

    const { idCategoriaEmpleo } = req.params
    const { nombre } = req.body

    try{
        if (respuesta.statusCode == 200){
            var queryTwo = 'UPDATE categoria_empleo SET nombre = ? WHERE id_categoria_empleo = ?;'

            comprobarModificacion(nombre, idCategoriaEmpleo, res, function(resultado) {
                if (resultado >= 1){
                    res.status(422)
                    res.json(mensajes.instruccionNoProcesada)
                }else{
                    mysqlConnection.query(queryTwo, [nombre, idCategoriaEmpleo], (error, modificarCategoria) =>{
                        if (error){
                            consoleError(error, 'Funcion: modificar categoria empleo. Paso: modificar categoria')

                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else if (modificarCategoria.length == 0){
                            res.status(404)
                            res.json(mensajes.peticionNoEncontrada)
                        }else{
                            const registroCategoria = {}
        
                            registroCategoria['application/json'] = {
                                'idCategoriaEmpleo': idCategoriaEmpleo,
                            }
        
                            res.status(200)
                            res.json(registroCategoria['application/json'])
                        }
                    })
                }
            })
        }else if (respuesta.statusCode == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    }catch (error){
        consoleError(error, 'funcion:  modificar categoria de empleo. Paso: excepcion cachada')

        res.status(500)
        res.json(mensajes.errorInterno)
    }

});

path.delete('/v1/categoriasEmpleo/:idCategoriaEmpleo', (req, res) => { // listo api
    const token = req.headers['x-access-token']
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador");
    const { idCategoriaEmpleo } = req.params
    

    try{
        if (respuesta.statusCode == 200){
            GestionCategoriasEmpleo.deleteCategoriaEmpleo(idCategoriaEmpleo, function(codigoRespuesta, cuerpoRespuesta) {
                res.status(codigoRespuesta)
                res.json(cuerpoRespuesta)
            })
        }else if (respuesta.statusCode == 401){
            res.status(respuesta.statusCode)
            res.json(mensajes.tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
        
    }catch (error){
        consoleError(error, 'funcion:  eliminar categoria empleo. Paso: excepcion cachada')

        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

module.exports = path;