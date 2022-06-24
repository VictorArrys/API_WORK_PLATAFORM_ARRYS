var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes')
const { Usuario } = require("../modelo/Usuario")

exports.UsuarioDAO = class UsuarioDAO {
    static getUsuarios(callback) {
        var query = 'SELECT * FROM perfil_usuario;'

        mysqlConnection.query(query, (error, resultadoUsuarios) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else if (resultadoUsuarios.length == 0){
                callback(404, mensajes.errorInterno)
            }else{
                var cont = 0 
                var usuarios = []
    
                do{
                    usuarios.push(cont)
    
                    usuarios[cont] = {
                        'idPerfilUsuario' : resultadoUsuarios[cont]['id_perfil_usuario'],
                        'nombreUsuario': resultadoUsuarios[cont]['nombre_usuario'],
                        'estatus': resultadoUsuarios[cont]['estatus'],
                        'clave': resultadoUsuarios[cont]['clave'],
                        'correoElectronico' : resultadoUsuarios[cont]['correo_electronico'],
                        'tipoUsuario' : resultadoUsuarios[cont]['tipo_usuario']
                    }
                    cont ++;
                } while(cont < resultadoUsuarios.length)

                callback(200, usuarios)
            }
        })
    }

    static getUsuario(idUsuario, callback) {
        var query = 'SELECT * FROM perfil_usuario WHERE id_perfil_usuario = ?;'

        mysqlConnection.query(query, [idUsuario], (error, resultadoUsuario) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else if (resultadoUsuario.length == 0){
                callback(404, mensajes.peticionNoEncontrada)
            }else{
                var arrayFotografia = null
                if (resultadoUsuario[0].fotografia == null){
                    console.log('Fotografia vacia, se procede a poner null')
                }else{
                    arrayFotografia = Uint8ClampedArray.from(Buffer.from(resultadoUsuario[0].fotografia.buffer, 'base64'))
                }
                
                var usuario = resultadoUsuario[0]

                const getUsuario = {};
                getUsuario['application/json'] = {
                    "clave" : usuario['clave'],
                    "estatus" : usuario['estatus'],
                    "idPerfilusuario" : usuario['id_perfil_usuario'],
                    "correoElectronico" : usuario['correo_electronico'],
                    "fotografia" : arrayFotografia,
                    "nombre": usuario['nombre_usuario'],
                    "tipoUsuario" : usuario['tipo_usuario'],
                }

                callback(200, getUsuario['application/json'])

            }
        })
    }

    static postUsuario(usuario, callback) {
        var query = 'INSERT INTO perfil_usuario (nombre_usuario, estatus, clave, correo_electronico, tipo_usuario) VALUES (?, ?, ?, ?, ?);'
        var usuarioPerfil = new Usuario()

        usuarioPerfil.nombreUsuario = usuario.nombreUsuario
        usuarioPerfil.estatus = usuario.estatus
        usuarioPerfil.clave = usuario.clave
        usuarioPerfil.correoElectronico = usuario.correoElectronico
        usuarioPerfil.tipoUsuario = usuario.tipoUsuario

        mysqlConnection.query(query, [usuarioPerfil.nombreUsuario, usuarioPerfil.estatus, usuarioPerfil.clave, usuarioPerfil.correoElectronico, usuarioPerfil.tipoUsuario], (error, resultadoRegistroUsuario) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else if (resultadoRegistroUsuario.length == 0){
                callback(404, mensajes.peticionNoEncontrada)
            }else{
                if (resultadoRegistroUsuario['affectedRows'] == 1){
                    const registroUsuario = {}

                    var idUsuario = resultadoRegistroUsuario.insertId

                    registroUsuario['application/json'] = {
                        'clave': usuarioPerfil.clave,
                        'correoElectronico': usuarioPerfil.correoElectronico,
                        'estatus': usuarioPerfil.estatus,
                        'idPerfilUsuario': idUsuario,
                        'nombreUsuario': usuarioPerfil.nombreUsuario
                    };
    
                    callback(201 ,registroUsuario['application/json'])
                }
            }
        })
    }

    static putUsuario(usuario, callback){ 
        var query = 'UPDATE perfil_usuario SET nombre_usuario = ?, clave = ?, correo_electronico = ? WHERE id_perfil_usuario = ?;'
        var usuarioEdicion = new Usuario();

        usuarioEdicion.nombreUsuario = usuario.nombreUsuario
        usuarioEdicion.clave = usuario.clave
        usuarioEdicion.correoElectronico = usuario.correoElectronico
        usuarioEdicion.tipoUsuario = usuario.tipoUsuario
        usuarioEdicion.idPerfilUsuario = usuario.idPerfilUsuario

        mysqlConnection.query(query, [usuarioEdicion.nombreUsuario, usuarioEdicion.clave, usuarioEdicion.correoElectronico, usuarioEdicion.idPerfilUsuario], (error, edicionUsuario) => {
            if (error){
                callback(500, mensajes.errorInterno)
            }else if (edicionUsuario.length == 0){
                callback(404, mensajes.peticionNoEncontrada)
            }else{
                const registroUsuario = {}

                    var idUsuario = edicionUsuario.insertId

                    edicionUsuario['application/json'] = {
                        'clave': usuarioEdicion.clave,
                        'correoElectronico': usuarioEdicion.correoElectronico,
                        'estatus': usuarioEdicion.estatus,
                        'idPerfilUsuario': idUsuario,
                        'nombreUsuario': usuarioEdicion.nombreUsuario
                    };
    
                    callback(200 , edicionUsuario['application/json'])
            }
        })
    }

    static patchFotografiaUsuario(idUsuario, fotografia, callback) {
        var query = 'UPDATE perfil_usuario SET fotografia = ? WHERE id_perfil_usuario = ?;'

        mysqlConnection.query(query, [fotografia, idUsuario], (error, resultadoFotografia) =>{
            if (error){
                callback(500, mensajes.errorInterno)
            }else if (resultadoFotografia.length == 0){
                callback(404, mensajes.peticionNoEncontrada)
            }else{
                callback(200, mensajes.actualizacionExitosa)
            }
        })
    }
}