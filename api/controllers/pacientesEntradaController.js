const PacientesActualizados = require("../models/PacientesActualizados");

exports.getSolicitudesActualizacion = async (req, res) => {
  try {
    const pacientesActualizados = await PacientesActualizados.find()
      .limit(100)
      .exec();
    res.status(200).send({ respuesta: pacientesActualizados });
  } catch (error) {
    res.status(500).send({
      error: `Pacientes getPacientesActualizados: ${error.name} - ${error.message}`,
      respuesta: [],
    });
  }
};

exports.deleteSolicitudesActualizacion = async (req, res) => {
  const solicitudesEliminadas = [];
  try {
    const correlativosPacientes = req.body;
    for (let correlativo of correlativosPacientes) {
      try {
        const filter = { correlativo };
        const solicitudAEliminar = await PacientesActualizados.find(
          filter
        ).exec();
        if (solicitudAEliminar.length === 0) {
          solicitudesEliminadas.push({
            afectado: correlativo,
            realizado: true,
            error: "La solicitud no existe.",
          });
          continue;
        }
        if (solicitudAEliminar.length > 1) {
          solicitudesEliminadas.push({
            afectado: correlativo,
            realizado: false,
            error: `${solicitudAEliminar.length} solicitudes encontradas.`,
          });
          continue;
        }
        // solo encontro una para eliminar
        const response = await PacientesActualizados.deleteOne(filter).exec();
        solicitudesEliminadas.push({
          afectado: correlativo,
          realizado: response.deletedCount ? true : false,
          error: response.deletedCount ? "" : "La solicitud no fue eliminada.",
        });
      } catch (error) {
        solicitudesEliminadas.push({
          afectado: correlativo,
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
