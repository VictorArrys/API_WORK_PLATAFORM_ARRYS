const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const multer = require('multer');

//Validaciones
const { validarOfertaEmpleo } = require('../../utils/validaciones/validarBody')
const { validarQuery } = require('../../utils/validaciones/validarQuery')
const { validarParamId } = require('../../utils/validaciones/validarParam')

//Respuestas
const mensajes = require('../../utils/mensajes');
const { vary } = require('express/lib/response');
const { json } = require('body-parser');
const { GestionOfertasEmpleo } = require('../componentes/GestionOfertasEmpleo');
const { OfertaEmpleo } = require('../componentes/GestionOfertasEmpleo/modelo/OfertaEmpleo')
const GestionToken = require('../utils/GestionToken');


//Función para verificar el token
function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
  
        if (tokenData["tipo"] == "Empleador") {
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

function esctructurarJSON(ofertaEmpleo,categoriaEmpleo , contratacionOfertaEmpleo){
    
    const ofertaEmpleoJson = {}

    ofertaEmpleoJson['application/json'] = {
        'cantidadPago': ofertaEmpleo['cantidad_pago'],
        'descripcion': ofertaEmpleo['descripcion'],
        'diasLaborales': ofertaEmpleo['dias_laborales'],
        'direccion': ofertaEmpleo['direccion'],
        'fechaDeFinalizacion': ofertaEmpleo['fecha_finalizacion'],
        'fechaDeIinicio': ofertaEmpleo['fecha_inicio'],
        'horaFin': ofertaEmpleo['hora_fin'],
        'horaInicio': ofertaEmpleo['hora_inicio'],
        'idCategoriaEmpleo': ofertaEmpleo['id_categoria_oe'],
        'categoriaEmpleo': categoriaEmpleo,
        'nombre': ofertaEmpleo['nombre'],
        'tipoPago': ofertaEmpleo['tipo_pago'],
        'vacantes': ofertaEmpleo['vacantes'],
        'idOfertaEmpleo': ofertaEmpleo['id_oferta_empleo'],
        'idPerfilEmpleador': ofertaEmpleo['id_perfil_oe_empleador'],
        'contratacion': contratacionOfertaEmpleo
    }

    console.log(ofertaEmpleoJson)

    return ofertaEmpleoJson

}



path.get('/v1/ofertasEmpleo-E', validarQuery, (req, res) => {

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200){
        var idUsuario = respuesta['tokenData']['idUsuario']

        GestionOfertasEmpleo.getOfertasEmpleo(req.query.idPerfilEmpleador, idUsuario, (codigoRespuesta, cuerpoRespuestaOferta)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoRespuestaOferta)

        })
    }else if(resprespuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});

function consoleError(error, ubicacion){
    console.log('--------------------------------------------------------------------------------------')
    console.log('Se ha presentado un problema en: ' + ubicacion)
    console.log('Error(es): ' + error)
    console.log('--------------------------------------------------------------------------------------')
}

function getFotos(idOfertaEmpleo, res, callback){

    var pool = mysqlConnection;

        pool.query('SELECT * FROM fotografia WHERE id_oferta_empleo_fotografia = ?;', [idOfertaEmpleo], (error, resultadoFotografias)=>{
            
            if(error){ 
                consoleError(error, 'GET: /v1/ofertasEmpleo-E:idOfertaEmpleo/fotografias Paso: 1era query mysql')
                
                res.status(500)
                res.json(mensajes.errorInterno);
                
            }else if(resultadoFotografias.length == 0){
                
                callback([])
            }else{
                var arrayFotografia1 = null
                arrayFotografia1 = Uint8ClampedArray.from(Buffer.from(resultadoFotografias[0]['imagen'].buffer, 'base64'))
                
                /*resultadoFotografias[0]['imagen'].forEach(element => {
                    arrayFotografia1.push(element)

                });*/
                
                var arrayFotografia2 = null
                arrayFotografia2 = Uint8ClampedArray.from(Buffer.from(resultadoFotografias[1]['imagen'].buffer, 'base64'))
                
                /*resultadoFotografias[1]['imagen'].forEach(element => {
                    arrayFotografia2.push(element)
                    
                });*/
                
                var arrayFotografia3 = null
                arrayFotografia3 = Uint8ClampedArray.from(Buffer.from(resultadoFotografias[2]['imagen'].buffer, 'base64'))
                
               /* resultadoFotografias[2]['imagen'].forEach(element => {
                    arrayFotografia3.push(element)
                    
                });*/

                var foto1 = {}
                foto1={
                    'idFoto': resultadoFotografias[0]['id_fotografia'],
                    'imagen': arrayFotografia1
                }
                var foto2 = {}
                foto2 = {
                    'idFoto': resultadoFotografias[1]['id_fotografia'],
                    'imagen': arrayFotografia2
                }
                var foto3 = {}
                foto3 = {
                    'idFoto': resultadoFotografias[2]['id_fotografia'],
                    'imagen': arrayFotografia3
                }

                var fotografiasJson = []

                fotografiasJson= [
                    foto1,
                    foto2,
                    foto3
                ]

                console.log(fotografiasJson)
                callback(fotografiasJson)
            }

    
        });


}

path.get('/v1/ofertasEmpleo-E/:idOfertaEmpleo', validarParamId, (req, res) => {

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200){
        var idOfertaEmpleo = req.params.idOfertaEmpleo
        var idUsuario = respuesta['tokenData']['idUsuario']

        GestionOfertasEmpleo.getOfertaEmpleo(idOfertaEmpleo, idUsuario, function(codigoRespuesta, cuerpoRespuestaOferta){
            console.log(cuerpoRespuestaOferta)
            res.status(codigoRespuesta)
            res.json(cuerpoRespuestaOferta)

        })

    }else if(respuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
       
    }


});

path.get('/v1/ofertasEmpleo-E/:idOfertaEmpleo/fotografia', (req,res) => {

    var idOfertaEmpleo = req.params.idOfertaEmpleo
    GestionOfertasEmpleo.getFotografiasOfertaEmpleo(idOfertaEmpleo, function(codigoRespuesta, cuerpoFotos){
        res.status(codigoRespuesta)
        res.json(cuerpoFotos)
    })

});    

const multerUpload = multer({storage:multer.memoryStorage(), limits:{fileSize:8*1024*1024*10}})

path.post('/v1/ofertasEmpleo-E/:idOfertaEmpleo/fotografia', multerUpload.single("fotografia"), (req,res) => {
    var fotografia = req.file.buffer
    var idOfertaEmpleo = req.params.idOfertaEmpleo

    GestionOfertasEmpleo.postFotografiaOfertaEmpleo(idOfertaEmpleo, fotografia, (codigoRespuesta, cuerpoRespuesta)=>{
        res.status(codigoRespuesta)
        res.json(cuerpoRespuesta)
    })
    
});     

path.post('/v1/ofertasEmpleo-E', validarOfertaEmpleo, (req, res) => {

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200){

        console.log(req.body)

        var idEmpleador = req.body.idPerfilEmpleador
        var ofertaEmpleoNueva = new OfertaEmpleo();

        ofertaEmpleoNueva.idCategoriaEmpleo = req.body.idCategoriaEmpleo 
        ofertaEmpleoNueva.nombre = req.body.nombre
        ofertaEmpleoNueva.descripcion = req.body.descripcion
        ofertaEmpleoNueva.vacantes = req.body.vacantes
        ofertaEmpleoNueva.diasLaborales = req.body.diasLaborales
        ofertaEmpleoNueva.tipoPago = req.body.tipoPago
        ofertaEmpleoNueva.cantidadPago = req.body.cantidadPago
        ofertaEmpleoNueva.direccion = req.body.direccion
        ofertaEmpleoNueva.horaInicio = req.body.horaInicio 
        ofertaEmpleoNueva.horaFin = req.body.horaFin
        ofertaEmpleoNueva.fechaDeIinicio = req.body.fechaDeIinicio 
        ofertaEmpleoNueva.fechaDeFinalizacion = req.body.fechaDeFinalizacion

        GestionOfertasEmpleo.postOfertaEmpleo(idEmpleador, ofertaEmpleoNueva, (codigoRespuesta, cuerpoRespuesta)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoRespuesta)

        })

            
    }else if(respuesta['statusCode'] == 401){
        res.status(respuesta['statusCode'])
        res.json(mensajes.tokenInvalido);
    
    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
           
    }
});

path.put('/v1/ofertasEmpleo-E/:idOfertaEmpleo/:idFotografia/fotografia', multerUpload.single("fotografia"), (req,res) => {

    var query = "UPDATE fotografia SET imagen = ? WHERE id_oferta_empleo_fotografia = ? AND id_fotografia = ?;"
    const idOfertaEmpleo = req.params.idOfertaEmpleo
    const idFoto = req.params.idFotografia
    mysqlConnection.query(query, [req.file.buffer, idOfertaEmpleo, idFoto], (error, resultadoFotografia) => {
        if (error){
            console.log('Error debido a: ')
            console.log(error.message)            
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if(resultadoFotografia.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            console.log('Actualización de foto de la oferta exitoso')
            res.status(200)
            res.json(mensajes.actualizacionExitosa)
        }
    })
});   


path.put('/v1/ofertasEmpleo-E/:idOfertaEmpleo', (req, res) => {

    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    
    var respuesta = GestionToken.ValidarTokenTipoUsuario(token, "Empleador")
    
    if(respuesta['statusCode'] == 200){
        var idUsuario = respuesta['tokenData']['idUsuario']

        var ofertaEmpleoEdicion = new OfertaEmpleo();

        ofertaEmpleoEdicion.idCategoriaEmpleo = req.body.idCategoriaEmpleo 
        ofertaEmpleoEdicion.nombre = req.body.nombre
        ofertaEmpleoEdicion.descripcion = req.body.descripcion
        ofertaEmpleoEdicion.vacantes = req.body.vacantes
        ofertaEmpleoEdicion.diasLaborales = req.body.diasLaborales
        ofertaEmpleoEdicion.tipoPago = req.body.tipoPago
        ofertaEmpleoEdicion.cantidadPago = req.body.cantidadPago
        ofertaEmpleoEdicion.direccion = req.body.direccion
        ofertaEmpleoEdicion.horaInicio = req.body.horaInicio 
        ofertaEmpleoEdicion.horaFin = req.body.horaFin
        ofertaEmpleoEdicion.fechaDeIinicio = req.body.fechaDeIinicio 
        ofertaEmpleoEdicion.fechaDeFinalizacion = req.body.fechaDeFinalizacion
        ofertaEmpleoEdicion.idPerfilEmpleador = req.body.idPerfilEmpleador
        ofertaEmpleoEdicion.idOfertaEmpleo = req.params.idOfertaEmpleo

        GestionOfertasEmpleo.putOfertaEmpleo(ofertaEmpleoEdicion, idUsuario, (codigoRespuesta, cuerpoRespuesta)=>{
            
            res.status(codigoRespuesta)
            res.json(cuerpoRespuesta['application/json'])

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