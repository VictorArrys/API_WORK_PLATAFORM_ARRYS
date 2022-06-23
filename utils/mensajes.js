//Respuestas
//500
exports.errorInterno = {
    "type error" : {
    "message" : "Error interno del servidor."
    }
}

// 400
exports.peticionIncorrecta = {
    "type error" : {
    "message" : "Petición incorrecta."
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

//200
exports.actualizacionExitosa = {
    "result action" : {
    "message" : "Actualización exitosa"
    }
}

//422
exports.instruccionNoProcesada = {
    "type error" : {
        "message" : "solicitud no procesada"
        }
}

//Solicitud empleo
exports.solicitudEmpleoPendiente = {
    "type error" : {
    "message" : "Ya registraste una solicitud, espera que sea atendida"
    }
}

exports.solicitudEmpleoAceptada = {
    "type error" : {
    "message" : "Ya registraste una solicitud y fue aceptada"
    }
}

exports.solicitudEmpleoRechazada = {
    "type error" : {
    "message" : "Ya registraste una solicitud, pero desafortunadamente fue rechzada"
    }
}


//Solicitudes de servicio
exports.solicitudServicioAceptada = {
    "message" : "Solicitud de servicio aceptada."
}

exports.solicitudServicioRechazada = {
    "message" : "Solicitud de servicio rechazada."
}

exports.solicitudServicioAtendida = {
    "type error" : {
        "message" : "La solicitud de servicio ya fue atendida."
    }
}

//Servicios
exports.aspiranteEvaluado = {
    "message" : "Evaluacion de aspirante registrada."
}
 
exports.evaluacionDeAspiranteDenegada = {
    "type error" : {
        "message" : "El aspirante no se puede evaluado hasta finalizar la contratación."
    }
}

exports.contratacionServicioFinalizada = {
    "message" : "La contratación de servicio fue finalizada."
}

exports.contratacionServicioPreviamenteFinalizada = {
    "type error" : {
        "message" : "El empleador no se puede evaluado hasta finalizar la contratación."
    }
}

//Contratacion Empleo - Aspirante
exports.evaluacionDeEmpleadorDenegada = {
    "type error" : {
        "message" : "El empleador no se puede evaluado hasta finalizar la contratación."
    }
}