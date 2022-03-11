const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp_pacientes";

if (env === "test") db = `${db}_2_test`;

const conection = mongoose.connection.useDb(db);

const PacientesActualizados = conection.model(
  "pacientes_actualizado",
  new Schema(
    {
      idPaciente: { type: String, required: true },
      rut: { type: String, required: true },
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
      codigoEstablecimiento: { type: String, required: true },
    },
    { timestamps: true }
  )
);

module.exports = PacientesActualizados;
