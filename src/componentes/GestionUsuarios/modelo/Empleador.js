const { Usuario } = require("./Usuario");

exports.Empleador = class Empleador extends Usuario {
  idPerfilEmpleador;
  nombreOrganizacion;
  nombre;
  direccion;
  fechaNacimiento;
  telefono;
  amonestaciones;
};
