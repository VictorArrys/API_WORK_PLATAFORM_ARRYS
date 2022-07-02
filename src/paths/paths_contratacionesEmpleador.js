const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

//Respuestas
const mensajes = require('../../utils/mensajes');
const { GestionContratacionesEmpleo } = require('../componentes/GestionContratacionesEmpleo/GestionContratacionesEmpleo');
const GestionToken = require('../utils/GestionToken');


path.get('/v1/contratacionesEmpleo/:idOfertaEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200  && respuesta.tokenData['estatus'] == 1){
        var idOfertaEmpleo = req.params.idOfertaEmpleo

        GestionContratacionesEmpleo.getContratacionEmpleo(idOfertaEmpleo, (codigoRespuesta, cuerpoContratacion)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoContratacion)

        })
    }else if (respuesta.tokenData['estatus'] == 2){
        res.status(403)
        res.json(mensajes.prohibido)
    }else if(respuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

path.patch('/v1/contratacionesEmpleo/:idOfertaEmpleo', (req, res) => {
    
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200 && respuesta.tokenData['estatus'] == 1){
        //Agregar valoración del aspirante en caso de existir la contratación
        //Obtener datos del body
        var idAspirante = req.query.idAspirante
        var valoracionAspirante = req.body.valoracionAspirante
        var idOfertaEmpleo = req.params.idOfertaEmpleo

        GestionContratacionesEmpleo.patchEvaluarAspiranteContratado(idOfertaEmpleo, idAspirante, valoracionAspirante, (codigoRespuesta, cuerpoEvaluacion)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoEvaluacion)

        })
    }else if (respuesta.tokenData['estatus'] == 2){
        res.status(403)
        res.json(mensajes.prohibido)
    }else if(resprespuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }
});

module.exports = path;
