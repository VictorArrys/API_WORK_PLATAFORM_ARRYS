const { Router } = require('express');
const path = Router();
const multer = require('multer');

//Validaciones
const { validarOfertaEmpleo } = require('../../utils/validaciones/validarBody')
const { validarQueryOferta } = require('../../utils/validaciones/validarQuery')
const { validarParamOferta } = require('../../utils/validaciones/validarParam')

//Respuestas
const mensajes = require('../../utils/mensajes');

const { vary } = require('express/lib/response');
const { json } = require('body-parser');
const { GestionOfertasEmpleo } = require('../componentes/GestionOfertasEmpleo/GestionOfertasEmpleo');
const { OfertaEmpleo } = require('../componentes/GestionOfertasEmpleo/modelo/OfertaEmpleo')
const GestionToken = require('../utils/GestionToken');

path.get('/v1/ofertasEmpleo-E', validarQueryOferta, (req, res) => {

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

path.get('/v1/ofertasEmpleo-E/:idOfertaEmpleo', validarParamOferta, (req, res) => {

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

path.get('/v1/ofertasEmpleo-E/:idOfertaEmpleo/fotografia', validarParamOferta, (req,res) => {
    console.log(req.params.idOfertaEmpleo)
    var idOfertaEmpleo = req.params.idOfertaEmpleo
    GestionOfertasEmpleo.getFotografiasOfertaEmpleo(idOfertaEmpleo, (codigoRespuesta, cuerpoFotos)=>{
        res.status(codigoRespuesta)
        res.json(cuerpoFotos)
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
            console.log(cuerpoRespuesta)
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

const multerUpload = multer({storage:multer.memoryStorage(), limits:{fileSize:8*1024*1024*10}})

path.post('/v1/ofertasEmpleo-E/:idOfertaEmpleo/fotografia', multerUpload.single("fotografia"), (req,res) => {
    var fotografia = req.file.buffer
    var idOfertaEmpleo = req.params.idOfertaEmpleo

    GestionOfertasEmpleo.postFotografiaOfertaEmpleo(idOfertaEmpleo, fotografia, (codigoRespuesta, cuerpoRespuesta)=>{
        res.status(codigoRespuesta)
        res.json(cuerpoRespuesta)
    })
    
}); 

path.put('/v1/ofertasEmpleo-E/:idOfertaEmpleo', validarParamOferta, (req, res) => {

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

path.put('/v1/ofertasEmpleo-E/:idOfertaEmpleo/:idFotografia/fotografia', multerUpload.single("fotografia"), (req,res) => {
    var fotografia = req.file.buffer
    const idOfertaEmpleo = req.params.idOfertaEmpleo
    const idFoto = req.params.idFotografia

    GestionOfertasEmpleo.putFotografiaOfertaEmpleo(idOfertaEmpleo,idFoto, fotografia, (codigoRespuesta, cuerpoRespuesta)=>{
        res.status(codigoRespuesta)
        res.json(cuerpoRespuesta)
    })

});   

module.exports = path;