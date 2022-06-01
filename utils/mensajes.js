//Respuestas
//500
exports.errorInterno = {
    "resBody" : {
    "menssage" : "Error interno del servidor."
    }
}

// 401
exports.tokenInvalido = {
    "resBody" : {
    "menssage" : "Token invalido."
    }
}

// 400
exports.peticionIncorrecta = {
    "resBody" : {
    "menssage" : "Petición incorrecta"
    }
}

// 404
exports.peticionNoEncontrada = {
    "resBody" : {
    "menssage" : "Petición no encontrada"
    }
}


//201
exports.registroExitoso = {
    "resBody" : {
    "menssage" : "Registro exitoso"
    }
}

//204
exports.actualizacionExitosa = {
    "resBody" : {
    "menssage" : "Actualización exitosa"
    }
}