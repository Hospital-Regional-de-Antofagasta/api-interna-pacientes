const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Paciente = mongoose.model(
  "paciente",
  new Schema(
    {
      numerosPaciente: [
        {
          _id: false,
          idNumero: String,
          numero: { type: Number, require: true },
          codigoEstablecimiento: { type: String, require: true },
          hospital: {},
          nombreEstablecimiento: String,
        },
      ],
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
      nombreSocial: String,
    },
    { timestamps: true }
  ).index({'numerosPaciente.numero':1,'numerosPaciente.codigoEstablecimiento':1},{unique: true})
);

module.exports = Paciente;
