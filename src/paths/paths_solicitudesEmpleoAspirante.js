const { Router } = require('express');
const path = Router();
const mensajes = require('../../utils/mensajes');

const GestionToken = require('../utils/GestionToken');
const { GestionSolicitudesEmpleo } = require('../componentes/GestionSolcitudesEmpleo/GestionSolicitudesEmpleo');


path.post("/v1/ofertasEmpleo-A/:idOfertaEmpleo/solicitarVacante", (req, res)=>{
    const token = req.headers['x-access-token'];
    
    var idPerfilAspirante = req.body['idPerfilAspirante'];
    var idOfertaEmpleo = req.params['idOfertaEmpleo'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200 && validacionToken.tokenData['estatus'] == 1) {
        GestionSolicitudesEmpleo.postSolicitarVancante(idOfertaEmpleo, idPerfilAspirante, (codigoRespuesta, cuerpoRespuesta)=> {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        })
    }else if (validacionToken.tokenData['estatus'] == 2){
        res.status(403).json(mensajes.prohibido)
    } else {
        res.status(validacionToken.statusCode).json(mensajes.tokenInvalido);
    }    
});

module.exports = path;