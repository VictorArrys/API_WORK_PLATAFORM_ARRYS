const {Usuario} = require('./Usuario');

exports.Administrador = class Administrador extends Usuario{
    nombre;
    telefono;
    idPerfilAdministrador;
};