const Paciente = require("../models/Pacientes");
const Pacientes = require("../models/Pacientes");
const PacientesActualizados = require("../models/PacientesActualizados");

// obtener el ultimo paciente ingresado a la bd
exports.getLast = async (req, res) => {
  try {
    const paciente = await Pacientes.findOne({
      "numerosPaciente.codigoEstablecimiento": req.params.codigoEstablecimiento, //Código E01 es el Hospital Regional de Antofagasta
    })
      .sort({ "numerosPaciente.numero": -1 })
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

// actualizar paciente en la bd 
exports.update = async (req, res) => {
  try {
    const filter = {
      "numerosPaciente.numero": req.params.numeroPaciente,
      "numerosPaciente.codigoEstablecimiento": req.params.codigoEstablecimiento,
    };
    const update = req.body;
    await Pacientes.updateOne(filter, update).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes update: ${error.name} - ${error.message}`,
    });
  }
};

// eliminar paciente en la bd 
exports.delete = async (req, res) => {
  try {
    const filter = {
      "numerosPaciente.numero": req.params.numeroPaciente,
      "numerosPaciente.codigoEstablecimiento": req.params.codigoEstablecimiento,
    };
    const update = req.body;
    await Pacientes.deleteOne(filter, update).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes delete: ${error.name} - ${error.message}`,
    });
  }
};

exports.getPacientesActualizados = async (req, res) => {
  try {
    const pacientesActualizados = await PacientesActualizados.find({
      "numeroPaciente.codigoEstablecimiento": req.params.codigoEstablecimiento,
    }).exec();
    res.status(200).send(pacientesActualizados);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes getPacientesActualizados: ${error.name} - ${error.message}`,
    });
  }
};

exports.updateAndDeleteSolicitud = async (req, res) => {
  try {
    const filtro = {
      "numeroPaciente.numero": req.params.numeroPaciente,
      "numeroPaciente.codigoEstablecimiento": req.params.codigoEstablecimiento,
    };
    const pacienteActualizado = await PacientesActualizados.findOne(
      filtro
    ).exec();
    if (!pacienteActualizado)
      return res.status(404).send({ respuesta: "Paciente no encontrado." });
    // obtener solo los campos que se debe actualizar
    const { _id, __v, createdAt, updatedAt, ...datosPacienteActualizado } =
      pacienteActualizado.toObject();
    await Paciente.updateOne(
      { _id: pacienteActualizado.idPaciente },
      datosPacienteActualizado
    ).exec();
    await PacientesActualizados.deleteOne(filtro).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes updateAndDeleteSolicitud: ${error.name} - ${error.message}`,
    });
  }
};
