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
            }else if(resultadoReportesEmpleo.length == 0){
    
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


//Aspirante

path.post('/v1/reportesEmpleo', (req, res) => {
    const token = req.headers['x-access-token'];
    var idOfertaEmpleo = req.body['idOfertaEmpleo'];
    var estatus = 1;
    var contenidoReporte = req.body['motivo'];
    var idAspirante = req.body['idAspirante'];
    
    var respuesta = verifyToken(token, 'Aspirante');

    if(respuesta == 200){
        var queryOfertaEmpleo = "select count(id_reporte_empleo) AS estaRegistrada FROM reporte_empleo where id_reporte_empleo = ?;";
        //Confirmar que existe la oferta

        mysqlConnection.query(queryOfertaEmpleo, [idOfertaEmpleo], (error, resultado) => {
            if(error) {
                res.json(mensajes.errorInterno);
                res.status(500)
            } else {
                if(resultado[0]['estaRegistrada'] == 0) {
                    res.json(mensajes.peticionIncorrecta);
                    res.status(404);
                } else {
                    var queryReporte = "INSERT INTO reporte_empleo (id_perfil_aspirante_re, id_oferta_empleo_re, motivo, estatus, fecha_registro) VALUES (?, ?, ?, ?, NOW());"
                    mysqlConnection.query(queryReporte, [idAspirante, idOfertaEmpleo, contenidoReporte, estatus], (error, resultado)=> {
                        if(error) {
                            res.json(mensajes.errorInterno);
                            res.status(500)
                        } else {
                            var idNuevoReporte = resultado.insertId;
                            var queryConsulta = "select * from reporte_empleo where id_reporte_empleo = ?";
                            mysqlConnection.query(queryConsulta, [idNuevoReporte], (error, resultadoConsulta) => {
                                if (error) {

                                } else {
                                    var nuevoReporte = {};
                                    nuevoReporte = {
                                        "idReporteEmpleo": resultadoConsulta[0]['id_reporte_empleo'],
                                        "idOfertaEmpleo": resultadoConsulta[0]['id_oferta_empleo_re'],
                                        "idAspirante" : resultadoConsulta[0]['id_perfil_aspirante_re'],
                                        "estatus": resultadoConsulta[0]['estatus'],
                                        "fechaRegistro": resultadoConsulta[0]['fecha_registro'],
                                        "motivo": resultadoConsulta[0]['motivo']
                                    };

                                    res.status(201);
                                    res.json(nuevoReporte);
                                }
                            });
                        }
                    });
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

module.exports = path;