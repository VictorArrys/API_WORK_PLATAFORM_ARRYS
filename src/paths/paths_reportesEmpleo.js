const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

const {ResportesEmpleo} = require('../componentes/GestionReportesEmpleo')
const GestionToken = require('../utils/GestionToken');
//Respuestas
const mensajes = require('../../utils/mensajes')

//Función para verificar el token
function verifyToken(token, tipoUsuario){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
        console.log(tokenData);
  
        if (tokenData["tipo"] == tipoUsuario) {
            statusCode = 200
            return statusCode
        }else{
            //Caso que un token exista pero no contenga los permisos para la petición
            statusCode = 401
            return statusCode
          }
    
        } catch (error) { //Caso ..de un token invalido, es decir que no exista
            statusCode = 401
            return statusCode
            
        }
}

path.get('/v1/reportesEmpleo', (req, res) => {
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

path.get('/v1/reportesEmpleo/:idReporteEmpleo', (req, res) => {
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

path.patch('/v1/reportesEmpleo/:idReporteEmpleo/aceptado', (req, res) => {
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


path.patch('/v1/reportesEmpleo/:idReporteEmpleo/rechazado', (req, res) => {
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

path.post('/v1/reportesEmpleo', (req, res) => {
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