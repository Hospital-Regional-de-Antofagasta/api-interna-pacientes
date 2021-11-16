const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const Pacientes = require("../api/models/Pacientes");
const pacientesSeed = require("../tests/testSeeds/pacientesSeed.json");
const pacientesAInsertarSeed = require("../tests/testSeeds/pacientesAInsertarSeed.json");
const pacientesAActualizarSeed = require("../tests/testSeeds/pacientesAActualizarSeed.json");
const pacientesAEliminarSeed = require("../tests/testSeeds/pacientesAEliminarSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/pacientes_salida_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Pacientes.create(pacientesSeed);
});

afterEach(async () => {
  await Pacientes.deleteMany();
  await mongoose.disconnect();
});

const pacienteGuardar = {
  numeroPaciente: 100,
  correlativo: 112,
  rut: "1-1",
  apellidoPaterno: "Apellido Paterno Paciente",
  apellidoMaterno: "Apellido Materno Paciente",
  nombre: "Nombre Paciente",
  direccion: "Calle",
  direccionNumero: "1234",
  detallesDireccion: "Departamento 10",
  direccionPoblacion: "Poblacion",
  codigoComuna: "Comuna",
  codigoCiudad: "Ciudad",
  codigoRegion: "Region",
  telefonoFijo: "123412",
  telefonoMovil: "12341234",
  correoCuerpo: "correo",
  correoExtension: "@correo.com",
  nombreSocial: null,
};

const pacienteActualizar = {
  numeroPaciente: 16,
  correlativo: 1,
  rut: "10771131-7",
  apellidoPaterno: "LAZO",
  apellidoMaterno: "ZAMBRA",
  nombre: "JACQUELINE CLOTILDE",
  direccion: "calle",
  direccionNumero: "123",
  detallesDireccion: "casa 21",
  direccionPoblacion: "poblacion",
  codigoComuna: "comuna",
  codigoCiudad: "ciudad",
  codigoRegion: "region",
  telefonoFijo: "123123",
  telefonoMovil: "12341234",
  correoCuerpo: "correo",
  correoExtension: "@correo.com",
  nombreSocial: "social",
};

describe("Endpoints pacientes salida", () => {
  describe("POST /inter-mongo-pacientes/salida", () => {
    // Test de autorización.
    it("Should not save paciente", async () => {
      // Ejecutar endpoint
      const response = await request
        .post("/inter-mongo-pacientes/salida")
        .set("Authorization", "no-token")
        .send(pacienteGuardar);
      // Obtener el paciente que no se guardó.
      const pacienteObtenido = await Pacientes.findOne({
        numeroPaciente: pacienteGuardar.numeroPaciente,
      });
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(401);
      // Debe entregar el mensaje
      expect(response.body.error).toBe("Acceso no autorizado.");
      // No se debe haber encontrado el paciente.
      expect(pacienteObtenido).toBeFalsy();
    });
    // Test crear paciente.
    it("Should save paciente", async () => {
      // Ejecutar endpoint
      const response = await request
        .post("/inter-mongo-pacientes/salida")
        .set("Authorization", token)
        .send([pacienteGuardar]);
      // Obtener el paciente que se guardó.
      const pacienteObtenido = await Pacientes.findOne({
        numeroPaciente: pacienteGuardar.numeroPaciente,
      }).exec();
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(201);
      // Verificar que el paciente obtenido de la bd es igual al que se guardó.
      expect(pacienteObtenido.numeroPaciente.numero).toBe(
        pacienteGuardar.numeroPaciente.numero
      );
      expect(pacienteObtenido.rut).toBe(pacienteGuardar.rut);
      expect(pacienteObtenido.apellidoPaterno).toBe(
        pacienteGuardar.apellidoPaterno
      );
      expect(pacienteObtenido.apellidoMaterno).toBe(
        pacienteGuardar.apellidoMaterno
      );
      expect(pacienteObtenido.nombre).toBe(pacienteGuardar.nombre);
      expect(pacienteObtenido.direccion).toBe(pacienteGuardar.direccion);
      expect(pacienteObtenido.direccionNumero).toBe(
        pacienteGuardar.direccionNumero
      );
      expect(pacienteObtenido.detallesDireccion).toBe(
        pacienteGuardar.detallesDireccion
      );
      expect(pacienteObtenido.direccionPoblacion).toBe(
        pacienteGuardar.direccionPoblacion
      );
      expect(pacienteObtenido.codigoComuna).toBe(pacienteGuardar.codigoComuna);
      expect(pacienteObtenido.codigoCiudad).toBe(pacienteGuardar.codigoCiudad);
      expect(pacienteObtenido.codigoRegion).toBe(pacienteGuardar.codigoRegion);
      expect(pacienteObtenido.telefonoFijo).toBe(pacienteGuardar.telefonoFijo);
      expect(pacienteObtenido.telefonoMovil).toBe(
        pacienteGuardar.telefonoMovil
      );
      expect(pacienteObtenido.correoCuerpo).toBe(pacienteGuardar.correoCuerpo);
      expect(pacienteObtenido.correoExtension).toBe(
        pacienteGuardar.correoExtension
      );
      expect(pacienteObtenido.nombreSocial).toBe(pacienteGuardar.nombreSocial);
    });
    it("Should save multiple pacientes and return errors", async () => {
      const response = await request
        .post("/inter-mongo-pacientes/salida")
        .set("Authorization", token)
        .send(pacientesAInsertarSeed);

      const pacientesBD = await Pacientes.find().exec();

      expect(response.status).toBe(201);

      expect(pacientesBD.length).toBe(6);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(6);
      expect(respuesta).toEqual([
        {
          afectado: 2,
          realizado: true,
          error: "El paciente ya existe.",
        },
        {
          afectado: 11,
          realizado: true,
          error: "",
        },
        {
          afectado: 12,
          realizado: false,
          error: "MongoServerError - E11000 duplicate key error collection: pacientes_salida_test.pacientes index: _id_ dup key: { _id: ObjectId('303030303030303030303231') }",
        },
        {
          afectado: 13,
          realizado: true,
          error: "",
        },
        {
          afectado: 14,
          realizado: false,
          error:
            "MongoServerError - E11000 duplicate key error collection: pacientes_salida_test.pacientes index: _id_ dup key: { _id: ObjectId('313030303030303030303136') }",
        },
        {
          afectado: 15,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
  describe("PUT /inter-mongo-pacientes/salida", () => {
    it("Should not update paciente", async () => {
      const response = await request
        .put("/inter-mongo-pacientes/salida")
        .set("Authorization", "no-token")
        .send(pacienteActualizar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should update paciente", async () => {
      const response = await request
        .put("/inter-mongo-pacientes/salida")
        .set("Authorization", token)
        .send([pacienteActualizar]);

      const pacienteObtenido = await Pacientes.findOne({
        correlativo: pacienteActualizar.correlativo,
      }).exec();
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(200);
      // Verificar que el paciente obtenido es el mismo al que se actualizó.
      expect(pacienteObtenido.numeroPaciente).toBe(
        pacienteActualizar.numeroPaciente
      );
      expect(pacienteObtenido.rut).toBe(pacienteActualizar.rut);
      expect(pacienteObtenido.apellidoPaterno).toBe(
        pacienteActualizar.apellidoPaterno
      );
      expect(pacienteObtenido.apellidoMaterno).toBe(
        pacienteActualizar.apellidoMaterno
      );
      expect(pacienteObtenido.nombre).toBe(pacienteActualizar.nombre);
      expect(pacienteObtenido.direccion).toBe(pacienteActualizar.direccion);
      expect(pacienteObtenido.direccionNumero).toBe(
        pacienteActualizar.direccionNumero
      );
      expect(pacienteObtenido.detallesDireccion).toBe(
        pacienteActualizar.detallesDireccion
      );
      expect(pacienteObtenido.direccionPoblacion).toBe(
        pacienteActualizar.direccionPoblacion
      );
      expect(pacienteObtenido.codigoComuna).toBe(
        pacienteActualizar.codigoComuna
      );
      expect(pacienteObtenido.codigoCiudad).toBe(
        pacienteActualizar.codigoCiudad
      );
      expect(pacienteObtenido.codigoRegion).toBe(
        pacienteActualizar.codigoRegion
      );
      expect(pacienteObtenido.telefonoFijo).toBe(
        pacienteActualizar.telefonoFijo
      );
      expect(pacienteObtenido.telefonoMovil).toBe(
        pacienteActualizar.telefonoMovil
      );
      expect(pacienteObtenido.correoCuerpo).toBe(
        pacienteActualizar.correoCuerpo
      );
      expect(pacienteObtenido.correoExtension).toBe(
        pacienteActualizar.correoExtension
      );
      expect(pacienteObtenido.nombreSocial).toBe(
        pacienteActualizar.nombreSocial
      );
    });
    it("Should update multiple pacientes and return errors", async () => {
      const response = await request
        .put("/inter-mongo-pacientes/salida")
        .set("Authorization", token)
        .send(pacientesAActualizarSeed);

      expect(response.status).toBe(200);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      expect(respuesta).toEqual([
        {
          afectado: 4,
          realizado: false,
          error: "El paciente no existe.",
        },
        {
          afectado: 1,
          realizado: true,
          error: "",
        },
        {
          afectado: 2,
          realizado: false,
          error:
            "MongoServerError - Performing an update on the path '_id' would modify the immutable field '_id'",
        },
        {
          afectado: 2,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
  describe("DELETE /inter-mongo-pacientes/salida", () => {
    it("Should not delete paciente", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/salida")
        .set("Authorization", "no-token")
        .send([2]);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should delete paciente", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/salida")
        .set("Authorization", token)
        .send([2]);

      const pacienteObtenido = await Pacientes.findOne({
        correlativo: 2,
      }).exec();
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(200);
      expect(pacienteObtenido).toBeFalsy();
    });
    it("Should delete multiple pacientes and return errors", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/salida")
        .set("Authorization", token)
        .send(pacientesAEliminarSeed);

      expect(response.status).toBe(200);

      const pacientesBD = await Pacientes.find().exec();

      expect(pacientesBD.length).toBe(1);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      expect(respuesta).toEqual([
        {
          afectado: 4,
          realizado: true,
          error: "El paciente no existe.",
        },
        {
          afectado: 1,
          realizado: true,
          error: "",
        },
        {
          afectado: 5,
          realizado: true,
          error: "El paciente no existe.",
        },
        {
          afectado: 2,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
});