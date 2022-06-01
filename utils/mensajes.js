//Respuestas
//500
exports.errorInterno = {
    "resBody" : {
    "menssage" : "error interno del servidor"
    }
}

// 401
exports.tokenInvalido = {
    "resBody" : {
    "menssage" : "token invalido"
    }
}

// 400
exports.peticionIncorrecta = {
    "resBody" : {
    "menssage" : "peticion incorrecta"
    }
}

// 404
exports.peticionNoEncontrada = {
    "resBody" : {
    "menssage" : "peticion no encontrada"
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