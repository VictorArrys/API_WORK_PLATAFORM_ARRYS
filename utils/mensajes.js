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
function peticionIncorrecta(error){
    const message = {
        "resBody" : {
            "menssage" : "Petición incorrecta:" + error
        }
    }
    return message
}

exports.peticionIncorrecta

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