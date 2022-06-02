const IdsSuscriptorPacientes = require("../models/IdsSuscriptorPacientes");

exports.getIdsSuscriptor = async (req, res) => {
  try {
    const rutPaciente = req.params.rutPaciente;

    const idsSuscriptor = await IdsSuscriptorPacientes.findOne({
      rutPaciente,
    }).exec();

    res.status(200).send(idsSuscriptor.idSuscriptor);
  } catch (error) {
    res.status(500).send({
      error: `Pacientes create: ${error.name} - ${error.message}`,
      respuesta: pacientesInsertados,
    });
  }
};
