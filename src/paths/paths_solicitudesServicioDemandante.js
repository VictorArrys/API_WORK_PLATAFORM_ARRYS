const { Router, query } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const mensajes = require('../../utils/mensajes');

//Estatus de solicitudes:
//Pendiente: 0, Rechazado -1, Acpetado: 1 


//Verfica que el token le pertenezca a un demandante
function verificarTokenDemandante(token, idPerfilDemandante) {
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


//ALTER TABLE `deser_el_camello`.`solicitud_servicio` 
//ADD COLUMN `descripcion` VARCHAR(254) NOT NULL AFTER `registro`;
path.get("/v1/perfilDemandantes/:idPerfilDemandante/solicitudesServicios", (req, res) => {
    const token = req.headers['x-access-token'];
    tokenValido = verificarTokenDemandante(token);

    if (tokenValido) {
        var idDemandante = req.params['idPerfilDemandante'];
        var query = "SELECT * FROM deser_el_camello.solicitud_servicio where id_perfil_ss_demandante = ?;";
        mysqlConnection.query(query, [idDemandante], (error, resultado) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else {
                var listaSolicitudes = [];
                resultado.forEach(fila => {
                    var solicitud = {};
                    solicitud = {
                        "idSolicitudServicio": fila['id_solicitud_servicio'],
                        "titulo": fila['titulo'],
                        "descripcion": fila['descripcion'],                  
                        "estatus": fila['estatus'],
                        "fechaRegistro": fila['registro'],
                        "idPerfilDemandante": fila['id_perfil_ss_demandante'],
                        "idPerfilAspirante": fila['id_perfil_ss_aspirante']
                    }
                    listaSolicitudes.push(solicitud);
                });
                res.status(200).send(listaSolicitudes);
            }
        });
    } else {
        res.status(401);
        res.json(mensajes.tokenInvalido);
    }
});

path.post("/v1/perfilDemandantes/:idPerfilDemandante/solicitudesServicios", (req, res) => {
    const token = req.headers['x-access-token'];
    tokenValido = verificarTokenDemandante(token);

    if (tokenValido) {
        var idDemandante = req.params['idPerfilDemandante'];
        var idAspirante = req.body['idAspirante'];
        var titulo = req.body['titulo'];
        var descripcion =  req.body['descripcion'];
        var query = "INSERT INTO solicitud_servicio ( id_perfil_ss_aspirante, id_perfil_ss_demandante, titulo, estatus, registro, descripcion) VALUES ( ?, ?, ?, 0, NOW(), ?);";
        mysqlConnection.query(query, [idAspirante, idDemandante, titulo, descripcion], (error, resultadoRegistro) => {
            if(error){ 
                res.status(500);
                res.send(mensajes.errorInterno);
            } else {
                querySolicitudRegistrada = "select * from solicitud_servicio where id_solicitud_servicio = ?";
                mysqlConnection.query(querySolicitudRegistrada, [resultadoRegistro.insertId], (error, resultadoSelect) => {
                    if (error){
                        res.status(500);
                        res.send(mensajes.errorInterno);
                    } else {
                        var solicitudNueva = {};
                        solicitudNueva = {
                            "idSolicitudServicio": resultadoSelect[0]['id_solicitud_servicio'],
                            "titulo": resultadoSelect[0]['titulo'],
                            "descripcion": resultadoSelect[0]['descripcion'],                  
                            "estatus": resultadoSelect[0]['estatus'],
                            "fechaRegistro": resultadoSelect[0]['registro'],
                            "idPerfilDemandante": resultadoSelect[0]['id_perfil_ss_demandante'],
                            "idPerfilAspirante": resultadoSelect[0]['id_perfil_ss_aspirante']
                        }

                        res.status(201);
                        res.send(solicitudNueva);
                    }
                });
            }
        });
    } else {
        res.status(401);
        res.json(mensajes.tokenInvalido);
    }
});

module.exports = path;