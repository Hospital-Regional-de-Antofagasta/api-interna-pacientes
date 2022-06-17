const IdsSuscriptorPacientes = require("../models/IdsSuscriptorPacientes");

exports.getIdsSuscriptor = async (req, res) => {
  try {
    const rutPaciente = req.params.rutPaciente;

    const idsSuscriptor = await IdsSuscriptorPacientes.findOne({
      rutPaciente,
    }).exec();

    if (!idsSuscriptor)
      return res.status(400).send({ error: "Paciente no encontrado" });

    res.status(200).send(idsSuscriptor?.idsSuscriptor.map(e => e.idSuscriptor));
  } catch (error) {
    res.status(500).send({
      error: `Pacientes create: ${error.name} - ${error.message}`,
    });
  }
};
