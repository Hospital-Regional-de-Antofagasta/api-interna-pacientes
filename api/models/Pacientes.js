const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Paciente = mongoose.model(
  "paciente",
  new Schema(
    {
      rut: { type: String, require: true, unique: true },
      nombreSocial: String,
      nombre: String,
      apellidoPaterno: String,
      apellidoMaterno: String,
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
      codigosEstablecimientos: [String],
      datosContactoActualizados: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

module.exports = Paciente;
