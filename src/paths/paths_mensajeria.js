const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const mensajes = require('../../utils/mensajes');

const GestionToken = require('../utils/GestionToken');
const { Mensajeria } = require('../componentes/Mensajeria/Mensajeria');
const { MensajeDAO } = require('../componentes/Mensajeria/data/MensajeDAO');
const { ConversacionDAO } = require('../componentes/Mensajeria/data/ConversacionDAO');


//Valida que el token le pertenezca al administrador
function verifyTokenEmpleador(token, idPerfilEmpleador) {
    try{
        const tokenData = jwt.verify(token, keys.key);
        if (tokenData['tipo'] == "Empleador")
            return true;
        else
            return false;
    } catch (error) {
        return false;
    }
}

//Verfica que el token le pertenest
function verifyTokenDemandante(token, idPerfilDemandante) {
    try{
        const tokenData = jwt.verify(token, keys.key);
        if (tokenData['tipo'] == "Demandante")
            return true;
        else
            return false;
    } catch (error) {
        return false;
    }
}

function verifyTokenAspirante(token, idPerfilAspirante) {
    try{
        const tokenData = jwt.verify(token, keys.key);
        if (tokenData['tipo'] == "Aspirante")
            return true;
        else
            return false;
    } catch (error) {
        return false;
    }
}


//Consulta de conversaciones
path.get('/v1/perfilDemandantes/:idPerfilDemandante/conversaciones', (req, res) => {
    const token = req.headers['x-access-token'];
    const idPerfilDemandante = req.params['idPerfilDemandante']

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Demandante");

    if( validacionToken.statusCode == 200) {
        Mensajeria.getConversacionesDemandante(idPerfilDemandante, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

//Consulta de una conversación
path.get("/v1/perfilDemandantes/:idPerfilDemandante/conversaciones/:idConversacion",(req, res) => {
    const token = req.headers['x-access-token'];
    const idPerfilDemandante = req.params['idPerfilDemandante']
    const idConversacion = req.params['idConversacion']

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Demandante");

    if( validacionToken.statusCode == 200) {
        Mensajeria.getConversacionDemandante(idPerfilDemandante, idConversacion, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.post("/v1/perfilDemandantes/:idPerfilDemandante/conversaciones/:idConversacion", (req, res) => {
    const token = req.headers['x-access-token'];
    const idPerfilDemandante = req.params['idPerfilDemandante']
    const idConversacion = req.params['idConversacion']
    const mensaje =  req.body["mensaje"];
    
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Demandante");

    if( validacionToken.statusCode == 200) {
        Mensajeria.postMensajeDemandante(idPerfilDemandante, idConversacion, mensaje, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilEmpleadores/:idPerfilEmpleador/conversaciones", (req, res) => {
    const token = req.headers['x-access-token'];
    const idPerfilEmpleador = req.params['idPerfilEmpleador'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Empleador");

    if( validacionToken.statusCode == 200) {
        ConversacionDAO.getConversacionesEmpleador(idPerfilEmpleador, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta) 
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilEmpleadores/:idPerfilEmpleador/conversaciones/:idConversacion", (req, res) => {
    const token = req.headers['x-access-token'];
    const idPerfilEmpleador = req.params['idPerfilEmpleador'];
    const idConversacion = req.params['idConversacion'];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Empleador");

    if( validacionToken.statusCode == 200) {
        ConversacionDAO.getConversacionEmpleador(idPerfilEmpleador, idConversacion, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.post("/v1/perfilEmpleadores/:idPerfilEmpleador/conversaciones/:idConversacion", (req, res)=>{
    const token = req.headers['x-access-token'];
    const idPerfilEmpleador = req.params['idPerfilEmpleador']
    const idConversacion = req.params['idConversacion']
    const mensaje =  req.body["mensaje"];
    
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Empleador");
    if (validacionToken.statusCode == 200) {
        MensajeDAO.postMensajeEmpleador(idPerfilEmpleador, idConversacion, mensaje, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        })
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilAspirantes/:idPerfilAspirante/conversaciones", (req, res)=>{
    const token = req.headers['x-access-token'];
    const idPerfilAspirante = req.params['idPerfilAspirante']

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if( validacionToken.statusCode == 200) {
        Mensajeria.getConversacionesAspirante(idPerfilAspirante, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilAspirantes/:idPerfilAspirante/conversaciones/:idConversacion", (req, res) => {
    const token = req.headers['x-access-token'];
    idPerfilAspirante =  req.params['idPerfilAspirante'];
    idConversacion = req.params['idConversacion'];

    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token,"Aspirante");
    if (validacionToken.statusCode == 200) {
        Mensajeria.getConversacionAspirante(idPerfilAspirante, idConversacion, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        console.log("token invalidado")
        res.status(401).send(mensajes.tokenInvalido);
    }
});

path.post("/v1/perfilAspirantes/:idPerfilAspirante/conversaciones/:idConversacion", (req, res) => {
    const token = req.headers['x-access-token'];
    const idPerfilAspirante = req.params['idPerfilAspirante']
    const idConversacion = req.params['idConversacion']
    const mensaje =  req.body["mensaje"];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");
    if (validacionToken.statusCode == 200) {
        MensajeDAO.postMensajeAspirante(idPerfilAspirante, idConversacion, mensaje, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        })
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

module.exports = path;