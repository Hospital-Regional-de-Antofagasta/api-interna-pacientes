const Paciente = require("../models/Pacientes");
const Pacientes = require("../models/Pacientes");
const PacientesActualizados = require("../models/PacientesActualizados");

// Obtener el ultimo paciente registrado en la bd MongoDB del establecimiento dado.
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

// Registrar pacientes en la bd MongoDB.
exports.create = async (req, res) => {
  try {
    const pacientes = req.body;
    const hospital = {};
    let propiedad = "";
    if (Array.isArray(pacientes)) {
      pacientes.forEach((paciente) => {
        propiedad = `${paciente.numerosPaciente[0].codigoEstablecimiento}`;
        hospital[propiedad] = 1;
        paciente.numerosPaciente[0].hospital = hospital;
        paciente.numerosPaciente[0].idNumero =
          paciente.numerosPaciente[0].codigoEstablecimiento +
          "" +
          paciente.numerosPaciente[0].numero;
      });
    } else {
      //Sólo un objeto.
      propiedad = `${pacientes.numerosPaciente[0].codigoEstablecimiento}`;
      hospital[propiedad] = 1;
      pacientes.numerosPaciente.hospital = hospital;
      pacientes.numerosPaciente[0].idNumero =
        pacientes.numerosPaciente[0].codigoEstablecimiento +
        "" +
        pacientes.numerosPaciente[0].numero;
    }
    await Pacientes.create(pacientes);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      respuesta: `Pacientes create: ${error.name} - ${error.message}`,
    });
  }
};

// Actualizar paciente en la bd MongoDB.
exports.update = async (req, res) => {
  try {
    const filter = {
      "numerosPaciente.idNumero":
        req.body.numerosPaciente[0].codigoEstablecimiento +
        "" +
        req.body.numerosPaciente[0].numero,
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

// Eliminar paciente de la bd MongoDB.
exports.delete = async (req, res) => {
  try {
    const filter = {
      "numerosPaciente.idNumero":
        req.params.codigoEstablecimiento + "" + req.params.numeroPaciente,
    };
    await Pacientes.deleteOne(filter).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes delete: ${error.name} - ${error.message}`,
    });
  }
};

// Obtiene las solicitudes de actualización de datos de contacto del establecimiento dado.
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

//Actualiza un paciente en la db MongoDB y elimina la solicitud de actualización del paciente  y establecimiento dados. 
exports.updateAndDeleteSolicitud = async (req, res) => {
  try {
    const filtro = {
      "numeroPaciente.idNumero":
        req.params.codigoEstablecimiento + "" + req.params.numeroPaciente,
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
