const { Usuario } = require("./Usuario");

exports.Demandante = class Demandante extends Usuario {
  idPerfilDemandante;
  nombre;
  fechaNacimiento;
  telefono;
  direccion;
};
