const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Paciente = mongoose.model(
  "paciente",
  new Schema(
    {
      numeroPaciente: {
        type: Number,
        require: true,
        unique: true,
      },
      rut: String,
      apellidoPaterno: String,
      apellidoMaterno: String,
      nombre: String,
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
      datosContactoActualizados: { type: Boolean, default: false },
      fechaFallecimiento: Date,
    },
    { timestamps: true }
  )
);

module.exports = Paciente;
