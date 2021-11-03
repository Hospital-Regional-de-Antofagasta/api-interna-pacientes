const Pacientes = require("../models/Pacientes");
const PacientesActualizados = require("../models/PacientesActualizados");

// Obtener el ultimo paciente registrado en la bd MongoDB del establecimiento dado.
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

exports.create = async (req, res) => {
  const pacientesInsertados = [];
  try {
    const pacientes = req.body;
    for (let paciente of pacientes) {
      try {
        const pacienteInsertado = await Pacientes.create(paciente);
        pacientesInsertados.push({
          afectado: paciente.correlativo,
          realizado: true,
          error: "",
        });
      } catch (error) {
        pacientesInsertados.push({
          afectado: paciente.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(201).send({
      resultados: pacientesInsertados,
    });
  } catch (error) {
    res.status(500).send({
      error: `Pacientes create: ${error.name} - ${error.message}`,
      resultados: pacientesInsertados,
    });
  }
};

// Actualizar paciente en la bd MongoDB.
exports.update = async (req, res) => {
  try {
    const filter = {
      numeroPaciente: req.params.numeroPaciente,
    };
    const update = {
      rut: req.body.rut,
      apellidoPaterno: req.body.apellidoPaterno,
      apellidoMaterno: req.body.apellidoMaterno,
      nombre: req.body.nombre,
      nombreSocial: req.body.nombreSocial,
      detallesDireccion: req.body.detallesDireccion,
      direccionNumero: req.body.direccionNumero,
      direccion: req.body.direccion,
      direccionPoblacion: req.body.direccionPoblacion,
      codigoComuna: req.body.codigoComuna,
      codigoCiudad: req.body.codigoCiudad,
      codigoRegion: req.body.codigoRegion,
      telefonoFijo: req.body.telefonoFijo,
      telefonoMovil: req.body.telefonoMovil,
      correoCuerpo: req.body.correoCuerpo,
      correoExtension: req.body.correoExtension,
      fechaFallecimiento: req.body.fechaFallecimiento,
    };
    await Pacientes.updateOne(filter, update).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes update: ${error.name} - ${error.message}`,
    });
  }
};

exports.updateMany = async (req, res) => {
  const pacientesActualizados = [];
  try {
    const pacientes = req.body;
    for (let paciente of pacientes) {
      try {
        const filter = { correlativo: paciente.correlativo };
        const pacienteAActualizar = await Pacientes.find(filter).exec();
        if (pacienteAActualizar.length === 0) {
          pacientesActualizados.push({
            afectado: paciente.correlativo,
            realizado: false,
            error: "El paciente no fue encontrado.",
          });
          continue;
        }
        if (pacienteAActualizar.length > 1) {
          pacientesActualizados.push({
            afectado: paciente.correlativo,
            realizado: false,
            error: `${pacienteAActualizar.length} pacientes encontrados.`,
          });
          continue;
        }
        // solo encontro uno para actualizar
        const response = await Pacientes.updateOne(filter, paciente).exec();
        pacientesActualizados.push({
          afectado: paciente.correlativo,
          realizado: response.modifiedCount ? true : false,
          error: response.modifiedCount ? "" : "El paciente no fue actualizado.",
        });
      } catch (error) {
        pacientesActualizados.push({
          afectado: paciente.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      resultados: pacientesActualizados,
    });
  } catch (error) {
    res.status(500).send({
      error: `Actualizar pacientes: ${error.name} - ${error.message}`,
      resultados: pacientesActualizados,
    });
  }
};

// Eliminar paciente de la bd MongoDB.
exports.delete = async (req, res) => {
  try {
    const filter = {
      numeroPaciente: req.params.numeroPaciente,
    };
    await Pacientes.deleteOne(filter).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes delete: ${error.name} - ${error.message}`,
    });
  }
};

// Registrar pacientes en la bd MongoDB.
exports.deleteMany = async (req, res) => {
  const pacientesEliminados = [];
  try {
    const correlativosPacientes = req.body;
    for (let correlativo of correlativosPacientes) {
      try {
        const filter = { correlativo };
        const pacienteAEliminar = await Pacientes.find(filter).exec();
        if (pacienteAEliminar.length === 0) {
          pacientesEliminados.push({
            afectado: correlativo,
            realizado: true,
            error: "",
          });
          continue;
        }
        if (pacienteAEliminar.length > 1) {
          pacientesEliminados.push({
            afectado: correlativo,
            realizado: false,
            error: `${pacienteAEliminar.length} pacientes encontrados.`,
          });
          continue;
        }
        // solo encontro uno para eliminar
        const response = await Pacientes.deleteOne(filter).exec();
        pacientesEliminados.push({
          afectado: correlativo,
          realizado: response.deletedCount ? true : false,
          error: response.deletedCount ? "" : "El paciente no fue eliminado.",
        });
      } catch (error) {
        pacientesEliminados.push({
          afectado: correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      resultados: pacientesEliminados,
    });
  } catch (error) {
    res.status(500).send({
      error: `Pacientes delete: ${error.name} - ${error.message}`,
      resultados: pacientesEliminados,
    });
  }
};

// Obtiene las solicitudes de actualización de datos de contacto del establecimiento dado.
exports.getPacientesActualizados = async (req, res) => {
  try {
    const pacientesActualizados = await PacientesActualizados.find()
      .limit(100)
      .exec();
    res.status(200).send(pacientesActualizados);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes getPacientesActualizados: ${error.name} - ${error.message}`,
    });
  }
};

//Actualiza un paciente en la db MongoDB y elimina la solicitud de actualización del paciente  y establecimiento dados.
exports.updateAndDeleteSolicitud = async (req, res) => {
  try {
    const filtro = {
      numeroPaciente: req.params.numeroPaciente,
    };
    const pacienteActualizado = await PacientesActualizados.findOne(
      filtro
    ).exec();
    if (!pacienteActualizado)
      return res.status(404).send({ respuesta: "Paciente no encontrado." });
    // obtener solo los campos que se debe actualizar
    const { _id, __v, createdAt, updatedAt, ...datosPacienteActualizado } =
      pacienteActualizado.toObject();
    await Pacientes.updateOne(
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
