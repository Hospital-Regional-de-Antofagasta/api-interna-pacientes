const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp_pacientes";

if (env === "test") db = `${db}_1_test`;

const conection = mongoose.connection.useDb(db);

const Paciente = conection.model(
  "paciente",
  new Schema(
    {
      rut: { type: String, required: true, unique: true },
      nombreSocial: String,
      nombre: { type: String },
      apellidoPaterno: { type: String },
      apellidoMaterno: { type: String },
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
      codigosEstablecimientos: [String],
      datosContactoActualizados: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

module.exports = Paciente;
