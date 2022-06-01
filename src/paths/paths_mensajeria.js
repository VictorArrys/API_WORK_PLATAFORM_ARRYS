const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const { send, status } = require('express/lib/response');
const mensajes = require('../../utils/mensajes');

//Valida que el token le pertenezca al administrador
function verifyTokenAdministrador(token, idPerfilAdministrador) {
    try{
        const tokenData = jwt.verify(token, keys.key);
        if (tokenData['tipo_usuario'] == "Administrador")
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
        if (tokenData['tipo_usuario'] == "Demandante")
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
        if (tokenData['tipo_usuario'] == "Aspirante")
            return true;
        else
            return false;
    } catch (error) {
        return false;
    }
}

path.get('/v1/perfilDemandantes/:idPerfilDemandante/conversaciones', (req, res) => {
    const token = req.headers['x-access-token'];
    const idPerfilDemandante = req.params['idPerfilDemandante']
    var pool = mysqlConnection;
    var query = "SELECT c.* FROM perfil_aspirante AS P_AS JOIN perfil_usuario AS P_US " +
                "ON P_AS.id_perfil_usuario_aspirante = P_US.id_perfil_usuario JOIN participacion_conversacion AS PC " +
                "ON P_US.id_perfil_usuario = PC.id_perfil_usuario_participacion JOIN conversacion AS C " +
                "ON C.id_conversacion = PC.id_conversacion_participacion " +
                "WHERE P_AS.id_perfil_aspirante = ?;";
    console.log(mensajes.tokenInvalido);
    pool.query(query, [idPerfilDemandante], (err, rows, fields) => {

    });
    res.status(200);
    res.send("{}");
});

module.exports = path;