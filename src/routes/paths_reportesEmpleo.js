const { Router } = require('express');
const path = Router();

const {ResportesEmpleo} = require('../componentes/GestionReportesEmpleo/GestionReportesEmpleo')
const GestionToken = require('../utils/GestionToken');
//Respuestas
const mensajes = require('../../utils/mensajes')

path.get('/reportesEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")
    
    if(respuesta['statusCode'] == 200 && respuesta.tokenData['estatus'] == 1){

        ResportesEmpleo.getReportesEmpleo((codigoRespuesta, cuerpoReportesOferta)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoReportesOferta)

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

path.get('/reportesEmpleo/:idReporteEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")
     
    if(respuesta['statusCode'] == 200 && respuesta.tokenData['estatus'] == 1){
        
        var idReporteEmpleo = req.params.idReporteEmpleo;
        ResportesEmpleo.getReporteEmpleo(idReporteEmpleo,(codigoRespuesta, cuerpoReporteOferta)=>{
             
            res.status(codigoRespuesta)
            res.json(cuerpoReporteOferta)
 
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

path.patch('/reportesEmpleo/:idReporteEmpleo/aceptado', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")
     
    if(respuesta['statusCode'] == 200  && respuesta.tokenData['estatus'] == 1){
        
        var idReporteEmpleo = req.params.idReporteEmpleo;
        ResportesEmpleo.aceptarReporteEmpleo(idReporteEmpleo,(codigoRespuesta, cuerpoReporteOferta)=>{
             
            res.status(codigoRespuesta)
            res.json(cuerpoReporteOferta)
 
        })
     }else if (respuesta.statusCode['estatus'] == 2){
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


path.patch('/reportesEmpleo/:idReporteEmpleo/rechazado', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")
     
    if(respuesta['statusCode'] == 200 && respuesta.tokenData['estatus'] == 1){
        
        var idReporteEmpleo = req.params.idReporteEmpleo;
        ResportesEmpleo.rechazarReporteEmpleo(idReporteEmpleo,(codigoRespuesta, cuerpoReporteOferta)=>{
             
            res.status(codigoRespuesta)
            res.json(cuerpoReporteOferta)
 
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


//Aspirante

path.post('/reportesEmpleo', (req, res) => {
    const token = req.headers['x-access-token'];
    var idContratacion = req.body['idContratacion'];
    var contenidoReporte = req.body['motivo'];
    var idAspirante = req.body['idPerfilAspirante'];
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");
    
    if(respuesta.statusCode == 200){
        ResportesEmpleo.postReporteEmpleo(idContratacion, idAspirante, contenidoReporte, (codigoRespuesta, cuerpoReporteEmpleo)=>{
            res.status(codigoRespuesta).json(cuerpoReporteEmpleo);
        });
    }else if(respuesta.statusCode == 401){
        res.status(respuesta.s)
        res.json(mensajes.tokenInvalido);
    }
});

module.exports = path;