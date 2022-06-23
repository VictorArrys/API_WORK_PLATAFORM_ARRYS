
const { SolicitudDAO } = require('./data/SolicitudDAO');
const { ContratacionDAO } = require('./data/ContratacionDAO');
const { ConversacionDAO } = require('./data/ConversacionDAO');
const { OfertaEmpleoDAO } = require('./data/OfertaEmpleoDAO');
const { EmpleadorDAO } = require('./data/EmpleadorDAO');

exports.GestionSolicitudesEmpleo =  class {
    //Demandante
    static patchAceptarSolicitud(idSolicitudEmpleo, callback){
           
        // Existe la solicitud que se quiere aprobar o cuenta con estado valido {1: pendiente}
        SolicitudDAO.existeSolicitud(idSolicitudEmpleo, (codigoRespuesta, existeSolicitudEmpleo)=>{
            if(codigoRespuesta == 200){
                console.log(existeSolicitudEmpleo)
                if(existeSolicitudEmpleo['id_solicitud_aspirante'] > 0){

                    // Se acepta la solicitud solo en caso de que haya recibido que existe la solicitud
                    SolicitudDAO.aceptarSolicitud(existeSolicitudEmpleo["id_solicitud_aspirante"], (codigoRespuesta, solicitudAceptada)=>{
                        if(codigoRespuesta == 200){

                            if(solicitudAceptada > 0){
                
                                //Obtenemos el id del empleador de la oferta
                                EmpleadorDAO.obtenerIdEmpleador(existeSolicitudEmpleo, (codigoRespuesta, ofertaEmpleo)=>{
                                    if(codigoRespuesta == 200){
                                        if(ofertaEmpleo > 0){

                                            //Verificamos si existe la contratación de la solicitud
                                            ContratacionDAO.existeContratacion(existeSolicitudEmpleo, (codigoRespuesta,contratacionEmpleo)=>{
                                                if(codigoRespuesta == 500){
                                                    callback(codigoRespuesta, contratacionEmpleo)
                                                }else{
                                                    if(contratacionEmpleo == 0){
                                                        console.log(contratacionEmpleo)
                                                        //Se crea una nueva conversación de la solicitud
                                                        ConversacionDAO.crearConversacion(existeSolicitudEmpleo, (codigoRespuesta,conversacionNueva)=>{
                                                            if(conversacionNueva > 0){
                                                            
                                                                //Se crea una contratación nueva de la solicitud
                                                                ContratacionDAO.crearContratacion(existeSolicitudEmpleo,conversacionNueva, (codigoRespuesta,contratacionNueva)=>{
                                                                    if(contratacionNueva > 0){
                                                                        
                                                                        console.log('Id del empleador')
                                                                        console.log(ofertaEmpleo)

                                                                        ContratacionDAO.crearContratacionAspirante(contratacionNueva ,existeSolicitudEmpleo['id_perfil_aspirante_sa'], ofertaEmpleo, (codigoRespuesta,contratacionEmpleoAspirante)=>{
                                                                            if(contratacionEmpleoAspirante == 1){
                                                                                OfertaEmpleoDAO.reducirVacante(existeSolicitudEmpleo['id_oferta_empleo_sa'], (codigoRespuesta,reducirVacante)=>{
                                                                                    if(reducirVacante >= 1){
                                                                                        callback(204, reducirVacante)
                                                                                    }
                                                                                    
                                                                                })
                                                                                
                                                                            }else{
                                
                                                                            }
                                            
                                                                        })
                                                                        
                                                                    }

                                                                })
                                                                
                                                            }

                                                        })                
                                
                                                    }else{
                                                        //Solo se agrega al aspirante a la contratación
                                                        ContratacionDAO.crearContratacionAspirante(contratacionEmpleo ,existeSolicitudEmpleo['id_perfil_aspirante_sa'], ofertaEmpleo, (codigoRespuesta,contratacionEmpleoAspirante)=>{
                                                            if(contratacionEmpleoAspirante == 1){
                                                                OfertaEmpleoDAO.reducirVacante(existeSolicitudEmpleo['id_oferta_empleo_sa'], (codigoRespuesta, reducirVacante)=>{
                                                                    if(reducirVacante >= 0){
                                                                        callback(204, reducirVacante)
                                                                    }
                                                                    
                                                                })
                                                            }else{
                                                                callback(codigoRespuesta, contratacionEmpleoAspirante)
                                                            }
                            
                                                        })
                                                    }
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
                        
                    
                        
                    }

            }else{
                callback(codigoRespuesta, existeSolicitudEmpleo)
            }
        })

    }

    //Aspirante


    
}