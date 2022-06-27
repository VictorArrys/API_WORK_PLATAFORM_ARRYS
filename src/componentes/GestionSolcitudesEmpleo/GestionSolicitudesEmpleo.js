
const { SolicitudDAO } = require('./data/SolicitudDAO');
const { ContratacionDAO } = require('./data/ContratacionDAO');
const { ConversacionDAO } = require('./data/ConversacionDAO');
const { OfertaEmpleoDAO } = require('./data/OfertaEmpleoDAO');
const { EmpleadorDAO } = require('./data/EmpleadorDAO');
const { UsuarioDAO } = require('./data/UsuarioDAO');

exports.GestionSolicitudesEmpleo =  class {
    //Demandante


    //Empleador
    static getSolicitudesEmpleo(idOfertaEmpleo, callback){
        SolicitudDAO.getSolicitudesEmpleo(idOfertaEmpleo, callback)
    }

    static getSolicitudEmpleo(idSolicitudEmpleo, callback) {
        SolicitudDAO.getSolicitudEmpleo(idSolicitudEmpleo, callback)
    }

    static patchAceptarSolicitud(idSolicitudEmpleo, callback){
        // Existe la solicitud que se quiere aprobar o cuenta con estado valido {1: pendiente}
        SolicitudDAO.existeSolicitud(idSolicitudEmpleo, (codigoRespuesta, existeSolicitudEmpleo)=>{
            if(codigoRespuesta == 200){
                var idAspirante = existeSolicitudEmpleo['id_perfil_aspirante_sa']
                var idSolicitudEmpleo = existeSolicitudEmpleo['id_solicitud_aspirante']
                var idOfertaEmpleo = existeSolicitudEmpleo['id_oferta_empleo_sa']

                console.log(existeSolicitudEmpleo)
                if(idSolicitudEmpleo > 0){
                    UsuarioDAO.obtenerIdUsuarioAspirante(idAspirante, (codigoRespuesta, idUsuarioAspirante)=>{
                        if(codigoRespuesta == 200){
                            // Se acepta la solicitud solo en caso de que haya recibido que existe la solicitud
                            SolicitudDAO.aceptarSolicitud(idSolicitudEmpleo, (codigoRespuesta, solicitudAceptada)=>{
                                if(codigoRespuesta == 200){

                                    if(solicitudAceptada > 0){
                        
                                        //Obtenemos el id del empleador de la oferta
                                        EmpleadorDAO.obtenerIdEmpleador(existeSolicitudEmpleo, (codigoRespuesta, cuerpoIdEmpleador)=>{
                                            if(codigoRespuesta == 200){
                                                if(cuerpoIdEmpleador > 0){

                                                    //Verificamos si existe la contratación de la solicitud
                                                    ContratacionDAO.existeContratacion(existeSolicitudEmpleo, (codigoRespuesta,contratacionEmpleo)=>{
                                                        console.log("Contratacion: " + contratacionEmpleo['id_contratacion_empleo'] + " res: " + codigoRespuesta)
                                                        if(codigoRespuesta == 200){
                                                            console.log(contratacionEmpleo['id_contratacion_empleo'])
                                                            if(contratacionEmpleo == 0){
                                                                console.log('La contratacion tiene un ID: ' + contratacionEmpleo['id_contratacion_empleo'] + ', lo cual significa que no existe y se crea')
                                                                //Se crea una nueva conversación de la solicitud
                                                                ConversacionDAO.crearConversacion(existeSolicitudEmpleo, (codigoRespuesta,conversacionNueva)=>{
                                                                    if(codigoRespuesta == 201){
                                                                        console.log('ID conversacion: ')
                                                                        console.log(conversacionNueva)
                                                                        if(conversacionNueva > 0){
                                                                            EmpleadorDAO.obtenerIdUsuarioEmpleador(cuerpoIdEmpleador, (codigoRespuesta,cuerpoIdUsuarioEmpleador)=>{
                                                                                ///
                                                                                if(codigoRespuesta == 200){
                                                                                    // Se agrega a la conversació al empleador
                                                                                    console.log(cuerpoIdUsuarioEmpleador)
                                                                                    ConversacionDAO.agregarParticipantes(conversacionNueva, cuerpoIdUsuarioEmpleador, (codigoRespuesta, agregarParticipante)=>{
                                                                                        if(codigoRespuesta == 201){
                                                                                            //Se crea una contratación nueva de la solicitud
                                                                                            ContratacionDAO.crearContratacion(existeSolicitudEmpleo,conversacionNueva, (codigoRespuesta,contratacionNueva)=>{
                                                                                                if(codigoRespuesta == 201){
                                                                                                    if(contratacionNueva > 0){
                                                                                                    
                                                                                                        console.log('Id del empleador')
                                                                                                        console.log(cuerpoIdEmpleador)
                            
                                                                                                        ContratacionDAO.crearContratacionAspirante(contratacionNueva ,idAspirante, cuerpoIdEmpleador, (codigoRespuesta,contratacionEmpleoAspirante)=>{
                                                                                                            if(contratacionEmpleoAspirante == 1){
                                                                                                                ConversacionDAO.agregarParticipantes(conversacionNueva, idUsuarioAspirante, (codigoRespuesta, agregarParticipante)=>{
                                                                                                                    if(codigoRespuesta == 201){
                                                                                                                        OfertaEmpleoDAO.reducirVacante(idOfertaEmpleo, (codigoRespuesta,reducirVacante)=>{
                                                                                                                            if(codigoRespuesta == 200){
                                                                                                                                if(reducirVacante >= 1){
                                                                                                                                    callback(204, reducirVacante)
                                                                                                                                }
                                                                                                                            }else{
                                                                                                                                callback(codigoRespuesta, reducirVacante)
                                                                                                                            }
                                                                                                                            
                                                                                                                        })

                                                                                                                    }else{
                                                                                                                        callback(codigoRespuesta, agregarParticipante)
                                                                                                                    }
                                                                                                                })
                                                                                                                
                                                                                                            }else{
                                                                                                                callback(codigoRespuesta, contratacionEmpleoAspirante)
                                                                                                            }
                                                                            
                                                                                                        })
                                                                                                        
                                                                                                    }
                                                                                                }else{
                                                                                                    callback(codigoRespuesta,contratacionNueva)
                                                                                                }
                    
                                                                                                })
                                                                                                
                                                                                        }else{
                                                                                            callback(codigoRespuesta, agregarParticipante)
                                                                                        }
                                                                                        })
                                                                                }else{
                                                                                    callback(codigoRespuesta, cuerpoIdUsuarioEmpleador)
                                                                                }
                                                                                ///
                                                                            })
                                                                            //
                                                                        }   
                                                                    }else{
                                                                        callback(codigoRespuesta, conversacionNueva)
                                                                    }

                                                                })                
                                        
                                                            }else{
                                                                //Solo se agrega al aspirante a la contratación
                                                                ContratacionDAO.crearContratacionAspirante(contratacionEmpleo['id_contratacion_empleo'] ,idAspirante, cuerpoIdEmpleador, (codigoRespuesta,contratacionEmpleoAspirante)=>{
                                                                    if(contratacionEmpleoAspirante == 1){
                                                                        console.log(contratacionEmpleo['id_conversacion_coe'])

                                                                        ConversacionDAO.agregarParticipantes(contratacionEmpleo['id_conversacion_coe'], idUsuarioAspirante, (codigoRespuesta, agregarParticipante)=>{
                                                                            if(codigoRespuesta == 201){
                                                                                OfertaEmpleoDAO.reducirVacante(idOfertaEmpleo, (codigoRespuesta,reducirVacante)=>{
                                                                                    if(codigoRespuesta == 200){
                                                                                        if(reducirVacante >= 1){
                                                                                            callback(204, reducirVacante)
                                                                                        }
                                                                                    }else{
                                                                                        callback(codigoRespuesta, reducirVacante)
                                                                                    }
                                                                                    
                                                                                })

                                                                            }else{
                                                                                callback(codigoRespuesta, agregarParticipante)
                                                                            }
                                                                        })
                                                                    }else{
                                                                        callback(codigoRespuesta, contratacionEmpleoAspirante)
                                                                    }
                                    
                                                                })
                                                            }
                                                            
                                                        } 
                                                        else{
                                                            callback(codigoRespuesta, contratacionEmpleo)
                                                        }
                                                    })                            
                                                
                                                }
                                            }else{
                                                callback(codigoRespuesta, ofertaEmpleo)
                                            }

                                        })
                                }
                                }else{
                                    callback(codigoRespuesta, solicitudAceptada)
                                
                            }

                            })

                        }else{
                            callback(codigoRespuesta, idUsuarioAspirante)
                        }

                    })
                    
                }

            }else{
                callback(codigoRespuesta, existeSolicitudEmpleo)
            }
        })

    }

    static patchRechazarSolicitud(idSolicitudEmpleo, callback){
        SolicitudDAO.rechazarSolicitud(idSolicitudEmpleo, callback)
    }

    //Aspirante


    
}