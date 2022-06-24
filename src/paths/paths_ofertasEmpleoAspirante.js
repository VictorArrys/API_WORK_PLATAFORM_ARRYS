const { Router, query } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');
const mensajes = require('../../utils/mensajes');

const {ValidarCategorias} = require('../../utils/validaciones/ofertaEmpleoAspirante')

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

path.get("/v1/ofertasEmpleo-A", ValidarCategorias, (req, res) => {
    const token = req.headers['x-access-token'];
    const categoriasEmpleo = req.query['categoriasEmpleo'];
    var tokenValido = GestionToken.ValidarTokenTipoUsuario(token, "Aspirante");
    if(tokenValido.statusCode == 200) {
        var queryConsulta = `SELECT ofEmp.id_oferta_empleo, date_format(fecha_inicio, \"%Y-%m-%d\") as fecha_inicio, ofEmp.nombre, ofEmp.direccion, ofEmp.cantidad_pago, ofEmp.tipo_pago, ofEmp.dias_laborales, ofEmp.vacantes, date_format(fecha_finalizacion, \"%Y-%m-%d\") as fecha_finalizacion FROM oferta_empleo AS ofEmp INNER JOIN perfil_empleador AS pefEmp ON (pefEmp.id_perfil_empleador = ofEmp.id_perfil_oe_empleador) INNER JOIN perfil_usuario as pefUs ON (pefUs.id_perfil_usuario = pefEmp.id_perfil_usuario_empleador) WHERE id_categoria_oe IN ( ${categoriasEmpleo} ) AND ofEmp.fecha_finalizacion > now() AND pefUs.estatus = 1;`;
        mysqlConnection.query(queryConsulta, (error, resultadoConsulta) => {
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
                        "fechaFinalizacion" : fila['fecha_finalizacion'], 
                        "nombreEmpleo" : fila['nombre'], 
                        "direccion" : fila['direccion'], 
                        "cantidadPago" : fila['cantidad_pago'], 
                        "tipoPago" : fila['tipo_pago'], 
                        "diasLaborales" : fila['dias_laborales'], 
                        "vacantes" : fila['vacantes']
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
    const idOfertaEmpleo = req.params['idOfertaEmpleo'];
    var tokenValido = verifyTokenAspirante(token);
    if(tokenValido) {
        try {
            var queryOferta = "SELECT oe.* FROM oferta_empleo AS oe iNNER JOIN perfil_empleador AS pe ON pe.id_perfil_empleador = oe.id_perfil_oe_empleador INNER JOIN perfil_usuario AS pu ON pu.id_perfil_usuario = pe.id_perfil_usuario_empleador WHERE pu.estatus = 1 AND oe.id_oferta_empleo = ?;";
            mysqlConnection.query(queryOferta, [idOfertaEmpleo], (error, resultadoOferta) => {
                if(error) {
                    throw error;
                }
                if (resultadoOferta.length == 0){
                    console.log(idOfertaEmpleo)
                    res.status(404).send(mensajes.peticionNoEncontrada);
                } else {
                    ofertaEmpleo =  resultadoOferta[0];
                    var queryFotos = "SELECT * FROM fotografia where id_oferta_empleo_fotografia = ?;"
                    mysqlConnection.query(queryFotos,[ofertaEmpleo['id_oferta_empleo']], (error, resultadoFotos) => {
                        if(error) {
                            throw error;
                        }
                        var ofertaEmpleoConsultada = {};
                        var listaFotos = [];
                        resultadoFotos.forEach(fotoConsultada => {
                            var foto = {};
                            var bytesImagen = [];
                            fotoConsultada.imagen.forEach(
                                byte => bytesImagen.push(byte)
                            );
                            foto = {
                                "idFotografia" : foto['id_fotografia'],
                                "imagen": bytesImagen,
                                "idOfertaEmpleo" : foto['id_oferta_empleo_fotografia'] 
                            }
                            listaFotos.push(foto);
                        });
                        ofertaEmpleoConsultada = {
                            'cantidadPago': ofertaEmpleo['cantidad_pago'],
                            'descripcion': ofertaEmpleo['descripcion'],
                            'diasLaborales': ofertaEmpleo['dias_laborales'],
                            'direccion': ofertaEmpleo['direccion'],
                            'fechaDeFinalizacion': ofertaEmpleo['fecha_finalizacion'],
                            'fechaDeIinicio': ofertaEmpleo['fecha_inicio'],
                            'horaFin': ofertaEmpleo['hora_fin'],
                            'horaInicio': ofertaEmpleo['hora_inicio'],
                            'idCategoriaEmpleo': ofertaEmpleo['id_categoria_oe'],
                            'nombre': ofertaEmpleo['nombre'],
                            'tipoPago': ofertaEmpleo['tipo_pago'],
                            'vacantes': ofertaEmpleo['vacantes'],
                            'idOfertaEmpleo': ofertaEmpleo['id_oferta_empleo'],
                            'idPerfilEmpleador': ofertaEmpleo['id_perfil_oe_empleador'],
                            //'fotografias': listaFotos
                        };
                        res.status(200).json(ofertaEmpleoConsultada);
                    })
                }
            });
        } catch (error) {
            res.status(500);
            res.send(mensajes.errorInterno);
        }
    } else {
        res.status(401);
        res.send(mensajes.tokenInvalido);
    }
});

module.exports = path;