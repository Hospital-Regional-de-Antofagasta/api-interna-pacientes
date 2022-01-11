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
      rut: { type: String, require: true, unique: true },
      nombreSocial: String,
      nombre: { type: String, require: true },
      apellidoPaterno: { type: String, require: true },
      apellidoMaterno: { type: String, require: true },
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
