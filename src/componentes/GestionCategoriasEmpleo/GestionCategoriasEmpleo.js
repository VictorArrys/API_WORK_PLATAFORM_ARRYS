const {CategoriaEmpleoDAO} = require('./data/CategoriaEmpleoDAO')

exports.GestionCategoriasEmpleo = class GestionCategoriasEmpleo {
    static getCategoriasEmpleo(callback) {
        CategoriaEmpleoDAO.getCategoriasEmpleo(callback);
    }
    static postCategoriaEmpleo(nombre, callback) {
        CategoriaEmpleoDAO.postCategoriaEmpleo(nombre, callback);
    }

    static patchCategoriaEmpleo(idCategoriaEmpleo, nombre, callback) {
        CategoriaEmpleoDAO.patchCategoriaEmpleo(idCategoriaEmpleo, nombre, callback);
    }

    static deleteCategoriaEmpleo(idCategoriaEmpleo, callback) {
        CategoriaEmpleoDAO.deleteCategoriaEmpleo(idCategoriaEmpleo, callback);
    }
}