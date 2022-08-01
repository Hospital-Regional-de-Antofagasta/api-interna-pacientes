const IdsSuscriptorPacientes = require("../models/IdsSuscriptorPacientes");
const SolicitudesIdsSuscriptorPacientes = require("../models/SolicitudesIdsSuscriptorPacientes");
const { getDevice } = require("../services/oneSignalService");

exports.getIdsSuscriptor = async (req, res) => {
  try {
    const idsSuscriptorPaciente = await IdsSuscriptorPacientes.findOne({
      rutPaciente: req.params.rutPaciente,
    }).exec();

    if (!idsSuscriptorPaciente)
      return res.status(400).send({ error: "Paciente no encontrado" });

    const idsSuscriptorEliminar = [];
    for (let idSuscriptor of idsSuscriptorPaciente.idsSuscriptor) {
      const oneSignalResponse = await getDevice(idSuscriptor.idSuscriptor);

      if (!oneSignalResponse.id)
        return res.status(500).send({ error: oneSignalResponse });

      if (oneSignalResponse.invalid_identifier)
        idsSuscriptorEliminar.push(idSuscriptor);
    }

    for (let idSuscriptor of idsSuscriptorEliminar) {
      await removerIdSuscriptor(
        req.params.rutPaciente,
        idSuscriptor.idSuscriptor
      );

      idsSuscriptorPaciente.idsSuscriptor.splice(
        idsSuscriptorPaciente.idsSuscriptor.indexOf(idSuscriptor),
        1
      );
    }

    res
      .status(200)
      .send(idsSuscriptorPaciente?.idsSuscriptor.map((e) => e.idSuscriptor));
  } catch (error) {
    res.status(500).send({
      error: `Pacientes create: ${error.name} - ${error.message}`,
    });
  }
};

const removerIdSuscriptor = async (rutPaciente, idSuscriptor) => {
  await IdsSuscriptorPacientes.updateOne(
    { rutPaciente: rutPaciente, "idsSuscriptor.idSuscriptor": idSuscriptor },
    { $pull: { idsSuscriptor: { idSuscriptor } } }
  ).exec();

  await SolicitudesIdsSuscriptorPacientes.create({
    rutPaciente,
    idSuscriptor,
    accion: "ELIMINAR",
    nombreDispositivo: null,
  });
};
