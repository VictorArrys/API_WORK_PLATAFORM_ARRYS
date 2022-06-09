const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

//Respuestas
const mensajes = require('../../utils/mensajes')

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
    var respuesta = verifyToken(token)

    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT * FROM deser_el_camello.estadisticas_uso_plataforma;', (error, resultadoEstadisticasUso)=>{
            if(error){ 
                res.status(500)
                res.json(mensajes.errorInterno);
                
            }else if(resultadoEstadisticasUso.length == 0){
    
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                var estadisticas_uso_plataforma = resultadoEstadisticasUso;
                
                res.status(200);                  
                res.json(estadisticas_uso_plataforma);
          
            }
        });
    }else if(respuesta == 401){
        res.status(respuesta)
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
    var respuesta = verifyToken(token)

    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT * FROM deser_el_camello.estadisticas_empleos;', (error, resultadoEstadisticasEmpleos)=>{
            if(error){ 
                res.status(500)
                res.json(mensajes.errorInterno);
                
            }else if(resultadoEstadisticasEmpleos.length == 0){
    
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                var estadisticas_empleos = resultadoEstadisticasEmpleos;
                res.status(200);                  
                res.json(estadisticas_empleos);
          
            }
        });
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});


path.get('/v1/estadisticas/valoracionesAspirantes', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)

    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT * FROM deser_el_camello.valoraciones_aspirantes;', (error, resultadoValoracionesAspirantes)=>{
            if(error){ 
                res.status(500)
                res.json(mensajes.errorInterno);
                
            }else if(resultadoValoracionesAspirantes.length == 0){
    
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                var valoraciones_aspirantes = resultadoValoracionesAspirantes;
                res.status(200);                  
                res.json(valoraciones_aspirantes);
          
            }
        });
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

path.get('/v1/estadisticas/valoracionesEmpleadores', (req, res) => {
      //Creamos la constante del token que recibimos
      const token = req.headers['x-access-token'];
      var respuesta = verifyToken(token)
  
      if(respuesta == 200){
          var pool = mysqlConnection;
  
          pool.query('SELECT * FROM deser_el_camello.valoraciones_empleadores;', (error, resultadoValoracionesEmpleadores)=>{
              if(error){ 
                  res.status(500)
                  res.json(mensajes.errorInterno);
                  
              }else if(resultadoValoracionesEmpleadores.length == 0){
      
                  res.status(404)
                  res.json(mensajes.peticionNoEncontrada);
       
              }else{
                  var valoraciones_empleadores = resultadoValoracionesEmpleadores;
                  res.status(200);                  
                  res.json(valoraciones_empleadores);
            
              }
          });
      }else if(respuesta == 401){
          res.status(respuesta)
          res.json(mensajes.tokenInvalido);
  
      }else{
          res.status(500)
          res.json(mensajes.errorInterno);
          
      }

});

path.get('/v1/estadisticas/ofertasEmpleo', (req, res) => {
        //Creamos la constante del token que recibimos
        const token = req.headers['x-access-token'];
        var respuesta = verifyToken(token)
    
        if(respuesta == 200){
            var pool = mysqlConnection;
    
            pool.query('SELECT * FROM deser_el_camello.estadisticas_ofertas_empleo;', (error, resultadoEstadisticasOfertasEmpleo)=>{
                if(error){ 
                    res.status(500)
                    res.json(mensajes.errorInterno);
                    
                }else if(resultadoEstadisticasOfertasEmpleo.length == 0){
        
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada);
         
                }else{
                    var estadisticas_ofertas_empleo = resultadoEstadisticasOfertasEmpleo;
                    res.status(200);                  
                    res.json(estadisticas_ofertas_empleo);
              
                }
            });
        }else if(respuesta == 401){
            res.status(respuesta)
            res.json(mensajes.tokenInvalido);
    
        }else{
            res.status(500)
            res.json(mensajes.errorInterno);
            
        }

});

module.exports = path;