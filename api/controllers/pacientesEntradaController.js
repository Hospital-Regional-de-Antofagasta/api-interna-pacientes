const PacientesActualizados = require("../models/PacientesActualizados");

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
          rut,
          codigoEstablecimiento,
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
            error: `Existen ${solicitudAEliminar.length} pacientes con el rut ${rut}.`,
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
    console.log(
      `Pacientes deleteSolicitudesActualizacion: ${error.name} - ${error.message}`
    );
    res.status(500).send({
      error: `Pacientes deleteSolicitudesActualizacion: ${error.name} - ${error.message}`,
      respuesta: solicitudesEliminadas,
    });
  }
};
