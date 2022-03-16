const Pacientes = require("../models/Pacientes");

exports.create = async (req, res) => {
  const pacientesInsertados = [];
  try {
    const pacientes = req.body;
    const { codigoEstablecimiento } = req.query;
    for (let paciente of pacientes) {
      try {
        const pacientesMismoRut = await Pacientes.find({
          rut: paciente.rut,
        }).exec();
        // si existen multiples pacientes con el mismo rut, indicar el error
        if (pacientesMismoRut.length > 1) {
          pacientesInsertados.push({
            afectado: paciente.rut,
            realizado: false,
            error: `Existen ${pacientesMismoRut.length} pacientes con el rut ${paciente.rut}.`,
          });
          continue;
        }
        // si el paciente ya existe, verificar si ya existe en el hospital
        if (pacientesMismoRut.length > 0) {
          const pacienteMismoRut = pacientesMismoRut[0];
          // si ya existe en el hospital, indicar el error y decir que se inserto
          if (
            pacienteMismoRut.codigosEstablecimientos.includes(
              codigoEstablecimiento
            )
          ) {
            pacientesInsertados.push({
              afectado: paciente.rut,
              realizado: true,
              error: "El paciente ya existe.",
            });
            continue;
          }
          // si no existe en el hospital, agregar el codigo sin modificar al paciente
          pacienteMismoRut.codigosEstablecimientos.push(codigoEstablecimiento);
          const response = await Pacientes.updateOne(
            { rut: pacienteMismoRut.rut },
            pacienteMismoRut
          ).exec();
          pacientesInsertados.push({
            afectado: pacienteMismoRut.rut,
            realizado: response.modifiedCount ? true : false,
            error: response.modifiedCount
              ? ""
              : "El codigoEstablecimiento no fue agregado al paciente.",
          });
          continue;
        }
        // si el paciente no existe, se inserta
        paciente.codigosEstablecimientos = [codigoEstablecimiento];
        await Pacientes.create(paciente);
        pacientesInsertados.push({
          afectado: paciente.rut,
          realizado: true,
          error: "",
        });
      } catch (error) {
        pacientesInsertados.push({
          afectado: paciente.rut,
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
    const { codigoEstablecimiento } = req.query;
    for (let paciente of pacientes) {
      try {
        const pacientesMismoRut = await Pacientes.find({
          rut: paciente.rut,
        }).exec();
        // si el paciente no existe, reportar el error
        if (pacientesMismoRut.length === 0) {
          pacientesActualizados.push({
            afectado: paciente.rut,
            realizado: false,
            error: "El paciente no existe.",
          });
          continue;
        }
        // si existen multiples pacientes con el mismo rut, indicar el error
        if (pacientesMismoRut.length > 1) {
          pacientesActualizados.push({
            afectado: paciente.rut,
            realizado: false,
            error: `Existen ${pacientesMismoRut.length} pacientes con el rut ${paciente.rut}.`,
          });
          continue;
        }
        // si solo encontro uno para actualizar, lo actualiza
        const response = await Pacientes.updateOne(
          { rut: paciente.rut },
          paciente
        ).exec();
        pacientesActualizados.push({
          afectado: paciente.rut,
          realizado: response.modifiedCount ? true : false,
          error: response.modifiedCount
            ? ""
            : "El paciente no fue actualizado.",
        });
      } catch (error) {
        pacientesActualizados.push({
          afectado: paciente.rut,
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
      error: `Pacientes update: ${error.name} - ${error.message}`,
      respuesta: pacientesActualizados,
    });
  }
};

exports.deleteMany = async (req, res) => {
  const pacientesEliminados = [];
  try {
    const rutsPacientes = req.body;
    const { codigoEstablecimiento } = req.query;
    for (let rut of rutsPacientes) {
      try {
        const pacientesMismoRut = await Pacientes.find({ rut }).exec();
        // si el paciente no existe, reportar el error e indicar que se elimino
        if (pacientesMismoRut.length === 0) {
          pacientesEliminados.push({
            afectado: rut,
            realizado: true,
            error: "El paciente no existe.",
          });
          continue;
        }
        // si existen multiples pacientes con el mismo rut, indicar el error
        if (pacientesMismoRut.length > 1) {
          pacientesEliminados.push({
            afectado: rut,
            realizado: false,
            error: `Existen ${pacientesMismoRut.length} pacientes con el rut ${rut}.`,
          });
          continue;
        }
        // si solo encontro uno para eliminar, remueve el codigoEstablecimiento y si
        // no hay tiene mas codigosEstablecimientos lo elimina
        const pacienteMismoRut = pacientesMismoRut[0];
        const index = pacienteMismoRut.codigosEstablecimientos.indexOf(codigoEstablecimiento)
        if (index > -1) {
          pacienteMismoRut.codigosEstablecimientos.splice(index, 1);
        }
        // si aun tiene codigosEstablecimientos, lo actualiza y no lo elimina
        if (pacienteMismoRut.codigosEstablecimientos.length > 0) {
          const response = await Pacientes.updateOne(
            { rut: pacienteMismoRut.rut },
            pacienteMismoRut
          ).exec();
          pacientesInsertados.push({
            afectado: pacienteMismoRut.rut,
            realizado: response.modifiedCount ? true : false,
            error: response.modifiedCount
              ? ""
              : "El codigoEstablecimiento no fue eliminado del paciente.",
          });
          continue;
        }
        const response = await Pacientes.deleteOne({ rut }).exec();
        pacientesEliminados.push({
          afectado: rut,
          realizado: response.deletedCount ? true : false,
          error: response.deletedCount ? "" : "El paciente no fue eliminado.",
        });
      } catch (error) {
        pacientesEliminados.push({
          afectado: rut,
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
