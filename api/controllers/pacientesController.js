const Paciente = require("../models/Pacientes");
const Pacientes = require("../models/Pacientes");
const PacientesActualizados = require("../models/PacientesActualizados");

// obtener el ultimo paciente ingresado a la bd
exports.getLast = async (req, res) => {
  try {
    const paciente = await Pacientes.findOne()
      .sort({ numeroPaciente: -1 })
      .exec();
    res.status(200).send(paciente);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes getLast: ${error.name} - ${error.message}`,
    });
  }
};

// crear paciente recibido en la bd
exports.create = async (req, res) => {
  try {
    await Pacientes.create(req.body);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes create: ${error.name} - ${error.message}`,
    });
  }
};

// actualizar paciente en la bd recibiendo el numero de paciente
exports.update = async (req, res) => {
  try {
    const filter = { numeroPaciente: req.params.numeroPaciente };
    const update = req.body;
    await Pacientes.updateOne(filter, update).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes update: ${error.name} - ${error.message}`,
    });
  }
};

exports.getPacientesActualizados = async (req, res) => {
  try {
    const pacientesActualizados = await PacientesActualizados.find().exec();
    res.status(200).send(pacientesActualizados);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes getPacientesActualizados: ${error.name} - ${error.message}`,
    });
  }
};

exports.updateAndDeleteSolicitud = async (req, res) => {
  try {
    const numeroPaciente = req.params.numeroPaciente;
    const pacienteActualizado = await PacientesActualizados.findOne({
      numeroPaciente,
    }).exec();
    if (!pacienteActualizado)
      return res.status(404).send({ respuesta: "Paciente no encontrado." });
    // obtener solo los campos que se debe actualizar
    const { _id, __v, createdAt, updatedAt, ...datosPacienteActualizado } = pacienteActualizado.toObject();
    await Paciente.updateOne(
      { numeroPaciente },
      datosPacienteActualizado
    ).exec();
    await PacientesActualizados.deleteOne({ numeroPaciente }).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes updateAndDeleteSolicitud: ${error.name} - ${error.message}`,
    });
  }
};
