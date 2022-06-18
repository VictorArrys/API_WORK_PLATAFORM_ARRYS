const {Usuario} = require('../modelo/Usuario')

exports.UsuarioDAO = class UsuarioDAO {
    static iniciarSesion(usuario, password, callback) {
        console.log("Llamada a iniciae sesion")
        callback(null, new Usuario());
    }

    static restablecerContraseña(correoElectronico, callback) {
        callback(null,{});
    }

    static cerrarSesion(idUsuario, callback) {

        callback(null, {});
    }
}