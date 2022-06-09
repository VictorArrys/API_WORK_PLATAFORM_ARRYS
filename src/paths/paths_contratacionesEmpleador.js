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


function existeContratacion(idOfertaEmpleo, res){
    var pool = mysqlConnection

    pool.query('SELECT * contratacion_empleo WHERE id_oferta_empleo_coe = ?;',[idOfertaEmpleo] , (error, existeContratacion)=>{
        if(error){
            res.status(500) 
            res.json(mensajes.errorInterno);

        }else if(existeContratacion.length == 0){
                     
            console.log('No existe la contratación')
            res.status(404)
            res.json(mensajes.peticionNoEncontrada);

        }else{ //En caso de existir la contratación solo agregamos el aspirante a ella
           
            return existeContratacion
        }

    });  

}


function consultarContrataciones(idContratacionEmpleo, res){
    var pool = mysqlConnection

    pool.query('SELECT * FROM contratacion_empleo_aspirante INNER JOIN perfil_aspirante ON perfil_aspirante.id_perfil_aspirante = contratacion_empleo_aspirante.id_aspirante_cea WHERE id_contratacion_empleo_cea = ?',[idContratacionEmpleo] , (error, resultadoContratacionesAspirante)=>{
        if(error){ 
            res.json(mensajes.errorInterno);
            res.status(500)
        }else if(resultadoContratacionesAspirante.length == 0){

            console.log('No se pudo obtener la contratación aspirante')
            res.status(404)
            res.json(mensajes.peticionNoEncontrada);     

        }else{
            const contratacionEmpleoAspirante = resultadoContratacionesAspirante
            console.log('Se ha consultado correctamente las contrataciones: ' + `${contratacionEmpleoAspirante}`)
            return contratacionEmpleoAspirante  
        }

    });
}

path.get('/v1/contratacionesEmpleo/:idOfertaEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token, 'Empleador')

    if(respuesta == 200){

        //Obtenemos la contratación
        const contratacionEmpleo = existeContratacion(req.params.idOfertaEmpleo, res)
        if(!contratacionEmpleo == null){
            //Obtener la lista de las contrataciones de aspirantes
            const contratacionesAspirante = consultarContrataciones(contratacionEmpleo['id_contratacion_empleo'], res)

            if(!contratacionesAspirante == null){

                console.log(contratacionesAspirante)
                res.status(200)
                res.json(contratacionesAspirante)
            }else{
                res.status(404)
                res.json(mensajes.peticionNoEncontrada);
            }

        }else{
            res.status(404)
            res.json(mensajes.peticionNoEncontrada);
        }
       
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

path.patch('/v1/contratacionesEmpleo/:idOfertaEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token, 'Administrador')

    if(respuesta == 200){
       
        //Obtenemos la contratación
        const contratacionEmpleo = existeContratacion(req.params.idOfertaEmpleo, res)
        if(!contratacionEmpleo == null){
            //Agregar valoración del aspirante en caso de existir la contratación
            var pool = mysqlConnection

            //Obtener datos del body
            var idAspirante = req.query.idAspirante
            var valoracionAspirante = req.body.valoracionAspirante
            var idOfertaEmpleo = req.params.idOfertaEmpleo

            pool.query('UPDATE contratacion_empleo_aspirante SET valoracion_aspirante = ? WHERE id_perfil_aspirante_cea = ? AND id_contratacion_empleo_cea = ?;',[valoracionAspirante, idAspirante, idOfertaEmpleo] , (error, resultadoEvaluacionAspirante)=>{
                if(error){ 
                    
                    res.json(mensajes.errorInterno);
                    res.status(500)
                }else if(resultadoEvaluacionAspirante.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada);
        
                }else{

                    res.status(200)
                    res.json(resultadoEvaluacionAspirante)                   
        
                }
            });

        }else{
            res.status(404)
            res.json(mensajes.peticionNoEncontrada);
        }

        
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

module.exports = path;
