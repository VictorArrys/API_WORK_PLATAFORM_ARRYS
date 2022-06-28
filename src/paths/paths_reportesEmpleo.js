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
    var idOfertaEmpleo = req.body['idOfertaEmpleo'];
    var estatus = 1;
    var contenidoReporte = req.body['motivo'];
    var idAspirante = req.body['idPerfilAspirante'];
    
    var respuesta = verifyToken(token, 'Aspirante');

    if(respuesta == 200){
        var queryOfertaEmpleo = "select count(id_reporte_empleo) AS estaRegistrada FROM reporte_empleo where id_oferta_empleo_re = ? AND id_perfil_aspirante_re = ?;";
        //Confirmar que existe la oferta

        mysqlConnection.query(queryOfertaEmpleo, [idOfertaEmpleo, idAspirante], (error, resultado) => {
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