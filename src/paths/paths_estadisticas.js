const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

//Respuestas
const mensajes = require('../../utils/mensajes');
const { Estadisticas } = require('../componentes/Estadisticas/Estadisticas');
const GestionToken = require('../utils/GestionToken');

//Función para verificar el token
function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
        console.log(tokenData);
  
        if (tokenData["tipo"] == "Administrador") {
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

//Ofertas de empleo generadas por fecha y por categoria
path.get('/v1/estadisticas/estadisticasUsoPlataforma', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")
    
    if(respuesta['statusCode'] == 200){

        Estadisticas.estadisticaUsoPlataforma((codigoRespuesta, cuerpoEstadisticasPlataforma)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoEstadisticasPlataforma)

        })
    }else if(respuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }
});

//Solicitudes de empleos por categoria y por fecha
path.get('/v1/estadisticas/estadisiticasEmpleos', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")
    
    if(respuesta['statusCode'] == 200){

        Estadisticas.estadisticaEmpleos((codigoRespuesta, cuerpoEstadisticasEmpleo)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoEstadisticasEmpleo)

        })
    }else if(respuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});


path.get('/v1/estadisticas/valoracionesAspirantes', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")
    
    if(respuesta['statusCode'] == 200){

        Estadisticas.valoracionesAspirante((codigoRespuesta, cuerpoValoracionesAspirantes)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoValoracionesAspirantes)

        })
    }else if(respuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

path.get('/v1/estadisticas/valoracionesEmpleadores', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")
    
    if(respuesta['statusCode'] == 200){

        Estadisticas.valoracionesEmpleador((codigoRespuesta, cuerpoValoracionesEmpleadores)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoValoracionesEmpleadores)

        })
    }else if(respuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

path.get('/v1/estadisticas/ofertasEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Administrador")
    
    if(respuesta['statusCode'] == 200){

        Estadisticas.estadisticasOfertasEmpleo((codigoRespuesta, cuerpoEstadisticasOfertas)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoEstadisticasOfertas)

        })
    }else if(respuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }
});

module.exports = path;