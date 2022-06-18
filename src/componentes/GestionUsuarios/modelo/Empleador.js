const {Usuario} = require('./Usuario');

exports.Empleador = class Empleador extends Usuario {
    idPerfilEmpleador; 
    nombreOrganizacion;
    nombreEmpleador; 
    direccion; 
    fechaNacimiento; 
    telefono; 
    amonestaciones;
}