const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');
const mensajes = require('../../utils/mensajes');

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



path.get("/v1/ofertasEmpleo-A", (req, res) => {
    const token = req.headers['x-access-token'];
    const categoriasEmpleo = req.query[categoriasEmpleo];
    var tokenValido = verificarTokenAspirante(token);
    if(tokenValido) {
        var queryConsulta = "SELECT ofEmp.id_oferta_empleo, ofEmp.fecha_inicio, ofEmp.nombre, ofEmp.direccion, ofEmp.cantidad_pago, ofEmp.tipo_pago, ofEmp.dias_laborales, " +
                                    "ofEmp.vacantes - (SELECT COUNT(*) FROM contratacion_empleo_aspirante inner join contratacion_empleo ON id_contratacion_empleo = id_contratacion_empleo_cea WHERE id_oferta_empleo_coe = ofEmp.id_oferta_empleo) as vacantes_disponibles " +
                                "FROM oferta_empleo AS ofEmp INNER JOIN perfil_empleador AS pefEmp " +
                                    "ON (pefEmp.id_perfil_empleador = ofEmp.id_perfil_oe_empleador) " +
                                "INNER JOIN perfil_usuario as pefUs ON (pefUs.id_perfil_usuario = pefEmp.id_perfil_usuario_empleador) " +
                            "WHERE id_categoria_oe IN (?) AND ofEmp.fecha_finalizacion < now();";
        mysqlConnection.query(queryConsulta,[categoriasEmpleo], (error, resultadoConsulta) => {
            if (error) {
                res.status(500);
                res.send(mensajes.errorInterno);
            } else {
                var listaOfertas = [];
                resultadoConsulta.forEach(fila => {
                    var ofertaEmpleo = {};
                    ofertaEmpleo = {
                        "idOfertaEmpleo" : fila['id_oferta_empleo'],
                        "fechaInicio" : fila['fecha_inicio'], 
                        "nombreEmpleo" : fila['nombre'], 
                        "direccion" : fila['direccion'], 
                        "cantidadPago" : fila['cantidad_pago'], 
                        "tipoPago" : fila['tipo_pago'], 
                        "diasLaborales" : fila['dias_laborales'], 
                        "vacantesDisponibles" : fila['vacantes_disponibles']
                    }
                    listaOfertas.push(ofertaEmpleo);
                });
                res.status(200).send(listaOfertas);
            }
        })
    } else {
        res.status(401);
        res.send(mensajes.tokenInvalido);
    }
});

path.get("/v1/ofertasEmpleo-A/:idOfertaEmpleo", (req, res) => {
    const token = req.headers['x-access-token'];
    const categoriasEmpleo = req.query[categoriasEmpleo];
    var tokenValido = verificarTokenAspirante(token);
    if(tokenValido) {
        
    } else {
        res.status(401);
        res.send(mensajes.tokenInvalido);
    }
});




module.exports = path;