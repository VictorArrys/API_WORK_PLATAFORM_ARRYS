const {UsuarioDAO} =require('./dao/UsuarioDAO')

exports.AccesoSistema = class AccesoSistema {
    //funcionRespuesta lleva parametro error y resultado
    static iniciarSesion(usuario, password, funcionRespuesta) {
        UsuarioDAO.iniciarSesion(usuario, password, funcionRespuesta);
    }

    static restablecerContraseña(correoElectronico, funcionRespuesta) {
        UsuarioDAO.restablecerContraseña(correoElectronico, funcionRespuesta)
    }
}