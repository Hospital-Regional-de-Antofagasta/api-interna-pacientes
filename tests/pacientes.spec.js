const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const Pacientes = require("../api/models/Pacientes");
const PacientesActualizados = require("../api/models/PacientesActualizados");
const pacientesSeed = require("../tests/testSeeds/pacientesSeed.json");
const pacientesAInsertarSeed = require("../tests/testSeeds/pacientesAInsertarSeed.json");
const pacientesAActualizarSeed = require("../tests/testSeeds/pacientesAActualizarSeed.json");
const pacientesAEliminarSeed = require("../tests/testSeeds/pacientesAEliminarSeed.json");
const pacientesActualizadosSeed = require("../tests/testSeeds/pacientesActualizadosSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  // conectarse a la bd de testing
  await mongoose.connect(`${process.env.MONGO_URI}/pacientes_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // cargar los seeds a la bd
  await Pacientes.create(pacientesSeed);
  await PacientesActualizados.create(pacientesActualizadosSeed);
});

afterEach(async () => {
  // borrar el contenido de la colleccion en la bd
  await Pacientes.deleteMany();
  await PacientesActualizados.deleteMany();
  // cerrar la coneccion a la bd
  await mongoose.disconnect();
});

// Pacientes para realizar las pruebas.
const pacienteUltimo = {
  numeroPaciente: 21,
  correlativo: 2,
  rut: "17724699-9",
  apellidoPaterno: "RIVERA",
  apellidoMaterno: "ARANCIBIA",
  nombre: "JOHANA GABRIEL",
  direccion: "",
  direccionNumero: "",
  detallesDireccion: "",
  direccionPoblacion: "",
  codigoComuna: "01",
  codigoCiudad: "03",
  codigoRegion: "01",
  telefonoFijo: "",
  telefonoMovil: "",
  correoCuerpo: "",
  correoExtension: "",
  nombreSocial: "nombre",
};

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

describe("Endpoints pacientes", () => {
  describe("GET /hradb-a-mongodb/pacientes/ultimo/", () => {
    // Test de Autorización.
    it("Should not get last paciente", async () => {
      // Ejecutar endpoint.
      const response = await request
        .get("/hradb-a-mongodb/pacientes/ultimo/")
        .set("Authorization", "no-token");
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    // Test base de datos vacía.
    it("Should get last paciente from empty database", async () => {
      // Borrar el contenido de la colección en la bd MongoDB.
      await Pacientes.deleteMany();
      // Ejecutar endpoint.
      const response = await request
        .get("/hradb-a-mongodb/pacientes/ultimo/")
        .set("Authorization", token);
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });
    // Test obtener último paciente.
    it("Should get last paciente", async () => {
      // Ejecutar endpoint.
      const response = await request
        .get("/hradb-a-mongodb/pacientes/ultimo/")
        .set("Authorization", token);
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(200);
      // Verificar que retornó el último paciente de ese establecimiento.
      expect(response.body.numeroPaciente).toStrictEqual(
        pacienteUltimo.numeroPaciente
      );
      expect(response.body.rut).toBe(pacienteUltimo.rut);
      expect(response.body.apellidoPaterno).toBe(
        pacienteUltimo.apellidoPaterno
      );
      expect(response.body.apellidoMaterno).toBe(
        pacienteUltimo.apellidoMaterno
      );
      expect(response.body.nombre).toBe(pacienteUltimo.nombre);
      expect(response.body.direccionCalle).toBe(pacienteUltimo.direccionCalle);
      expect(response.body.direccionNumero).toBe(
        pacienteUltimo.direccionNumero
      );
      expect(response.body.direccionDepartamento).toBe(
        pacienteUltimo.direccionDepartamento
      );
      expect(response.body.direccionPoblacion).toBe(
        pacienteUltimo.direccionPoblacion
      );
      expect(response.body.codigoComuna).toBe(pacienteUltimo.codigoComuna);
      expect(response.body.codigoCiudad).toBe(pacienteUltimo.codigoCiudad);
      expect(response.body.codigoRegion).toBe(pacienteUltimo.codigoRegion);
      expect(response.body.fono).toBe(pacienteUltimo.fono);
      expect(response.body.telefonoMovil).toBe(pacienteUltimo.telefonoMovil);
      expect(response.body.correoCuerpo).toBe(pacienteUltimo.correoCuerpo);
      expect(response.body.correoExtension).toBe(
        pacienteUltimo.correoExtension
      );
      expect(response.body.nombreSocial).toBe(pacienteUltimo.nombreSocial);
    });
  });
  describe("POST /hradb-a-mongodb/pacientes", () => {
    // Test de autorización.
    it("Should not save paciente", async () => {
      // Ejecutar endpoint
      const response = await request
        .post("/hradb-a-mongodb/pacientes")
        .set("Authorization", "no-token")
        .send(pacienteGuardar);
      // Obtener el paciente que no se guardó.
      const pacienteObtenido = await Pacientes.findOne({
        numeroPaciente: pacienteGuardar.numeroPaciente,
      });
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(401);
      // Debe entregar el mensaje
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
      // No se debe haber encontrado el paciente.
      expect(pacienteObtenido).toBeFalsy();
    });
    // Test crear paciente.
    it("Should save paciente", async () => {
      // Ejecutar endpoint
      const response = await request
        .post("/hradb-a-mongodb/pacientes")
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
        .post("/hradb-a-mongodb/pacientes")
        .set("Authorization", token)
        .send(pacientesAInsertarSeed);

      const pacientesBD = await Pacientes.find().exec();

      expect(response.status).toBe(201);

      expect(pacientesBD.length).toBe(6);

      const { resultados } = response.body;

      expect(resultados.length).toBe(6);
      expect(resultados).toEqual([
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
          error: "MongoServerError - E11000 duplicate key error collection: pacientes_test.pacientes index: _id_ dup key: { _id: ObjectId('303030303030303030303231') }",
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
            "MongoServerError - E11000 duplicate key error collection: pacientes_test.pacientes index: _id_ dup key: { _id: ObjectId('313030303030303030303136') }",
        },
        {
          afectado: 15,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
  describe("PUT /hradb-a-mongodb/pacientes/:numeroPaciente", () => {
    // Test de autorización.
    it("Should not update paciente", async () => {
      // Ejecutar endpoint.
      const response = await request
        .put(`/hradb-a-mongodb/pacientes/${pacienteActualizar.numeroPaciente}`)
        .set("Authorization", "no-token")
        .send(pacienteActualizar);
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(401);
      // Debe entregar el mensaje.
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    // Test actualizar paciente.
    it("Should update paciente", async () => {
      // Ejecutar endpoint
      const response = await request
        .put(`/hradb-a-mongodb/pacientes/${pacienteActualizar.numeroPaciente}`)
        .set("Authorization", token)
        .send(pacienteActualizar);
      // Obtener el paciente que se actualizó.

      const pacienteObtenido = await Pacientes.findOne({
        numeroPaciente: pacienteActualizar.numeroPaciente,
      }).exec();
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(204);
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
  });
  describe("PUT /hradb-a-mongodb/pacientes", () => {
    it("Should not update paciente", async () => {
      const response = await request
        .put("/hradb-a-mongodb/pacientes")
        .set("Authorization", "no-token")
        .send(pacienteActualizar);

      expect(response.status).toBe(401);

      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    it("Should update paciente", async () => {
      const response = await request
        .put("/hradb-a-mongodb/pacientes")
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
        .put("/hradb-a-mongodb/pacientes")
        .set("Authorization", token)
        .send(pacientesAActualizarSeed);

      expect(response.status).toBe(200);

      const { resultados } = response.body;

      expect(resultados.length).toBe(4);
      expect(resultados).toEqual([
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
  describe("DELETE /hradb-a-mongodb/pacientes/:numeroPaciente", () => {
    // Test de Autorización.
    it("Should not delete paciente", async () => {
      // Ejecutar endpoint
      const response = await request
        .delete(`/hradb-a-mongodb/pacientes/${pacienteUltimo.numeroPaciente}`)
        .set("Authorization", "no-token")
        .send(pacienteUltimo);
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(401);
      // Debe entregar el mensaje.
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    // Test eliminar paciente.
    it("Should delete paciente", async () => {
      // Ejecutar endpoint.
      const response = await request
        .delete(`/hradb-a-mongodb/pacientes/${pacienteUltimo.numeroPaciente}`)
        .set("Authorization", token);
      // Obtener el paciente que se eliminó.
      const pacienteObtenido = await Pacientes.findOne({
        numeroPaciente: pacienteUltimo.numeroPaciente,
      }).exec();
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(204);
      expect(pacienteObtenido).toBeFalsy();
    });
  });
  describe("DELETE /hradb-a-mongodb/pacientes", () => {
    it("Should not delete paciente", async () => {
      const response = await request
        .delete("/hradb-a-mongodb/pacientes")
        .set("Authorization", "no-token")
        .send([pacienteUltimo.correlativo]);

      expect(response.status).toBe(401);

      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    it("Should delete paciente", async () => {
      const response = await request
        .delete("/hradb-a-mongodb/pacientes")
        .set("Authorization", token)
        .send([pacienteUltimo.correlativo]);

      const pacienteObtenido = await Pacientes.findOne({
        correlativo: pacienteUltimo.correlativo,
      }).exec();
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(200);
      expect(pacienteObtenido).toBeFalsy();
    });
    it("Should delete multiple pacientes and return errors", async () => {
      const response = await request
        .delete("/hradb-a-mongodb/pacientes")
        .set("Authorization", token)
        .send(pacientesAEliminarSeed);

      expect(response.status).toBe(200);

      const pacientesBD = await Pacientes.find().exec();

      expect(pacientesBD.length).toBe(1);

      const { resultados } = response.body;

      expect(resultados.length).toBe(4);
      expect(resultados).toEqual([
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
  describe("GET /hradb-a-mongodb/pacientes/datos-contacto-actualizados/", () => {
    // Test de Autorización.
    it("Should not get updated datos contacto paciente", async () => {
      // Ejecutar endpoint.
      const response = await request
        .get("/hradb-a-mongodb/pacientes/datos-contacto-actualizados/")
        .set("Authorization", "no-token");
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(401);
      // Debe entregar el mensaje.
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    it("Should get updated datos contacto paciente from empty database", async () => {
      // Vaciar bd.
      await PacientesActualizados.deleteMany();
      // Ejecutar endpoint.
      const response = await request
        .get("/hradb-a-mongodb/pacientes/datos-contacto-actualizados/")
        .set("Authorization", token);
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(200);
      // Verificar que retornó un arreglo vacío.
      expect(response.body).toEqual([]);
    });
    it("Should get updated datos contacto paciente", async () => {
      // Ejecutar endpoint.
      const response = await request
        .get("/hradb-a-mongodb/pacientes/datos-contacto-actualizados/")
        .set("Authorization", token);
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(200);
      //Verficar que se obtuvieron las solicitudes del seed.
      expect(response.body.length).toBe(2);
    });
  });
  describe("DELETE /hradb-a-mongodb/pacientes/actualizar-datos-contacto-y-eliminar-solicitud/:numeroPaciente", () => {
    // Test de Autorización.
    it("Should not update datos contacto paciente", async () => {
      // Ejecutar endpoint.
      const response = await request
        .delete(
          "/hradb-a-mongodb/pacientes/actualizar-datos-contacto-y-eliminar-solicitud/16"
        )
        .set("Authorization", "no-token");
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(401);
      // Debe entregar el mensaje.
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
    });
    it("Should not update datos contacto paciente from a paciente that does not exists", async () => {
      // Ejecutar endpoint.
      const response = await request
        .delete(
          "/hradb-a-mongodb/pacientes/actualizar-datos-contacto-y-eliminar-solicitud/17"
        )
        .set("Authorization", token);
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(404);
      // Debe entregar el mensaje.
      expect(response.body.respuesta).toBe("Paciente no encontrado.");
    });
    it("Should update datos contacto paciente and delete respective pacientes_actualizados", async () => {
      // Ejecutar endpoint.
      const response = await request
        .delete(
          "/hradb-a-mongodb/pacientes/actualizar-datos-contacto-y-eliminar-solicitud/21"
        )
        .set("Authorization", token);
      // Verificar que el paciente existe.
      const pacienteActualizado = await Pacientes.findOne({
        numeroPaciente: 21,
      }).exec();
      // Verificar que la solicitud no existe.
      const solicitudPacienteActualizado = await PacientesActualizados.findOne({
        numeroPaciente: 21,
      }).exec();
      // Verificar que retornó el status code sea el correcto.
      expect(response.status).toBe(204);
      // Verificar que el paciente fue actualizado.
      expect(pacienteActualizado.direccion).toBe("nombre pasaje");
      expect(solicitudPacienteActualizado).toBeFalsy();
    });
  });
});
