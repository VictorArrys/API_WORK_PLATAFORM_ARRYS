const jwt = require('jsonwebtoken');

var LlaveToken = {
    key:"claveSecreta_elCamello"
}

exports.CrearToken = function(payload) {
    var llave = LlaveToken.key;
    const token = jwt.sign(payload, llave, { 
        expiresIn: 60 * 60 * 24
    });
    console.log("Gestion TOKEN");
    console.log(token)
    return token;
}

exports.ValidarToken = function(token) {
    var statusCode = 0;
    var llave = LlaveToken.key;
    try{
        const tokenData = jwt.verify(token, llave); 

        if(tokenData["tipo"] == "Empleador" || tokenData["tipo"] == "Demandante" 
            || tokenData["tipo"] == "Aspirante" || tokenData["tipo"] == "Administrador"){
            statusCode = 200;
            console.log(tokenData);
            return statusCode;
        }else{
            statusCode = 401;
            return statusCode;
        }
    }catch (error){
        statusCode = 401;
        return statusCode;
    }
}

exports.ValidarTokenTipoUsuario = function(token, tipoUsuario) {
    var llave = LlaveToken.key;
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, llave); 

        if(tokenData["tipo"] == tipoUsuario){
            statusCode = 200;
            console.log(tokenData);
            return statusCode;
        }else{
            statusCode = 401;
            return statusCode;
        }
    }catch (error){
        statusCode = 401;
        return statusCode;
    }
}