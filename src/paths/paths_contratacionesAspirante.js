const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const mensajes = require('../../utils/mensajes');

const {GestionServicios} = require('../componentes/GestionServicios')

const GestionToken = require('../utils/GestionToken');

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


path.get("/v1/perfilAspirantes/:idPerfilAspirante/contratacionesServicios", (req, res) => {
    var idAspirante = req.params['idPerfilAspirante'];
    
    const token = req.headers['x-access-token'];
    var validacionToken = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");

    if (validacionToken.statusCode == 200  && validacionToken.tokenData['estatus'] == 1) {
        GestionServicios.getContratacionesServicioAspirante(idAspirante, (codigoRespuesta, cuerpoRespuesta) => {
            res.status(codigoRespuesta).json(cuerpoRespuesta);
        });
    } else {
        res.status(validacionToken.statusCode).send(mensajes.tokenInvalido);
    }
});



path.get("/v1/perfilAspirantes/:idPerfilAspirante/contratacionesEmpleo", (req, res) => {
    var idAspirante = req.params['idPerfilAspirante'];
    const token = req.headers['x-access-token'];
    

    var tokenValido = verifyTokenAspirante(token);

    if (tokenValido) {
        var query = "select conEmp.id_contratacion_empleo as idContratacionEmpleo, conEmp.estatus, date_format(conEmp.fecha_contratacion, \"%Y-%m-%d\") as fechaContratacion, date_format(conEmp.fecha_finalizacion, \"%Y-%m-%d\") as fechaFinalizacion ,  ofertaEmp.* from contratacion_empleo as conEmp inner join contratacion_empleo_aspirante as conEmpAsp  on conEmp.id_contratacion_empleo = conEmpAsp.id_contratacion_empleo_cea inner join  ( select ofEmp.id_oferta_empleo as idOfertaEmpleo, ofEmp.nombre as nombreEmpleo, pefEmp.nombre as nombreEmpleador  from oferta_empleo as ofEmp inner join perfil_empleador as pefEmp  on ofEmp.id_perfil_oe_empleador = pefEmp.id_perfil_empleador ) as ofertaEmp  on ofertaEmp.idOfertaEmpleo = conEmp.id_oferta_empleo_coe where conEmpAsp.id_perfil_aspirante_cea = ?;";
        mysqlConnection.query(query, [idAspirante], (error, resultadoConsulta) => {
            if(error){ 
                res.status(500)
                res.send({msg: error.message})
            } else {
                var listaContratacionesEmpleo = [];
                resultadoConsulta.forEach(fila => {
                    var contratacionEmpleo = {};
                    contratacionEmpleo = {
                        "idContratacionEmpleo": fila['idContratacionEmpleo'],
                        "idOfertaEmpleo": fila['idOfertaEmpleo'],
                        "nombreOfertaEmpleo": fila['nombreEmpleo'],
                        "nombreEmpleador": fila['nombreEmpleador'],
                        "estatus": fila['estatus'],
                        "fechaContratacion": fila['fechaContratacion'],
                        "fechaFinalizacion": fila['fechaFinalizacion']
                    }
                    listaContratacionesEmpleo.push(contratacionEmpleo);
                });
                res.status(200).send(listaContratacionesEmpleo);
            }
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilAspirantes/:idPerfilAspirante/contratacionesEmpleo/:idContratacionEmpleoAspirante", (req, res) => {
    var idAspirante = req.params['idPerfilAspirante'];
    var idContratacionEmpleo = req.params['idContratacionEmpleoAspirante'];
    const token = req.headers['x-access-token'];
    var tokenValido = verifyTokenAspirante(token);
    if(tokenValido) {
        var queryContratacion = `select conEmp.id_contratacion_empleo as idContratacionEmpleo, conEmp.estatus, date_format(conEmp.fecha_contratacion, "%Y-%m-%d") as fechaContratacion, date_format(conEmp.fecha_finalizacion, "%Y-%m-%d") as fechaFinalizacion ,  ofertaEmp.* from contratacion_empleo as conEmp inner join contratacion_empleo_aspirante as conEmpAsp on conEmp.id_contratacion_empleo = conEmpAsp.id_contratacion_empleo_cea inner join (select ofEmp.id_oferta_empleo as idOfertaEmpleo, ofEmp.nombre as nombreEmpleo, pefEmp.nombre as nombreEmpleador, catEmp.nombre as categoriaEmpleo, ofEmp.direccion, ofEmp.dias_laborales as diasLaborales, ofEmp.tipo_pago as tipoPago, ofEmp.cantidad_pago as cantidadPago, ofEmp.descripcion, ofEmp.hora_inicio, ofEmp.hora_fin from oferta_empleo as ofEmp inner join perfil_empleador as pefEmp on ofEmp.id_perfil_oe_empleador = pefEmp.id_perfil_empleador inner join categoria_empleo as catEmp on catEmp.id_categoria_empleo = ofEmp.id_categoria_oe ) as ofertaEmp on ofertaEmp.idOfertaEmpleo = conEmp.id_oferta_empleo_coe where conEmpAsp.id_perfil_aspirante_cea = ${idAspirante} AND conEmp.id_contratacion_empleo = ${idContratacionEmpleo};`
        mysqlConnection.query(queryContratacion, (error, resultadoConsulta) => {
            if (error) {
                res.status(500)
                res.json(mensajes.errorInterno);
            } else {
                var contratacionEmpleo = {}
                if (resultadoConsulta.length == 1) {
                    var consultaContratacion = resultadoConsulta[0];
                    contratacionEmpleo = {
                        "idContratacion" : consultaContratacion['idContratacionEmpleo'],
                        "estatus": consultaContratacion['estatus'],
                        "nombreEmpleo": consultaContratacion['nombreEmpleo'],
                        "categoriaEmpleo": consultaContratacion['categoriaEmpleo'],
                        "direccion": consultaContratacion['direccion'],
                        "diasLaborales": consultaContratacion['diasLaborales'],
                        "horaInicio": consultaContratacion['hora_inicio'],
                        "horaFin": consultaContratacion['hora_fin'],
                        "tipoPago": consultaContratacion['tipoPago'], 
                        "cantidadPago": consultaContratacion['cantidadPago'],
                        "fechaContratacion": consultaContratacion['fechaContratacion'],
                        "fechaFinalizacion": consultaContratacion['fechaFinalizacion'],
                        "descripcion": consultaContratacion['descripcion'],
                    }
                }
                res.status(200).send(contratacionEmpleo);
            }
        });
    } else {
        res.status(401);
        res.send(mensajes.tokenInvalido);
    }
});

//Creamos la contratacion
//Estatus de la contratación {1: En curso, 0: Terminada}
path.patch("/v1//perfilAspirantes/:idPerfilAspirante/contratacionesEmpleo/:idContratacionEmpleoAspirante/evaluarEmpleador", (req, res) => {
    const idAspirante = req.params['idPerfilAspirante'];
    const idContratacionEmpleo = req.params['idContratacionEmpleoAspirante'];
    const puntuacion = req.body['puntuacion'];
    const token = req.headers['x-access-token'];
    var tokenValido = verifyTokenAspirante(token);
    if(tokenValido) {
        var queryComprobacion = "SELECT if(count(*) = 1, true, false) AS esEvaluable FROM contratacion_empleo AS conEmp INNER JOIN contratacion_empleo_aspirante AS conEmpAsp ON (conEmp.id_contratacion_empleo = conEmpAsp.id_contratacion_empleo_cea) WHERE (conEmpAsp.id_perfil_aspirante_cea = ? AND conEmpAsp.id_contratacion_empleo_cea = ?) AND estatus = 0;";
        mysqlConnection.query(queryComprobacion, [idAspirante, idContratacionEmpleo], (error, resultadoComprobacion) => {
            if (error) {
                res.status(500).send(mensajes.errorInterno);
            } else {
                if(resultadoComprobacion[0]['esEvaluable'] == 1) {
                    var queryEvaluacion = "UPDATE contratacion_empleo_aspirante SET valoracion_empleador = ? WHERE ?;"
                    mysqlConnection.query(que)
                } else {
                    res.status(409).send(mensajes.evaluacionDeEmpleadorDenegada);
                }
            }
        });
    } else {
        res.status(401);
        res.send(mensajes.tokenInvalido);
    }
});

module.exports = path;