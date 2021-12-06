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

const pacienteGuardar = {
  rut: "99999999-9",
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

const pacienteExistenteGuardar = {
  rut: "22222222-2",
  apellidoPaterno: "RIVERA",
  apellidoMaterno: "ARANCIBIA",
  nombre: "CAROLINA DEL PILAR",
  direccion: " ",
  direccionNumero: " ",
  detallesDireccion: " ",
  direccionPoblacion: "VILLA CASPAÑA",
  codigoComuna: "0",
  codigoCiudad: "0",
  codigoRegion: "01",
  telefonoFijo: "",
  telefonoMovil: " 94924483",
  correoCuerpo: null,
  correoExtension: null,
  nombreSocial: null,
};

const pacienteActualizar = {
  rut: "10771131-7",
  apellidoPaterno: "LAZOo",
  apellidoMaterno: "ZAMBRAa",
  nombre: "JACQUELINE CLOTILDEe",
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

describe("Endpoints pacientes salida", () => {
  describe("POST /inter-mongo-pacientes/salida", () => {
    it("Should not save paciente without token", async () => {
      const response = await request
        .post("/inter-mongo-pacientes/salida")
        .send(pacienteGuardar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const pacienteDespues = await Pacientes.findOne({
        rut: pacienteGuardar.rut,
      });

      expect(pacienteDespues).toBeFalsy();
    });
    it("Should not save paciente with invalid token", async () => {
      const response = await request
        .post("/inter-mongo-pacientes/salida")
        .set("Authorization", "no-token")
        .send(pacienteGuardar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const pacienteDespues = await Pacientes.findOne({
        rut: pacienteGuardar.rut,
      });

      expect(pacienteDespues).toBeFalsy();
    });
    it("Should not save paciente without codigo establecimiento", async () => {
      const response = await request
        .post("/inter-mongo-pacientes/salida")
        .set("Authorization", token)
        .send(pacienteGuardar);

      expect(response.status).toBe(400);

      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );

      const pacienteDespues = await Pacientes.findOne({
        rut: pacienteGuardar.rut,
      });

      expect(pacienteDespues).toBeFalsy();
    });
    it("Should save paciente", async () => {
      const response = await request
        .post("/inter-mongo-pacientes/salida?codigoEstablecimiento=HRA")
        .set("Authorization", token)
        .send([pacienteGuardar]);

      expect(response.status).toBe(201);

      const pacienteDespues = await Pacientes.findOne({
        rut: pacienteGuardar.rut,
      }).exec();

      expect(pacienteDespues).toBeTruthy();
      expect(pacienteDespues.rut).toBe(pacienteGuardar.rut);
      expect(pacienteDespues.apellidoPaterno).toBe(
        pacienteGuardar.apellidoPaterno
      );
      expect(pacienteDespues.apellidoMaterno).toBe(
        pacienteGuardar.apellidoMaterno
      );
      expect(pacienteDespues.nombre).toBe(pacienteGuardar.nombre);
      expect(pacienteDespues.direccion).toBe(pacienteGuardar.direccion);
      expect(pacienteDespues.direccionNumero).toBe(
        pacienteGuardar.direccionNumero
      );
      expect(pacienteDespues.detallesDireccion).toBe(
        pacienteGuardar.detallesDireccion
      );
      expect(pacienteDespues.direccionPoblacion).toBe(
        pacienteGuardar.direccionPoblacion
      );
      expect(pacienteDespues.codigoComuna).toBe(pacienteGuardar.codigoComuna);
      expect(pacienteDespues.codigoCiudad).toBe(pacienteGuardar.codigoCiudad);
      expect(pacienteDespues.codigoRegion).toBe(pacienteGuardar.codigoRegion);
      expect(pacienteDespues.telefonoFijo).toBe(pacienteGuardar.telefonoFijo);
      expect(pacienteDespues.telefonoMovil).toBe(pacienteGuardar.telefonoMovil);
      expect(pacienteDespues.correoCuerpo).toBe(pacienteGuardar.correoCuerpo);
      expect(pacienteDespues.correoExtension).toBe(
        pacienteGuardar.correoExtension
      );
      expect(pacienteDespues.nombreSocial).toBe(pacienteGuardar.nombreSocial);
      expect(pacienteDespues.codigosEstablecimientos[0]).toBe("HRA");
    });
    it("Should save paciente that exists in another hospital", async () => {
      const pacienteAntes = await Pacientes.findOne({
        rut: pacienteExistenteGuardar.rut,
      }).exec();

      const response = await request
        .post("/inter-mongo-pacientes/salida?codigoEstablecimiento=HRA")
        .set("Authorization", token)
        .send([pacienteExistenteGuardar]);

      expect(response.status).toBe(201);

      const pacienteDespues = await Pacientes.findOne({
        rut: pacienteExistenteGuardar.rut,
      }).exec();

      expect(pacienteDespues.rut).toBe(pacienteAntes.rut);
      expect(pacienteDespues.apellidoPaterno).toBe(
        pacienteAntes.apellidoPaterno
      );
      expect(pacienteDespues.apellidoMaterno).toBe(
        pacienteAntes.apellidoMaterno
      );
      expect(pacienteDespues.nombre).toBe(pacienteAntes.nombre);
      expect(pacienteDespues.direccion).toBe(pacienteAntes.direccion);
      expect(pacienteDespues.direccionNumero).toBe(
        pacienteAntes.direccionNumero
      );
      expect(pacienteDespues.detallesDireccion).toBe(
        pacienteAntes.detallesDireccion
      );
      expect(pacienteDespues.direccionPoblacion).toBe(
        pacienteAntes.direccionPoblacion
      );
      expect(pacienteDespues.codigoComuna).toBe(pacienteAntes.codigoComuna);
      expect(pacienteDespues.codigoCiudad).toBe(pacienteAntes.codigoCiudad);
      expect(pacienteDespues.codigoRegion).toBe(pacienteAntes.codigoRegion);
      expect(pacienteDespues.telefonoFijo).toBe(pacienteAntes.telefonoFijo);
      expect(pacienteDespues.telefonoMovil).toBe(pacienteAntes.telefonoMovil);
      expect(pacienteDespues.correoCuerpo).toBe(pacienteAntes.correoCuerpo);
      expect(pacienteDespues.correoExtension).toBe(
        pacienteAntes.correoExtension
      );
      expect(pacienteDespues.nombreSocial).toBe(pacienteAntes.nombreSocial);
      expect(pacienteDespues.codigosEstablecimientos[0]).toBe("HC");
      expect(pacienteDespues.codigosEstablecimientos[1]).toBe("HRA");
    });
    it("Should save multiple pacientes and return errors", async () => {
      const response = await request
        .post("/inter-mongo-pacientes/salida?codigoEstablecimiento=HRA")
        .set("Authorization", token)
        .send(pacientesAInsertarSeed);

      expect(response.status).toBe(201);

      const pacientesBD = await Pacientes.find().exec();

      expect(pacientesBD.length).toBe(8);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(7);
      expect(respuesta).toEqual([
        {
          afectado: "17724699-9",
          realizado: true,
          error: "El paciente ya existe.",
        },
        {
          afectado: "33333333-3",
          realizado: true,
          error: "",
        },
        {
          afectado: "17724699-9",
          realizado: true,
          error:
            "El paciente ya existe.",
        },
        {
          afectado: "44444444-4",
          realizado: true,
          error: "",
        },
        {
          afectado: "66666666-6",
          realizado: false,
          error:
            "MongoServerError - E11000 duplicate key error collection: pacientes_salida_test.pacientes index: _id_ dup key: { _id: ObjectId('303030303030303030303136') }",
        },
        {
          afectado: "55555555-5",
          realizado: true,
          error: "",
        },
        {
          afectado: "22222222-2",
          realizado: true,
          error: "",
        },
      ]);
    });
  });
  describe("PUT /inter-mongo-pacientes/salida", () => {
    it("Should not update paciente without token", async () => {
      const pacienteAntes = await Pacientes.findOne({
        rut: pacienteActualizar.rut,
      }).exec();

      const response = await request
        .put("/inter-mongo-pacientes/salida")
        .send(pacienteActualizar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const pacienteDespues = await Pacientes.findOne({
        rut: pacienteActualizar.rut,
      }).exec();

      expect(pacienteAntes).toEqual(pacienteDespues);
    });
    it("Should not update paciente with invalid token", async () => {
      const pacienteAntes = await Pacientes.findOne({
        rut: pacienteActualizar.rut,
      }).exec();

      const response = await request
        .put("/inter-mongo-pacientes/salida")
        .set("Authorization", "no-token")
        .send(pacienteActualizar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const pacienteDespues = await Pacientes.findOne({
        rut: pacienteActualizar.rut,
      }).exec();

      expect(pacienteAntes).toEqual(pacienteDespues);
    });
    it("Should not update paciente without codigo establecimiento", async () => {
      const pacienteAntes = await Pacientes.findOne({
        rut: pacienteActualizar.rut,
      }).exec();

      const response = await request
        .put("/inter-mongo-pacientes/salida")
        .set("Authorization", token)
        .send(pacienteActualizar);

      expect(response.status).toBe(400);

      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );

      const pacienteDespues = await Pacientes.findOne({
        rut: pacienteActualizar.rut,
      }).exec();

      expect(pacienteAntes).toEqual(pacienteDespues);
    });
    it("Should update paciente", async () => {
      const response = await request
        .put("/inter-mongo-pacientes/salida?codigoEstablecimiento=HRA")
        .set("Authorization", token)
        .send([pacienteActualizar]);

      expect(response.status).toBe(200);

      const pacienteDespues = await Pacientes.findOne({
        rut: pacienteActualizar.rut,
      }).exec();

      expect(pacienteDespues.rut).toBe(pacienteActualizar.rut);
      expect(pacienteDespues.apellidoPaterno).toBe(
        pacienteActualizar.apellidoPaterno
      );
      expect(pacienteDespues.apellidoMaterno).toBe(
        pacienteActualizar.apellidoMaterno
      );
      expect(pacienteDespues.nombre).toBe(pacienteActualizar.nombre);
      expect(pacienteDespues.direccion).toBe(pacienteActualizar.direccion);
      expect(pacienteDespues.direccionNumero).toBe(
        pacienteActualizar.direccionNumero
      );
      expect(pacienteDespues.detallesDireccion).toBe(
        pacienteActualizar.detallesDireccion
      );
      expect(pacienteDespues.direccionPoblacion).toBe(
        pacienteActualizar.direccionPoblacion
      );
      expect(pacienteDespues.codigoComuna).toBe(
        pacienteActualizar.codigoComuna
      );
      expect(pacienteDespues.codigoCiudad).toBe(
        pacienteActualizar.codigoCiudad
      );
      expect(pacienteDespues.codigoRegion).toBe(
        pacienteActualizar.codigoRegion
      );
      expect(pacienteDespues.telefonoFijo).toBe(
        pacienteActualizar.telefonoFijo
      );
      expect(pacienteDespues.telefonoMovil).toBe(
        pacienteActualizar.telefonoMovil
      );
      expect(pacienteDespues.correoCuerpo).toBe(
        pacienteActualizar.correoCuerpo
      );
      expect(pacienteDespues.correoExtension).toBe(
        pacienteActualizar.correoExtension
      );
      expect(pacienteDespues.nombreSocial).toBe(
        pacienteActualizar.nombreSocial
      );
      expect(pacienteDespues.codigosEstablecimientos[0]).toBe("HRA");
    });
    // it("Should update paciente that exists in another hospital", async () => {});
    it("Should update multiple pacientes and return errors", async () => {
      const response = await request
        .put("/inter-mongo-pacientes/salida?codigoEstablecimiento=HRA")
        .set("Authorization", token)
        .send(pacientesAActualizarSeed);

      expect(response.status).toBe(200);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      console.log(respuesta)
      expect(respuesta).toEqual([
        {
          afectado: "33333333-3",
          realizado: false,
          error: "El paciente no existe.",
        },
        {
          afectado: "10771131-7",
          realizado: true,
          error: "",
        },
        {
          afectado: "17724699-9",
          realizado: false,
          error:
            "MongoServerError - Performing an update on the path '_id' would modify the immutable field '_id'",
        },
        {
          afectado: "17724699-9",
          realizado: true,
          error: "",
        },
      ]);
    });
  });
  describe("DELETE /inter-mongo-pacientes/salida", () => {
    it("Should not delete paciente without token", async () => {
      const pacienteAntes = await Pacientes.findOne({
        rut: "17724699-9",
      }).exec();

      const response = await request
        .delete("/inter-mongo-pacientes/salida")
        .send(["17724699-9"]);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const pacienteDespues = await Pacientes.findOne({
        rut: "17724699-9",
      }).exec();

      expect(pacienteAntes).toEqual(pacienteDespues);
    });
    it("Should not delete paciente with invalid token", async () => {
      const pacienteAntes = await Pacientes.findOne({
        rut: "17724699-9",
      }).exec();

      const response = await request
        .delete("/inter-mongo-pacientes/salida")
        .set("Authorization", "no-token")
        .send(["17724699-9"]);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const pacienteDespues = await Pacientes.findOne({
        rut: "17724699-9",
      }).exec();

      expect(pacienteAntes).toEqual(pacienteDespues);
    });
    it("Should not delete paciente without codigo establecimiento", async () => {
      const pacienteAntes = await Pacientes.findOne({
        rut: "17724699-9",
      }).exec();

      const response = await request
        .delete("/inter-mongo-pacientes/salida")
        .set("Authorization", token)
        .send(["17724699-9"]);

      expect(response.status).toBe(400);

      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );

      const pacienteDespues = await Pacientes.findOne({
        rut: "17724699-9",
      }).exec();

      expect(pacienteAntes).toEqual(pacienteDespues);
    });
    it("Should delete paciente", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/salida?codigoEstablecimiento=HRA")
        .set("Authorization", token)
        .send(["17724699-9"]);

      const pacienteDespues = await Pacientes.findOne({
        rut: "17724699-9",
      }).exec();

      expect(response.status).toBe(200);
      expect(pacienteDespues).toBeFalsy();
    });
    it("Should delete paciente that exists in another hospital", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/salida?codigoEstablecimiento=HRA")
        .set("Authorization", token)
        .send(["11111111-1"]);

      const pacienteDespues = await Pacientes.findOne({
        rut: "11111111-1",
      }).exec();

      expect(response.status).toBe(200);

      expect(pacienteDespues).toBeTruthy();
      expect(pacienteDespues.codigosEstablecimientos).toEqual(["HC"]);
    });
    it("Should delete multiple pacientes and return errors", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/salida?codigoEstablecimiento=HRA")
        .set("Authorization", token)
        .send(pacientesAEliminarSeed);

      expect(response.status).toBe(200);

      const pacientesBD = await Pacientes.find().exec();

      expect(pacientesBD.length).toBe(3);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      expect(respuesta).toEqual([
        {
          afectado: "44444444-4",
          realizado: true,
          error: "El paciente no existe.",
        },
        {
          afectado: "10771131-7",
          realizado: true,
          error: "",
        },
        {
          afectado: "55555555-5",
          realizado: true,
          error: "El paciente no existe.",
        },
        {
          afectado: "17724699-9",
          realizado: true,
          error: "",
        },
      ]);
    });
  });
});
