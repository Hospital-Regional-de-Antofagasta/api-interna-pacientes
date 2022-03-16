const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp";

if (env === "test") db = `${db}_2_test`;

const conection = mongoose.connection.useDb(db);

const PacientesActualizados = conection.model(
  "pacientes_actualizado",
  new Schema(
    {
      idPaciente: String,
      numeroPaciente: { type: Number, require: true },
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
    },
    { timestamps: true }
  ) //.index({'numeroPaciente.numero':1,'numeroPaciente.codigoEstablecimiento':1},{unique: true})
);

module.exports = PacientesActualizados;
