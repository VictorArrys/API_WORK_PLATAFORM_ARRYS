const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const mensajes = require('../../utils/mensajes');

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

    var tokenValido = verifyTokenDemandante(token);
    if (tokenValido) {
        var query = "SELECT conv.id_conversacion, conv.nombre_empleo, p_asp.nombre as nombre_aspirante, cs.fecha_contratacion " +
                    "FROM conversacion AS conv INNER JOIN contratacion_servicio as cs " +
                    "ON conv.id_conversacion = cs.id_conversacion_cs INNER JOIN perfil_aspirante AS p_asp " +
                    "ON p_asp.id_perfil_aspirante = cs.id_perfil_aspirante_cs WHERE cs.id_perfil_demandante_cs = ?;";
        mysqlConnection.query(query, [idPerfilDemandante], (error, resultado) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else if(resultado.length == 0){
                res.status(404)
                res.json(mensajes.peticionNoEncontrada)
            } else {
                const conversaciones = [];
                resultado.forEach(fila => {
                    var conversacion = {};
                    conversacion = {
                        "idConversacion": fila['id_conversacion'],
                        "tituloSolicitud": fila['nombre_empleo'],
                        "fechaContratacion": fila['fecha_contratacion'],
                        "nombreAspirante": fila['nombre_aspirante']
                    }
                    conversaciones.push(conversacion);
                });
                res.status(200);
                res.send(conversaciones);
            }
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

    var tokenValido = verifyTokenDemandante(token);
    if (tokenValido) {
        var queryConversacion = "SELECT id_conversacion, nombre_empleo FROM " +
                                "conversacion AS c INNER JOIN contratacion_servicio as cs " +
                                "ON cs.id_contratacion_servicio = c.id_conversacion WHERE " +
                                "c.id_conversacion = ? AND cs.id_perfil_demandante_cs = ?;";
        var queryMensajes = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_conversación_mensaje = ?";
        mysqlConnection.query(queryConversacion, [idConversacion, idPerfilDemandante], (error, resultado) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else if(resultado.length == 0){
                res.status(404)
                res.json(mensajes.peticionNoEncontrada)
            } else {
                
                if (resultado.length > 0) {
                    var conversacion = {};
                    var listaMensajes = [];
                    var idConversacion = resultado[0]['id_conversacion'];
                    var tituloSolicitud = resultado[0]['nombre_empleo'];

                    mysqlConnection.query(queryMensajes, [idConversacion], (error, resultado) => {
                        if(error){ 
                            res.status(500)
                            res.send(mensajes.errorInterno)
                        } else {
                            resultado.forEach( fila => {
                                var mensaje = {
                                    "idMensaje": fila["idMensaje"],
                                    "idUsuarioRemitente": fila["idUsuarioRemitente"],
                                    "fechaRegistro": fila["fechaRegistro"],
                                    "remitente": fila["remitente"],
                                    "contenidoMensaje": fila["contenidoMensaje"],
                                    "tipoUsuario": fila["tipoUsuario"]
                                }
                                listaMensajes.push(mensaje);
                            });
                            conversacion = {
                                "tituloSolicitud":  tituloSolicitud,
                                "idConversacion": idConversacion,
                                "mensajes": listaMensajes
                            }

                            res.status(200);
                            res.send(conversacion);
                        }
                    });
                } else {
                    res.status(404);
                    res.json(mensajes.peticionNoEncontrada);
                }
            }
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
    var tokenValido = verifyTokenDemandante(token);
    if (tokenValido) {
        var queryConversacion = "INSERT INTO mensaje (id_conversación_mensaje, id_usuario_remitente, mensaje, fechaRegistro) " +
                                "VALUES (?,(SELECT id_perfil_usuario_demandante FROM perfil_demandante WHERE id_perfil_demandante = ?),?,NOW());";
        
        mysqlConnection.query(queryConversacion, [idConversacion, idPerfilDemandante, mensaje], (error, resultadoMensaje) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else {
                var queryMensaje = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_mensaje = ?";
                mysqlConnection.query(queryMensaje, [resultadoMensaje.insertId], (error, resultado) => {
                    if(error){ 
                        res.status(500)
                        res.send(mensajes.errorInterno)
                    } else {
                        fila = resultado[0];
                        var nuevoMensaje = {
                            "idMensaje": fila["idMensaje"],
                            "idUsuarioRemitente": fila["idUsuarioRemitente"],
                            "fechaRegistro": fila["fechaRegistro"],
                            "remitente": fila["remitente"],
                            "contenidoMensaje": fila["contenidoMensaje"],
                            "tipoUsuario": fila["tipoUsuario"]
                        }
                        console.log("SERVER: Mensaje de (" + fila["idUsuarioRemitente"] + " - " + fila['remitente'] + ") en conversación con id " + idConversacion);
                        res.status(201);
                        res.send(nuevoMensaje);
                    }
                });
            }
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilEmpleadores/:idPerfilEmpleador/conversaciones", (req, res) => {
    const token = req.headers['x-access-token'];
    const idPerfilEmpleador = req.params['idPerfilEmpleador'];
    var tokenValido = verifyTokenEmpleador(token);

    if (tokenValido) {
        var queryConversaciones =   "SELECT conv.id_conversacion, ofEmp.categoria, ofEmp.nombre_empleo FROM conversacion AS conv " +
                                    "INNER JOIN (" +
                                        "SELECT oe.id_oferta_empleo, catEmp.nombre as categoria, oe.nombre as nombre_empleo, oe.id_perfil_oe_empleador as idEmpleador, conEmp.id_contratacion_empleo, conEmp.id_conversacion_coe " +
                                        "FROM oferta_empleo AS oe INNER JOIN categoria_empleo AS catEmp ON oe.id_categoria_oe = catEmp.id_categoria_empleo "+
                                        "INNER JOIN contratacion_empleo AS conEmp ON conEmp.id_oferta_empleo_coe = oe.id_oferta_empleo" +
                                    ") AS ofEmp ON ofEmp.id_conversacion_coe = conv.id_conversacion WHERE ofEmp.idEmpleador = ?;";
        mysqlConnection.query(queryConversaciones,[idPerfilEmpleador], (error, resultado) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else {
                const conversaciones = [];
                resultado.forEach(fila => {
                    var conversacion = {};
                    conversacion = {
                        "idConversacion": fila['id_conversacion'],
                        "categoriaEmpleo": fila['categoria'],
                        "tituloOfertaEmpleo": fila['nombre_empleo']
                    }
                    conversaciones.push(conversacion);
                });
                res.status(200);
                res.send(conversaciones);
            }
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

    var tokenValido = verifyTokenEmpleador(token);
    var queryConversacion = "SELECT conv.id_conversacion, empleo.nombreEmpleo " +
                            "FROM conversacion AS conv INNER JOIN ( " +
                                "SELECT conEmp.id_conversacion_coe AS idConversacion, ofEmp.nombre as nombreEmpleo, ofEmp.id_perfil_oe_empleador as idEmpleador " +
                                "FROM contratacion_empleo AS conEmp INNER JOIN oferta_empleo AS ofEmp " +
                                "ON ofEmp.id_oferta_empleo = conEmp.id_oferta_empleo_coe " +
                            ") AS empleo ON empleo.idEmpleador = conv.id_conversacion WHERE empleo.idEmpleador = ? AND conv.id_conversacion = ?;"
    if (tokenValido) {
        mysqlConnection.query(queryConversacion, [idPerfilEmpleador, idConversacion], (error, resultado) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else if(resultado.length == 0){
                res.status(404)
                res.json(mensajes.peticionNoEncontrada)
            } else {
                
                if (resultado.length > 0) {
                    var queryMensajes = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_conversación_mensaje = ?";
                    
                    var conversacion = {};
                    var listaMensajes = [];
                    var idConversacion = resultado[0]['id_conversacion'];
                    var tituloOfertaEmpleo = resultado[0]['nombreEmpleo'];

                    mysqlConnection.query(queryMensajes, [idConversacion], (error, resultado) => {
                        if(error){ 
                            res.status(500)
                            res.send(mensajes.errorInterno)
                        } else {
                            resultado.forEach( fila => {
                                var mensaje = {
                                    "idMensaje": fila["idMensaje"],
                                    "idUsuarioRemitente": fila["idUsuarioRemitente"],
                                    "fechaRegistro": fila["fechaRegistro"],
                                    "remitente": fila["remitente"],
                                    "contenidoMensaje": fila["contenidoMensaje"],
                                    "tipoUsuario": fila["tipoUsuario"]
                                }
                                listaMensajes.push(mensaje);
                            });
                            conversacion = {
                                "idConversacion": idConversacion,
                                "tituloSolicitud":  tituloOfertaEmpleo,
                                "mensajes": mensajes
                            }

                            res.status(200);
                            res.send(conversacion);
                        }
                    });
                } else {
                    res.status(404);
                    res.json(mensajes.peticionNoEncontrada);
                }
            }
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
    var tokenValido = verifyTokenDemandante(token);
    if (tokenValido) {
        var queryConversacion = "INSERT INTO mensaje (id_conversación_mensaje, id_usuario_remitente, mensaje, fechaRegistro) " +
                                "VALUES (?,(SELECT id_perfil_usuario_empleador FROM perfil_empleador WHERE id_perfil_empleador = ?),?,NOW());";
        
        mysqlConnection.query(queryConversacion, [idConversacion, idPerfilEmpleador, mensaje], (error, resultadoMensaje) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else {
                var queryMensaje = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_mensaje = ?";
                mysqlConnection.query(queryMensaje, [resultadoMensaje.insertId], (error, resultado) => {
                    if(error){ 
                        res.status(500)
                        res.send(mensajes.errorInterno)
                    } else {
                        fila = resultado[0];
                        var nuevoMensaje = {
                            "idMensaje": fila["idMensaje"],
                            "idUsuarioRemitente": fila["idUsuarioRemitente"],
                            "fechaRegistro": fila["fechaRegistro"],
                            "remitente": fila["remitente"],
                            "contenidoMensaje": fila["contenidoMensaje"],
                            "tipoUsuario": fila["tipoUsuario"]
                        }
                        console.log("SERVER: Mensaje de (" + fila["idUsuarioRemitente"] + " - " + fila['remitente'] + ") en conversación con id " + idConversacion);
                        res.status(201);
                        res.send(nuevoMensaje);
                    }
                });
            }
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.get("/v1/perfilAspirantes/:idPerfilAspirante/conversaciones", (req, res)=>{
    const token = req.headers['x-access-token'];
    const idPerfilAspirante = req.params['idPerfilAspirante']

    
    var tokenValido = verifyTokenAspirante(token);
    if (tokenValido) {
        var queryConversaciones = "select conv.* from " +
                                  "conversacion as conv inner join participacion_conversacion as parConv " +
                                  "on parConv.id_conversacion_participacion = conv.id_conversacion " +
                                  "where parConv.id_perfil_usuario_participacion = (select id_perfil_usuario_aspirante from perfil_aspirante where id_perfil_aspirante = ?);"
    
        mysqlConnection.query(queryConversaciones, [idPerfilAspirante], (error, resultado) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else if(resultado.length == 0){
                res.status(404)
                res.json(mensajes.peticionNoEncontrada)
            } else {
                const conversaciones = [];
                resultado.forEach(fila => {
                    var conversacion = {};
                    conversacion = {
                        "idConversacion": fila['id_conversacion'],
                        "tituloEmpleo": fila['nombre_empleo'],
                        "fechaContratacion": fila['fecha_contratacion']
                    }
                    conversaciones.push(conversacion);
                });
                res.status(200);
                res.send(conversaciones);
            }
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

    var tokenValido = verifyTokenAspirante(token);
    if (tokenValido) {
        var queryConversaciones = "select conv.* from " +
                                  "conversacion as conv inner join participacion_conversacion as parConv " +
                                  "on parConv.id_conversacion_participacion = conv.id_conversacion " +
                                  "where parConv.id_perfil_usuario_participacion = (select id_perfil_usuario_aspirante from perfil_aspirante where id_perfil_aspirante = ?) AND conv.id_conversacion = ?;"
    
        mysqlConnection.query(query, [idPerfilAspirante, idConversacion], (error, resultado) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else {
                if (resultado.length == 1){
                    var queryMensajes = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_conversación_mensaje = ?";

                    var conversacion = {};
                    var listaMensajes = [];
                    
                    var idConversacion = resultado[0]['id_conversacion'];
                    mysqlConnection.query(queryMensajes, [idConversacion], (error, resultado) => {
                        if(error){ 
                            res.status(500)
                            res.send(mensajes.errorInterno)
                        } else {
                            resultado.forEach( fila => {
                                var mensaje = {
                                    "idMensaje": fila["idMensaje"],
                                    "idUsuarioRemitente": fila["idUsuarioRemitente"],
                                    "fechaRegistro": fila["fechaRegistro"],
                                    "remitente": fila["remitente"],
                                    "contenidoMensaje": fila["contenidoMensaje"],
                                    "tipoUsuario": fila["tipoUsuario"]
                                }
                                listaMensajes.push(mensaje);
                            });
                            conversacion = {
                                "idConversacion": resultado[0]['id_conversacion'],
                                "tituloEmpleo": resultado[0]['nombre_empleo'],
                                "mensajes" : listaMensajes
                            }

                            res.status(200);
                            res.send(conversacion);
                        }
                    });
                } else {
                    res.status(404);
                    res.json(mensajes.peticionNoEncontrada);
                }
            }
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

path.post("/v1/perfilAspirantes/:idPerfilAspirante/conversaciones/:idConversacion", (req, res) => {
    const token = req.headers['x-access-token'];
    const idPerfilAspirante = req.params['idPerfilAspirante']
    const idConversacion = req.params['idConversacion']
    const mensaje =  req.body["mensaje"];
    var tokenValido = verifyTokenDemandante(token);
    if (tokenValido) {
        var queryConversacion = "INSERT INTO mensaje (id_conversación_mensaje, id_usuario_remitente, mensaje, fechaRegistro) " +
                                "VALUES (?,(SELECT id_perfil_usuario_aspirante FROM perfil_aspirante WHERE id_perfil_aspirante = ?),?,NOW());";
        
        mysqlConnection.query(queryConversacion, [idConversacion, idPerfilAspirante, mensaje], (error, resultadoMensaje) => {
            if(error){ 
                res.status(500)
                res.send(mensajes.errorInterno)
            } else {
                var queryMensaje = "SELECT m.id_mensaje AS idMensaje, m.id_usuario_remitente as idUsuarioRemitente, m.mensaje AS contenidoMensaje, date_format(m.fechaRegistro, \"%Y-%m-%d %T\") as fechaRegistro, pu.nombre_usuario as remitente, pu.tipo_usuario as tipoUsuario FROM mensaje AS m INNER JOIN perfil_usuario as pu ON m.id_usuario_remitente = pu.id_perfil_usuario where m.id_mensaje = ?";
                mysqlConnection.query(queryMensaje, [resultadoMensaje.insertId], (error, resultado) => {
                    if(error){ 
                        res.status(500)
                        res.send(mensajes.errorInterno)
                    } else {
                        fila = resultado[0];
                        var nuevoMensaje = {
                            "idMensaje": fila["idMensaje"],
                            "idUsuarioRemitente": fila["idUsuarioRemitente"],
                            "fechaRegistro": fila["fechaRegistro"],
                            "remitente": fila["remitente"],
                            "contenidoMensaje": fila["contenidoMensaje"],
                            "tipoUsuario": fila["tipoUsuario"]
                        }
                        console.log("SERVER: Mensaje de (" + fila["idUsuarioRemitente"] + " - " + fila['remitente'] + ") en conversación con id " + idConversacion);
                        res.status(201);
                        res.send(nuevoMensaje);
                    }
                });
            }
        });
    } else {
        res.status(401)
        res.send(mensajes.tokenInvalido);
    }
});

//Registro de un mensaje

module.exports = path;