const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp";

if (env === "test") db = `${db}_1_test`;

const conection = mongoose.connection.useDb(db);

const Paciente = conection.model(
  "paciente",
  new Schema(
    {
      numeroPaciente: { type: Number, require: true },
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
  ) //.index({ "numeroPaciente.numero": 1, "numeroPaciente.codigoEstablecimiento": 1 },{ unique: true })
);

module.exports = Paciente;
