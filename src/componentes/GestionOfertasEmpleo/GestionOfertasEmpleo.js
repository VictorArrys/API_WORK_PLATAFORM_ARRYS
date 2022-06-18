const {OfertaEmpleoDAO} = require('./data/OfertaEmpleoDAO')
const {Fotografia} = require('./modelo/Fotografia')

exports.GestionOfertasEmpleo = class GestionOfertasEmpleo {
    //Empleador
    static getOfertasEmpleo(idEmpleador, callback) {

    }

    static getOfertaEmpleo(idOfertaEmpleo, callback) {

    }

    static getFotografiasOfertaEmpleo(idOfertaEmpleo, callback) {

    }

    static postFotografiaOfertaEmpleo(idOfertaEmpleo, fotografia, callback) {

    }

    static putFotografiaOfertaEmpleo(idOfertaEmpleo, idFotografia, bufferFotografia, callback) {
        var fotografia = new Fotografia();
        fotografia.idFotografia = idFotografia;
        fotografia.fotografia = bufferFotografia;

        OfertaEmpleoDAO.putFotografiaOfertaEmpleo(idOfertaEmpleo, fotografia, callback);    
    }

    static postOfertaEmpleo(idEmpleador, ofertaEmpleo, callback) {

    }

    static putOfertaEmpleo(ofertaEmpleo, callback) {
        
    }
}