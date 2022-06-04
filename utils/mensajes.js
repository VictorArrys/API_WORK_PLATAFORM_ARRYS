//Respuestas
//500
exports.errorInterno = {
    "type error" : {
    "message" : "Error interno del servidor."
    }
}

// 401
exports.tokenInvalido = {
    "type error" : {
    "message" : "Token invalido."
    }
}

// 403
exports.prohibido = {
    "type error" : {
    "message" : "Acceso prohibido a esta ruta"
    }
}

// 404
exports.peticionNoEncontrada = {
    "type error" : {
    "message" : "Petición no encontrada"
    }
}


//201
exports.registroExitoso = {
    "result action" : {
    "message" : "Registro exitoso"
    }
}

//204
exports.actualizacionExitosa = {
    "result action" : {
    "message" : "Actualización exitosa"
    }
}