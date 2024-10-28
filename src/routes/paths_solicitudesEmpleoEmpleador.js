const { Router } = require('express');
const path = Router();

const { GestionSolicitudesEmpleo } = require('../componentes/GestionSolcitudesEmpleo/GestionSolicitudesEmpleo');
const GestionToken = require('../utils/GestionToken');

//Respuestas
const mensajes = require('../../utils/mensajes')

path.get('/solicitudesEmpleo', (req, res) => {
    
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200 && respuesta.tokenData['estatus'] == 1){
        var idOfertaEmpleo = req.query.idOfertaEmpleo

        GestionSolicitudesEmpleo.getSolicitudesEmpleo(idOfertaEmpleo, (codigoRespuesta, cuerpoRespuestaSolicitudes)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoRespuestaSolicitudes)

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

path.get('/solicitudesEmpleo/:idSolicitudEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200 && respuesta.tokenData['estatus'] == 1){
        var idSolicitudEmpleo = req.params.idSolicitudEmpleo

        GestionSolicitudesEmpleo.getSolicitudEmpleo(idSolicitudEmpleo, (codigoRespuesta, cuerpoRespuestaSolicitud)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoRespuestaSolicitud)

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

path.patch('/solicitudesEmpleo/:idSolicitudEmpleo/aceptada', (req, res) => {

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200 && respuesta.tokenData['estatus'] == 1){
        var idSolicitudEmpleo = req.params.idSolicitudEmpleo

        GestionSolicitudesEmpleo.patchAceptarSolicitud(idSolicitudEmpleo, (codigoRespuesta, cuerpoRespuestaSolicitud)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoRespuestaSolicitud)

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


path.patch('/solicitudesEmpleo/:idSolicitudEmpleo/rechazada', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200 && respuesta.tokenData['estatus'] == 1){
        var idSolicitudEmpleo = req.params.idSolicitudEmpleo

        GestionSolicitudesEmpleo.patchRechazarSolicitud(idSolicitudEmpleo, (codigoRespuesta, cuerpoRespuestaSolicitud)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoRespuestaSolicitud)

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

module.exports = path;