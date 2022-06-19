const {UsuarioDAO} = require('./data/UsuarioDAO')

exports.AccesoSistema = class AccesoSistema {
    //funcionRespuesta lleva parametro error y resultado
    static iniciarSesion(usuario, password, funcionRespuesta) {
        UsuarioDAO.iniciarSesion(usuario, password, funcionRespuesta);
    }

    static restablecerContraseña(correoElectronico, funcionRespuesta) {
        UsuarioDAO.restablecerContraseña(correoElectronico, funcionRespuesta);
    }

    static cerrarSesion(idUsuario, callback) {
        UsuarioDAO.cerrarSesion(idUsuario, callback);
    }

    static habilitarPerfil(idUsuario, funcionRespuesta) {
        UsuarioDAO.habilitarPerfil(idUsuario, funcionRespuesta)
    }

    static deshabilitarPerfil(idUsuario, funcionRespuesta) {
        UsuarioDAO.deshabilitarPerfil(idUsuario, funcionRespuesta);
    }
}