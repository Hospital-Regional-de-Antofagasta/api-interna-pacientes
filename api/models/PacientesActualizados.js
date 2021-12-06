const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PacientesActualizados = mongoose.model(
  "pacientes_actualizado",
  new Schema(
    {
      idPaciente: String,
      rut: { type: String, require: true },
      direccion: String,
      direccionNumero: String,
      detallesDireccion: String,
      direccionPoblacion: String,
      codigoComuna: String,
      codigoCiudad: String,
      codigoRegion: String,
      telefonoFijo: String,
      telefonoMovil: String,
      correoCuerpo: String,
      correoExtension: String,
      codigoEstablecimiento: String,
    },
    { timestamps: true }
  )
);

module.exports = PacientesActualizados;
