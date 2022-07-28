const PacientesActualizados = require("../models/PacientesActualizados");
const SolicitudesIdsSuscriptorPacientes = require("../models/SolicitudesIdsSuscriptorPacientes");

exports.getSolicitudesActualizacion = async (req, res) => {
  try {
    const { codigoEstablecimiento } = req.query;
    const pacientesActualizados = await PacientesActualizados.find({
      codigoEstablecimiento,
    })
      .limit(100)
      .exec();
    res.status(200).send({ respuesta: pacientesActualizados });
  } catch (error) {
    res.status(500).send({
      error: `Pacientes getPacientesActualizados: ${error.name} - ${error.message}`,
    });
  }
};

exports.deleteSolicitudesActualizacion = async (req, res) => {
  const solicitudesEliminadas = [];
  try {
    const rutsPacientes = req.body;
    const { codigoEstablecimiento } = req.query;
    for (let rut of rutsPacientes) {
      try {
        const solicitudAEliminar = await PacientesActualizados.find({
          $and: [{ rut }, { codigoEstablecimiento }],
        }).exec();
        // si no existe la solicitud, reportar el error e indicar que se elimino
        if (solicitudAEliminar.length === 0) {
          solicitudesEliminadas.push({
            afectado: rut,
            realizado: true,
            error: "La solicitud no existe.",
          });
          continue;
        }
        // si existen multiples solicitudes con el mismo rut, indicar el error
        if (solicitudAEliminar.length > 1) {
          solicitudesEliminadas.push({
            afectado: rut,
            realizado: false,
            error: `Existen ${solicitudAEliminar.length} solicitudes de actualización con el rut ${rut}.`,
          });
          continue;
        }
        // si solo se encontro una solicitud para eliminar
        const response = await PacientesActualizados.deleteOne({
          rut,
          codigoEstablecimiento,
        }).exec();
        solicitudesEliminadas.push({
          afectado: rut,
          realizado: response.deletedCount ? true : false,
          error: response.deletedCount ? "" : "La solicitud no fue eliminada.",
        });
      } catch (error) {
        solicitudesEliminadas.push({
          afectado: rut,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: solicitudesEliminadas,
    });
  } catch (error) {
    res.status(500).send({
      error: `Pacientes deleteSolicitudesActualizacion: ${error.name} - ${error.message}`,
      respuesta: solicitudesEliminadas,
    });
  }
};

exports.getSolicitudesIdSuscriptor = async (req, res) => {
  try {
    const { codigoEstablecimiento } = req.query;
    const solicitudesIdsSuscriptor =
      await SolicitudesIdsSuscriptorPacientes.find({
        codigoEstablecimiento,
      })
        .select("-_id -__v -codigoEstablecimiento")
        .limit(100)
        .exec();
    res.status(200).send({ respuesta: solicitudesIdsSuscriptor });
  } catch (error) {
    res.status(500).send({
      error: `Pacientes getSolicitudesIdSuscriptor: ${error.name} - ${error.message}`,
    });
  }
};

exports.deleteSolicitudesIdSuscriptor = async (req, res) => {
  const solicitudesEliminadas = [];
  try {
    const solicitudesAEliminar = req.body;
    const { codigoEstablecimiento } = req.query;
    for (let solicitudAEliminar of solicitudesAEliminar) {
      const { rutPaciente, idSuscriptor, accion } = solicitudAEliminar;
      try {
        const solicitudAEliminarExistente =
          await SolicitudesIdsSuscriptorPacientes.find({
            rutPaciente,
            idSuscriptor,
            accion,
            codigoEstablecimiento,
          }).exec();
        // si no existe la solicitud, reportar el error e indicar que se elimino
        if (solicitudAEliminarExistente.length === 0) {
          solicitudesEliminadas.push({
            afectado: `${rutPaciente}|${idSuscriptor}|${accion}`,
            realizado: true,
            error: "La solicitud no existe.",
          });
          continue;
        }
        // si existen multiples solicitudes, indicar el error
        if (solicitudAEliminarExistente.length > 1) {
          solicitudesEliminadas.push({
            afectado: `${rutPaciente}|${idSuscriptor}|${accion}`,
            realizado: false,
            error: `Existen ${solicitudAEliminarExistente.length} solicitudes.`,
          });
          continue;
        }
        // si solo se encontro una solicitud para eliminar
        const response = await SolicitudesIdsSuscriptorPacientes.deleteOne({
          rutPaciente,
          idSuscriptor,
          accion,
          codigoEstablecimiento,
        }).exec();
        solicitudesEliminadas.push({
          afectado: `${rutPaciente}|${idSuscriptor}|${accion}`,
          realizado: response.deletedCount ? true : false,
          error: response.deletedCount ? "" : "La solicitud no fue eliminada.",
        });
      } catch (error) {
        solicitudesEliminadas.push({
          afectado: `${rutPaciente}|${idSuscriptor}|${accion}`,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: solicitudesEliminadas,
    });
  } catch (error) {
    res.status(500).send({
      error: `Pacientes deleteSolicitudesIdSuscriptor: ${error.name} - ${error.message}`,
      respuesta: solicitudesEliminadas,
    });
  }
};
