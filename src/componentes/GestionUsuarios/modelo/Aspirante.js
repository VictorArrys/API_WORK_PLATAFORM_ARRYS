const {Usuario} = require('./Usuario');

exports.Aspirante = class Aspirante extends Usuario {
    direccion;
    fechaNacimiento;
    idPerfilAspirante;
    nombre;
    telefono;
    video;
    oficios;
}