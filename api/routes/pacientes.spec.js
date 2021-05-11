const supertest = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Pacientes = require("../models/Pacientes");
const PacientesActualizados = require("../models/PacientesActualizados");
const pacientesSeed = require("../testSeeds/pacientesSeed.json");
const pacientesActualizadosSeed = require("../testSeeds/pacientesActualizadosSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  // conectarse a la bd de testing
  await mongoose.connect(`${process.env.MONGO_URI_TEST}pacientes_test`, {
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

// paciente para realizar las pruebas
const pacienteGuardar = {
  numeroPaciente: 100,
  rut: "1-1",
  apellidoPaterno: "Apellido Paterno Paciente",
  apellidoMaterno: "Apellido Materno Paciente",
  nombre: "Nombre Paciente",
  direccionCalle: "Calle",
  direccionNumero: "1234",
  direccionDepartamento: "Departamento",
  direccionPoblacion: "Poblacion",
  codigoComuna: "Comuna",
  codigoCiudad: "Ciudad",
  codigoRegion: "Region",
  fono: "123412",
  telefonoMovil: "12341234",
  correoCuerpo: "correo",
  correoExtension: "@correo.com",
};

const pacienteActualizar = {
  numeroPaciente: 16,
  rut: "10771131-7",
  apellidoPaterno: "LAZO",
  apellidoMaterno: "ZAMBRA",
  nombre: "JACQUELINE CLOTILDE",
  direccionCalle: "calle",
  direccionNumero: "123",
  direccionDepartamento: "21",
  direccionPoblacion: "poblacion",
  codigoComuna: "comuna",
  codigoCiudad: "ciudad",
  codigoRegion: "region",
  fono: "123123",
  telefonoMovil: "12341234",
  correoCuerpo: "correo",
  correoExtension: "@correo.com",
};

describe("Endpoints pacientes", () => {
  describe("Get last paciente", () => {
    // test autorizacion
    it("Should not get last paciente", async (done) => {
      // ejecutar endpoint
      const response = await request
        .get("/hra/hradb_a_mongodb/pacientes/ultimo")
        .set("Authorization", "no-token");
      // verificar que retorno el status code correcto
      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");

      done();
    });
    // test bd vacia
    it("Should get last paciente from empty database", async (done) => {
      // borrar el contenido de la colleccion en la bd
      await Pacientes.deleteMany();
      // ejecutar endpoint
      const response = await request
        .get("/hra/hradb_a_mongodb/pacientes/ultimo")
        .set("Authorization", token);
      // verificar que retorno el status code correcto
      expect(response.status).toBe(200);
      expect(response.body).toEqual({});

      done();
    });
    // test ultimo paciente
    it("Should get last paciente", async (done) => {
      // guardar paciente que sera el ultimo
      await Pacientes.create(pacienteGuardar);
      // ejecutar endpoint
      const response = await request
        .get("/hra/hradb_a_mongodb/pacientes/ultimo")
        .set("Authorization", token);
      // verificar que retorno el status code correcto
      expect(response.status).toBe(200);
      // verificar que el paciente obtenido es igual al que se guardo
      expect(response.body.numeroPaciente).toBe(pacienteGuardar.numeroPaciente);
      expect(response.body.rut).toBe(pacienteGuardar.rut);
      expect(response.body.apellidoPaterno).toBe(
        pacienteGuardar.apellidoPaterno
      );
      expect(response.body.apellidoMaterno).toBe(
        pacienteGuardar.apellidoMaterno
      );
      expect(response.body.nombre).toBe(pacienteGuardar.nombre);
      expect(response.body.direccionCalle).toBe(pacienteGuardar.direccionCalle);
      expect(response.body.direccionNumero).toBe(
        pacienteGuardar.direccionNumero
      );
      expect(response.body.direccionDepartamento).toBe(
        pacienteGuardar.direccionDepartamento
      );
      expect(response.body.direccionPoblacion).toBe(
        pacienteGuardar.direccionPoblacion
      );
      expect(response.body.codigoComuna).toBe(pacienteGuardar.codigoComuna);
      expect(response.body.codigoCiudad).toBe(pacienteGuardar.codigoCiudad);
      expect(response.body.codigoRegion).toBe(pacienteGuardar.codigoRegion);
      expect(response.body.fono).toBe(pacienteGuardar.fono);
      expect(response.body.telefonoMovil).toBe(pacienteGuardar.telefonoMovil);
      expect(response.body.correoCuerpo).toBe(pacienteGuardar.correoCuerpo);
      expect(response.body.correoExtension).toBe(
        pacienteGuardar.correoExtension
      );

      done();
    });
  });
  describe("Save paciente", () => {
    // test autorizacion
    it("Should not save paciente", async (done) => {
      // ejecutar endpoint
      const response = await request
        .post("/hra/hradb_a_mongodb/pacientes/")
        .set("Authorization", "no-token")
        .send(pacienteGuardar);
      // obtener el paciente que no se guardo
      const pacienteObtenido = await Pacientes.findOne({
        numeroPaciente: pacienteGuardar.numeroPaciente,
      });
      // verificar que retorno el status code correcto
      expect(response.status).toBe(401);
      // debe entregar el mensaje
      expect(response.body.respuesta).toBe("Acceso no autorizado.");
      // no se debe haber encontrado el paciente
      expect(pacienteObtenido).toBeFalsy();

      done();
    });
    // test crear paciente
    it("Should save paciente", async (done) => {
      // ejecutar endpoint
      const response = await request
        .post("/hra/hradb_a_mongodb/pacientes/")
        .set("Authorization", token)
        .send(pacienteGuardar);
      // obtener el paciente que se guardo
      const pacienteObtenido = await Pacientes.findOne({
        numeroPaciente: pacienteGuardar.numeroPaciente,
      });
      // verificar que retorno el status code correcto
      expect(response.status).toBe(201);
      // verificar que el paciente obtenido de la bd es igual al que se guardo
      expect(pacienteObtenido.numeroPaciente).toBe(
        pacienteGuardar.numeroPaciente
      );
      expect(pacienteObtenido.rut).toBe(pacienteGuardar.rut);
      expect(pacienteObtenido.apellidoPaterno).toBe(
        pacienteGuardar.apellidoPaterno
      );
      expect(pacienteObtenido.apellidoMaterno).toBe(
        pacienteGuardar.apellidoMaterno
      );
      expect(pacienteObtenido.nombre).toBe(pacienteGuardar.nombre);
      expect(pacienteObtenido.direccionCalle).toBe(
        pacienteGuardar.direccionCalle
      );
      expect(pacienteObtenido.direccionNumero).toBe(
        pacienteGuardar.direccionNumero
      );
      expect(pacienteObtenido.direccionDepartamento).toBe(
        pacienteGuardar.direccionDepartamento
      );
      expect(pacienteObtenido.direccionPoblacion).toBe(
        pacienteGuardar.direccionPoblacion
      );
      expect(pacienteObtenido.codigoComuna).toBe(pacienteGuardar.codigoComuna);
      expect(pacienteObtenido.codigoCiudad).toBe(pacienteGuardar.codigoCiudad);
      expect(pacienteObtenido.codigoRegion).toBe(pacienteGuardar.codigoRegion);
      expect(pacienteObtenido.fono).toBe(pacienteGuardar.fono);
      expect(pacienteObtenido.telefonoMovil).toBe(
        pacienteGuardar.telefonoMovil
      );
      expect(pacienteObtenido.correoCuerpo).toBe(pacienteGuardar.correoCuerpo);
      expect(pacienteObtenido.correoExtension).toBe(
        pacienteGuardar.correoExtension
      );

      done();
    });
  });
  describe("Update paciente", () => {
    // test autorizacion
    it("Should not update paciente", async (done) => {
      // ejecutar endpoint
      const response = await request
        .put(
          `/hra/hradb_a_mongodb/pacientes/${pacienteActualizar.numeroPaciente}`
        )
        .set("Authorization", "no-token")
        .send(pacienteActualizar);
      // verificar que retorno el status code correcto
      expect(response.status).toBe(401);
      // debe entregar el mensaje
      expect(response.body.respuesta).toBe("Acceso no autorizado.");

      done();
    });
    // test actualizar paciente
    it("Should update paciente", async (done) => {
      // ejecutar endpoint
      const response = await request
        .put(
          `/hra/hradb_a_mongodb/pacientes/${pacienteActualizar.numeroPaciente}`
        )
        .set("Authorization", token)
        .send(pacienteActualizar);
      // obtener el paciente que se acualizo
      const pacienteObtenido = await Pacientes.findOne({
        numeroPaciente: pacienteActualizar.numeroPaciente,
      });
      // verificar que retorno el status code correcto
      expect(response.status).toBe(204);
      // verificar que el paciente obtenido es igual al que se guardo
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
      expect(pacienteObtenido.direccionCalle).toBe(
        pacienteActualizar.direccionCalle
      );
      expect(pacienteObtenido.direccionNumero).toBe(
        pacienteActualizar.direccionNumero
      );
      expect(pacienteObtenido.direccionDepartamento).toBe(
        pacienteActualizar.direccionDepartamento
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
      expect(pacienteObtenido.fono).toBe(pacienteActualizar.fono);
      expect(pacienteObtenido.telefonoMovil).toBe(
        pacienteActualizar.telefonoMovil
      );
      expect(pacienteObtenido.correoCuerpo).toBe(
        pacienteActualizar.correoCuerpo
      );
      expect(pacienteObtenido.correoExtension).toBe(
        pacienteActualizar.correoExtension
      );

      done();
    });
  });
  describe("Get updated datos de contacto de pacientes", () => {
    it("Should not get updated datos contacto paciente", async (done) => {
      const response = await request
        .get("/hra/hradb_a_mongodb/pacientes/datos_contacto_actualizados")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");

      done();
    });
    it("Should get updated datos contacto paciente from empty database", async (done) => {
      await PacientesActualizados.deleteMany();
      const response = await request
        .get("/hra/hradb_a_mongodb/pacientes/datos_contacto_actualizados")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
    it("Should get updated datos contacto paciente", async (done) => {
      const response = await request
        .get("/hra/hradb_a_mongodb/pacientes/datos_contacto_actualizados")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);

      done();
    });
  });
  describe("Update datos de contacto de pacientes and delete respective pacientes_actualizados", () => {
    it("Should not update datos contacto paciente", async (done) => {
      const response = await request
        .get(
          "/hra/hradb_a_mongodb/pacientes/actualizar_datos_contacto_y_eliminar_solicitud/16"
        )
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");

      done();
    });
    it("Should not update datos contacto paciente from a paciente that does not exists", async (done) => {
      const response = await request
        .get(
          "/hra/hradb_a_mongodb/pacientes/actualizar_datos_contacto_y_eliminar_solicitud/17"
        )
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body.respuesta).toBe("Paciente no encontrado.");

      done();
    });
    it("Should update datos contacto paciente and delete respective pacientes_actualizados", async (done) => {
      const response = await request
        .get(
          "/hra/hradb_a_mongodb/pacientes/actualizar_datos_contacto_y_eliminar_solicitud/19"
        )
        .set("Authorization", token);

      const pacienteActualizado = await Pacientes.findOne({
        numeroPaciente: 19,
      }).exec();

      const solicitudPacienteActualizado = await PacientesActualizados.findOne({
        numeroPaciente: 19,
      }).exec();

      expect(response.status).toBe(204);

      expect(pacienteActualizado.direccionCalle).toBe("calle");
      expect(solicitudPacienteActualizado).toBeFalsy();

      done();
    });
  });
});
