//data
const { CategoriaEmpleoDAO } = require('./data/CategoriaEmpleoDAO');
const { ContratacionDAO } = require('./data/ContratacionDAO');
const { OfertaEmpleoDAO } = require('./data/OfertaEmpleoDAO');

//dataType
const { OfertaEmpleoDT } = require('./datatype/OfertaEmpleoDT');

//modelo
const { Fotografia } = require('./modelo/Fotografia')
const { OfertaEmpleo } = require('./modelo/OfertaEmpleo')

exports.GestionOfertasEmpleo = class GestionOfertasEmpleo {
    //Empleador
    static getOfertasEmpleo(idEmpleador, callback) {
        OfertaEmpleoDAO.getOfertasEmpleo(idEmpleador, callback);
    }

    static getOfertaEmpleo(idOfertaEmpleo, idUsuario, callback) {
        OfertaEmpleoDAO.getOfertaEmpleo(idOfertaEmpleo, idUsuario, (codigoRespuesta, cuerpoRespuestaOferta)=>{
            if(codigoRespuesta == 200) {
                //CuerpoRespuesta es tipo OfertaEmpleo
                ContratacionDAO.getContratacionEmpleo(cuerpoRespuestaOferta.idOfertaEmpleo, (codigoRespuesta, cuerpoRespuestaContratacion)=> {
                    if (codigoRespuesta == 200) {
                        CategoriaEmpleoDAO.getCategoriaEmpleo(cuerpoRespuestaOferta.idOfertaEmpleo, (codigoRespuesta, cuerpoRespuestaCategoria) => {
                            if(codigoRespuesta == 200) {
                                var ofertaEmpleo = new OfertaEmpleoDT();
                                ofertaEmpleo.contratacion = cuerpoRespuestaContratacion;
                                ofertaEmpleo.categoriaEmpleo = cuerpoRespuestaCategoria.nombre;
                                //Falta agregar datos de oferta, contratacion y categoría
                                callback(200, ofertaEmpleo);
                            } else {
                                callback(codigoRespuesta, cuerpoRespuestaCategoria);
                            }
                        });
                    } else {
                        callback(codigoRespuesta, cuerpoRespuestaContratacion);
                    }
                })
            } else {
                callback(codigoRespuesta, cuerpoRespuestaOferta)
            }
        });
    }

    static putOfertaEmpleo(ofertaEmpleo, idUsuario, callback) {
        //ofertaEmpleo debe ser <<OfertaEmpleo>>
        OfertaEmpleoDAO.putOfertaEmpleo(ofertaEmpleo, idUsuario, callback);
    }

    static getFotografiasOfertaEmpleo(idOfertaEmpleo, callback) {
        OfertaEmpleoDAO.getFotografiasOfertaEmpleo(idOfertaEmpleo, callback);
    }

    static postFotografiaOfertaEmpleo(idOfertaEmpleo, bufferFotografia, callback) {
        OfertaEmpleoDAO.postFotografiaOfertaEmpleo(idOfertaEmpleo, bufferFotografia, callback);
    }

    static putFotografiaOfertaEmpleo(idOfertaEmpleo, idFotografia, bufferFotografia, callback) {
        var fotografia = new Fotografia();
        fotografia.idFoto = idFotografia;
        fotografia.fotografia = bufferFotografia;

        OfertaEmpleoDAO.putFotografiaOfertaEmpleo(idOfertaEmpleo, fotografia, callback);    
    }

    static postOfertaEmpleo(idEmpleador, ofertaEmpleo, callback) {
        //ofertaEmpleo debe ser de tipo <<OfertaEmpleo>>
        OfertaEmpleo.postOfertaEmpleo(idEmpleador, ofertaEmpleoNueva, callback);
    }

    //Aspirante
    static getOfertasEmpleoAspirante(arregloIdCategoria, callback) {
        OfertaEmpleoDAO.getOfertasEmpleoAspirante(arregloIdCategoria, callback);
    }

    static getOfertaEmpleoAspirante(idOfertaEmpleo, callback) {
        OfertaEmpleoDAO.getOfertaEmpleoAspirante(idOfertaEmpleo, callback);
    }
}