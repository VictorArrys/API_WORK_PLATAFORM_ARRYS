exports.ConversacionesAspirante = class {
  idConversacion;
  tituloEmpleo;
  fechaContratacion;
};

exports.ConversacionesDemandante = class {
  idConversacion;
  tituloSolicitud;
  fechaContratacion;
  nombreAspirante;
};

exports.ConversacionesEmpleador = class {
  idConversacion;
  categoriaEmpleo;
  tituloOfertaEmpleo;
};
