const Paciente = require("../models/Pacientes");
const Pacientes = require("../models/Pacientes");
const PacientesActualizados = require("../models/PacientesActualizados");

// obtener el ultimo paciente ingresado a la bd
exports.getLast = async (req, res) => {
  try {
    const codigo = req.params.codigoEstablecimiento;
    const filter = {
      "numerosPaciente.codigoEstablecimiento": codigo,
    };
    const propiedad = `numerosPaciente.hospital.${codigo}`;
    let sort = {};
    sort[propiedad] = -1;
    const paciente = await Pacientes.findOne(filter)
      .sort(sort)
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
    const pacientes = req.body;
    const hospital = {};
    let propiedad = "";
    if (Array.isArray(pacientes)) {
      pacientes.forEach((paciente) => {
        propiedad = `${paciente.numerosPaciente.codigoEstablecimiento}`;
        hospital[propiedad] = 1;
        paciente.numerosPaciente.hospital = hospital;
      });
    } else {
      //Sólo un objeto
      propiedad = `${pacientes.numerosPaciente.codigoEstablecimiento}`;
      hospital[propiedad] = 1;
      pacientes.numerosPaciente.hospital = hospital;
    }
    await Pacientes.create(pacientes);
    res.sendStatus(201);
  } catch (error) { console.log(error)
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
