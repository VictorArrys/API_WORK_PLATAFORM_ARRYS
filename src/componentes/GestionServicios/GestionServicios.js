const {SolicitudServicioDAO} = require('./data/SolicitudServicioDAO')
const {ContratacionServicioDAO} = require('./data/ContratacionServicioDAO')
const {SolicitudServicio} = require('./modelo/SolicitudServicio')

exports.GestionServicios = class GestionServicios {
    
    //Acciones de demandante
    static getContratacionesServicioDemandante(idDemandante, callback){
        ContratacionServicioDAO.getContratacionesServicioDemandante(idDemandante, callback);
    }

    static getContratacionesServicioAspirante(idAspirante, callback) {
        ContratacionServicioDAO.getContratacionesServicioAspirante(idAspirante, callback);
    }

    static finalizarContratacionServicio(idDemandante, idContratacionServicio, callback) {
        ContratacionServicioDAO.finalizarContratacionServicio(idDemandante, idContratacionServicio, callback);
    }
    
    static evaluarAspirante(idDemandante, idContratacionServicio, puntuacion, callback) {
        ContratacionServicioDAO.evaluarAspirante(idDemandante, idContratacionServicio, puntuacion, callback);
    }

    static postSolicitudServicio(idAspirante, idDemandante, titulo, descripcion, callback) {
        var solicitud = new SolicitudServicio();
        solicitud.idDemandante = idDemandante;
        solicitud.idPerfilAspirante = idAspirante;
        solicitud.titulo = titulo;
        solicitud.descripcion = descripcion;
        SolicitudServicioDAO.postSolicitudServicio(solicitud, callback);
    }

    static getSolicitudesServicioDemandante(idDemandante, callback) {
        SolicitudServicioDAO.getSolicitudesServicioDemandante(idDemandante, callback);
    }


    //Aspirante
    static getSolicitudesServicioAspirante(idAspirante, estatus, callback) {
        SolicitudServicioDAO.getSolicitudesServicioAspirante(idAspirante, estatus, callback)
    }

    static getSolicitudServicioAspirante(idAspirante, idSolicitud, callback) {
        SolicitudServicioDAO.getSolicitudServicioAspirante(idAspirante,idSolicitud, callback);
    }

    static aceptarSolicitudServicio(idAspirante, idSolicitud, callback) {
        SolicitudServicioDAO.aceptarSolicitud(idAspirante, idSolicitud, callback);
    }

    static rechazarSolicitudServicio(idAspirante, idSolicitud, callback) {
        SolicitudServicioDAO.rechazarSolicitud(idAspirante,idSolicitud, callback);
    }
}