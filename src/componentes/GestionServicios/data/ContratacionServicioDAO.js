var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
var {ContratacionServicio } = require('../modelo/ContratacionServicio'); 
const { DemandanteDAO } = require('./DemandanteDAO');

exports.ContratacionServicioDAO = class ContratacionServicioDAO {
    static getContratacionesServicioDemandante(idDemandante, callback){
        var query = "SELECT * FROM contratacion_servicio where id_perfil_demandante_cs = ?;"
        mysqlConnection.query(query, [idDemandante], (error, resultadoConsulta)=> {
            if(error){ 
                callback(500, mensajes.errorInterno);
            } else {
                var listaContratacionesServicio = [];
                resultadoConsulta.forEach(fila => {
                    var contratacion = new ContratacionServicio();
                        contratacion.estatus = fila['estatus'];
                        contratacion.fechaContratacion = fila['fecha_contratacion'];
                        contratacion.valoracionDemandante = fila['valoracion_aspirante'];
                        contratacion.idPerfilAspirante = fila['id_perfil_aspirante_cs'];
                        contratacion.idPErfilDemandante = fila['id_perfil_demandante_cs'];
                        contratacion.idContratacionServicio = fila['id_contratacion_servicio'];
                        contratacion.fechaFinalizacion = fila['fecha_finalizacion'];
                    listaContratacionesServicio.push(contratacionServicio);
                });
                res.status(200);
                res.send(listaContratacionesServicio);
            }
        });
    }

    static getContratacionesServicioAspirante(idAspirante, callback) {
        var query = "select id_contratacion_servicio, id_perfil_demandante_cs, id_perfil_aspirante_cs, estatus, valoracion_aspirante, date_format(cs.fecha_contratacion, '%Y-%m-%d') as fecha_contratacion, date_format(cs.fecha_finalizacion, '%Y-%m-%d') as fecha_finalizacion, id_conversacion_cs, c.nombre_empleo as tituloEmpleo FROM contratacion_servicio as cs inner join conversacion as c on c.id_conversacion = cs.id_conversacion_cs where id_perfil_aspirante_cs = ?;"
        mysqlConnection.query(query, [idAspirante], (error, resultado) => {
            if(error){ 
                callback(500, mensajes.errorInterno)
            } else if (resultado.length == 0) { //Sin contrataciones
                callback(200, []);
            } else {
                var contratacionesServicio = [];
                resultado.forEach(fila => {
                    DemandanteDAO.getDemandante(fila['id_perfil_demandante_cs'], (demandante)=> {
                        var contratacion = new ContratacionServicio();
                        contratacion.idContratacionServicio = fila['id_contratacion_servicio'];
                        contratacion.estatus = fila['estatus'];
                        contratacion.fechaContratacion = fila['fecha_contratacion'];
                        contratacion.idPerfilAspirante = fila['id_perfil_aspirante_cs'];
                        contratacion.fechaFinalizacion = fila['fecha_finalizacion'];
                        contratacion.tituloEmpleo = fila['tituloEmpleo']
                        contratacion.valoracionDemandante = fila['valoracion_aspirante'];
                        contratacion.demandante =  demandante;
                        contratacionesServicio.push(contratacion);
                        if (contratacionesServicio.length == resultado.length){ //Se hace callback despues de consultar el demandante de todas las contrataciones
                            callback(200, contratacionesServicio)
                        }
                    })
                });
            }
        });
    }

    static finalizarContratacionServicio(idDemandante, idContratacionServicio, callback) {
        
    }
    
    static evaluarAspirante(idDemandante, idContratacionServicio, puntuacion, callback) {
        var queryComprobacion = "SELECT count(*) as estaFinalizada FROM contratacion_servicio WHERE id_perfil_demandante_cs = ? AND id_contratacion_servicio = ? AND estatus = 0; ";
        var queryEvaluacion = "UPDATE contratacion_servicio SET valoracion_aspirante = ? WHERE id_perfil_demandante_cs = ? AND id_contratacion_servicio = ?;"
        mysqlConnection.query(queryComprobacion, [idDemandante, idContratacionServicio], (error, resultadoComprobacion) => {
            if (error) {
                callback(500, mensajes.errorInterno);
            } else {
                var sePuedeEvaluar = resultadoComprobacion[0]['estaFinalizada'];
                if (sePuedeEvaluar == 1) {
                    mysqlConnection.query(queryEvaluacion, [puntuacion, idDemandante, idContratacion], (error, resultado)=> {
                        if(error){ 
                            callback(500,mensajes.errorInterno);
                        } else {
                            callback(204, mensajes.aspiranteEvaluado);
                        }
                    });
                } else {
                    callback(409,mensajes.evaluacionDeAspiranteDenegada);
                }
            }
        });
    }

    //Se usa al aceptar solicitud servicio
    static postContratacion(idSolicitud, callback) {

    }
}