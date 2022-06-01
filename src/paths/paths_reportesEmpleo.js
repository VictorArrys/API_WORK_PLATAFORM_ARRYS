const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

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
    var respuesta = verifyToken(token, 'Administrador')

    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT * FROM reporte_empleo WHERE estatus = 1;', (error, resultadoReportesEmpleo)=>{
            if(error){ 
                res.json(mensajes.errorInterno);
                res.status(500)
            }else if(resultadoReportesEmpleo    .length == 0){
    
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                
                var reportesEmpleo = resultadoReportesEmpleo;
                res.status(200);                  
                res.json(reportesEmpleo);            
    
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

path.get('/v1/reportesEmpleo/:idReporteEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token, 'Administrador')

    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT * FROM reporte_empleo WHERE id_reporte_empleo = ?;',[req.params.idReporteEmpleo] , (error, resultadoReporteEmpleo)=>{
            if(error){ 
                res.json(mensajes.errorInterno);
                res.status(500)
            }else if(resultadoReporteEmpleo[0].length == 0){
    
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                
                var reporteEmpleo = resultadoReporteEmpleo[0];
                
                //Caso que el reporte ya fue atendido
                if(reporteEmpleo['estatus'] == 0){
                    res.status(400)
                    res.json(mensajes.peticionIncorrecta);
                //Caso que el reporte fue rechazado
                }else if(reporteEmpleo['estatus'] == -1){
                    res.status(400)
                    res.json(mensajes.peticionIncorrecta);
                //El reporte esta pendiente
                }else if(reporteEmpleo['estatus'] == 1){
                    res.status(200);                  
                    res.json(reporteEmpleo);  

                }else{
                    res.status(400)
                    res.json(mensajes.peticionIncorrecta);
                }          
    
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

path.patch('/v1/reportesEmpleo/:idReporteEmpleo/aceptado', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token, 'Administrador')

    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('SELECT * FROM reporte_empleo WHERE id_reporte_empleo = ?;',[req.params.idReporteEmpleo] , (error, resultadoReporteEmpleo)=>{
            if(error){ 
                res.json(mensajes.errorInterno);
                res.status(500)
            }else if(resultadoReporteEmpleo[0].length == 0){
    
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                
                var reporteEmpleo = resultadoReporteEmpleo[0];
                
                //Caso que el reporte ya fue atendido
                if(reporteEmpleo['estatus'] == 0){
                    res.status(400)
                    res.json(mensajes.peticionIncorrecta);
                //Caso que el reporte fue rechazado
                }else if(reporteEmpleo['estatus'] == -1){
                    res.status(400)
                    res.json(mensajes.peticionIncorrecta);
                //El reporte esta pendiente
                }else if(reporteEmpleo['estatus'] == 1){

                    pool.query('UPDATE reporte_empleo SET estatus = 0 WHERE id_oferta_empleo_re = ?;',[reporteEmpleo['id_oferta_empleo_re']] , (error, resultadoReporteEmpleo)=>{
                        if(error){ 
                            res.json(mensajes.errorInterno);
                            res.status(500)
                        }else if(resultadoReporteEmpleo.length == 0){
                            res.status(404)
                            res.json(mensajes.peticionNoEncontrada);
                
                        }else{

                            res.sendStatus(204);                     
                
                        }
                    });

                }else{
                    res.status(400)
                    res.json(mensajes.peticionIncorrecta);
                }          
    
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


path.patch('/v1/reportesEmpleo/:idReporteEmpleo/rechazado', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token, 'Administrador')

    if(respuesta == 200){
        var pool = mysqlConnection;

        pool.query('UPDATE reporte_empleo SET estatus = -1 WHERE id_reporte_empleo = ?;',[req.params.idReporteEmpleo] , (error, resultadoReporteEmpleo)=>{
            if(error){ 
                res.json(mensajes.errorInterno);
                res.status(500)
            }else if(resultadoReporteEmpleo.length == 0){
    
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
     
            }else{
                res.sendStatus(204);                     
    
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