const {Usuario} = require('./Usuario');

exports.Empleador = class Empleador extends Usuario {
    idPerfilEmpleador;
    nombre;
}