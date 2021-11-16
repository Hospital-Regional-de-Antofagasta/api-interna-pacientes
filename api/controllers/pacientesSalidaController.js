const Pacientes = require("../models/Pacientes");

exports.create = async (req, res) => {
  const pacientesInsertados = [];
  try {
    const pacientes = req.body;
    for (let paciente of pacientes) {
      try {
        const filter = { correlativo: paciente.correlativo };
        const pacienteAInsertar = await Pacientes.find(filter).exec();
        if (pacienteAInsertar.length > 0) {
          pacientesInsertados.push({
            afectado: paciente.correlativo,
            realizado: true,
            error: "El paciente ya existe.",
          });
          continue;
        }
        await Pacientes.create(paciente);
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
      respuesta: pacientesInsertados,
    });
  } catch (error) {
    res.status(500).send({
      error: `Pacientes create: ${error.name} - ${error.message}`,
      respuesta: pacientesInsertados,
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
            error: "El paciente no existe.",
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
          error: response.modifiedCount
            ? ""
            : "El paciente no fue actualizado.",
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
      respuesta: pacientesActualizados,
    });
  } catch (error) {
    res.status(500).send({
      error: `Actualizar pacientes: ${error.name} - ${error.message}`,
      respuesta: pacientesActualizados,
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
            error: "El paciente no existe.",
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
      respuesta: pacientesEliminados,
    });
  } catch (error) {
    res.status(500).send({
      error: `Pacientes delete: ${error.name} - ${error.message}`,
      respuesta: pacientesEliminados,
    });
  }
};
