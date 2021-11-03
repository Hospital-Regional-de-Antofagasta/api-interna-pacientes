const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Paciente = mongoose.model(
  "paciente",
  new Schema(
    {
      correlativo: { type: Number, require: true, unique: true },
      numeroPaciente: { type: Number, require: true, unique: true },
      nombreSocial: String,
      nombre: String,
      apellidoPaterno: String,
      apellidoMaterno: String,
      rut: String,
      detallesDireccion: String,
      direccionNumero: String,
      direccion: String,
      direccionPoblacion: String,
      codigoComuna: String,
      codigoCiudad: String,
      codigoRegion: String,
      telefonoFijo: String,
      telefonoMovil: String,
      correoCuerpo: String,
      correoExtension: String,
      fechaFallecimiento: Date,
      datosContactoActualizados: { type: Boolean, default: false },
    },
    { timestamps: true }
  ) //.index({ "numeroPaciente.numero": 1, "numeroPaciente.codigoEstablecimiento": 1 },{ unique: true })
);

module.exports = Paciente;
