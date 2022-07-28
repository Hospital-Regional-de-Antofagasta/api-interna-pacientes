const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const Pacientes = require("../api/models/Pacientes");
const PacientesActualizados = require("../api/models/PacientesActualizados");
const SolicitudesIdsSuscriptorPacientes = require("../api/models/SolicitudesIdsSuscriptorPacientes");
const pacientesSeed = require("../tests/testSeeds/pacientesSeed.json");
const pacientesActualizadosSeed = require("../tests/testSeeds/pacientesActualizadosSeed.json");
const solicitudesIdsSuscriptorPacientesSeed = require("../tests/testSeeds/solicitudesIdsSuscriptorPacientesSeed.json");
const muchasSolicitudesIdsSuscriptorPacientesSeed = require("../tests/testSeeds/muchasSolicitudesIdsSuscriptorPacientesSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/pacientes_entrada_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Pacientes.create(pacientesSeed);
  await PacientesActualizados.create(pacientesActualizadosSeed);
  await SolicitudesIdsSuscriptorPacientes.create(
    solicitudesIdsSuscriptorPacientesSeed
  );
});

afterEach(async () => {
  await Pacientes.deleteMany();
  await PacientesActualizados.deleteMany();
  await SolicitudesIdsSuscriptorPacientes.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints pacientes entrada", () => {
  describe("GET /inter-mongo-pacientes/entrada/solicitudes-actualizacion", () => {
    it("Should not get updated datos contacto paciente without token", async () => {
      const response = await request.get(
        "/inter-mongo-pacientes/entrada/solicitudes-actualizacion/"
      );

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should not get updated datos contacto paciente with invalid token", async () => {
      const response = await request
        .get("/inter-mongo-pacientes/entrada/solicitudes-actualizacion/")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should not get updated datos contacto paciente without codigo establecimiento", async () => {
      const response = await request
        .get("/inter-mongo-pacientes/entrada/solicitudes-actualizacion/")
        .set("Authorization", token);

      expect(response.status).toBe(400);

      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );
    });
    it("Should get updated datos contacto paciente from empty database", async () => {
      await PacientesActualizados.deleteMany();
      const response = await request
        .get(
          "/inter-mongo-pacientes/entrada/solicitudes-actualizacion?codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);

      expect(response.body.respuesta).toEqual([]);
    });
    it("Should get updated datos contacto paciente", async () => {
      const response = await request
        .get(
          "/inter-mongo-pacientes/entrada/solicitudes-actualizacion?codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);

      expect(response.body.respuesta.length).toBe(3);
    });
  });
  describe("DELETE /inter-mongo-pacientes/entrada/solicitudes-actualizacion", () => {
    it("Should not delete solicitudes actualizar paciente without token", async () => {
      const response = await request.delete(
        "/inter-mongo-pacientes/entrada/solicitudes-actualizacion"
      );

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should not delete solicitudes actualizar paciente with invalid token", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/entrada/solicitudes-actualizacion")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should not delete solicitudes actualizar paciente without codigo establecimiento", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/entrada/solicitudes-actualizacion")
        .set("Authorization", token);

      expect(response.status).toBe(400);

      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );
    });
    it("Should delete solicitudes", async () => {
      const response = await request
        .delete(
          "/inter-mongo-pacientes/entrada/solicitudes-actualizacion?codigoEstablecimiento=HRA"
        )
        .set("Authorization", token)
        .send(["10771131-7", "44444444-4", "17724699-9", "55555555-5"]);

      expect(response.status).toBe(200);

      const solicitudesBD = await PacientesActualizados.find().exec();

      expect(solicitudesBD.length).toBe(2);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      expect(respuesta).toEqual([
        {
          afectado: "10771131-7",
          realizado: true,
          error: "",
        },
        {
          afectado: "44444444-4",
          realizado: true,
          error: "La solicitud no existe.",
        },
        {
          afectado: "17724699-9",
          realizado: true,
          error: "",
        },
        {
          afectado: "55555555-5",
          realizado: true,
          error: "La solicitud no existe.",
        },
      ]);
    });
  });
  describe("GET /inter-mongo-pacientes/entrada/solicitudes-ids-suscriptor", () => {
    it("Debería retornar error si no se recibe token.", async () => {
      const response = await request.get(
        "/inter-mongo-pacientes/entrada/solicitudes-ids-suscriptor?codigoEstablecimiento=HRA"
      );

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Debería retornar error si el token es invalido.", async () => {
      const response = await request
        .get(
          "/inter-mongo-pacientes/entrada/solicitudes-ids-suscriptor?codigoEstablecimiento=HRA"
        )
        .set("Authorization", "token");

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Debería retornar error si no se recibe el código de establecimiento.", async () => {
      const response = await request
        .get("/inter-mongo-pacientes/entrada/solicitudes-ids-suscriptor")
        .set("Authorization", token);

      expect(response.status).toBe(400);

      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );
    });
    it("Debería retornar vacío si no hay solicitudes.", async () => {
      await SolicitudesIdsSuscriptorPacientes.deleteMany();
      const response = await request
        .get(
          "/inter-mongo-pacientes/entrada/solicitudes-ids-suscriptor?codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);

      expect(response.body.respuesta.length).toBe(0);
      expect(response.body.respuesta).toEqual([]);
    });
    it("Debería retornar las solicitudes.", async () => {
      const response = await request
        .get(
          "/inter-mongo-pacientes/entrada/solicitudes-ids-suscriptor?codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);

      expect(response.body.respuesta.length).toBe(5);

      expect(response.body.respuesta[0]._id).toBeFalsy();
      expect(response.body.respuesta[0].rutPaciente).toBe("11111111-1");
      expect(response.body.respuesta[0].idSuscriptor).toBe("1239784534");
      expect(response.body.respuesta[0].accion).toBe("INSERTAR");
      expect(response.body.respuesta[0].codigoEstablecimiento).toBeFalsy();
      expect(response.body.respuesta[0].nombreDispositivo).toBe("moto g7");
      expect(response.body.respuesta[0].__v).toBeFalsy();
    });
    it("Debería retornar máximo 100 solicitudes.", async () => {
      await SolicitudesIdsSuscriptorPacientes.create(
        muchasSolicitudesIdsSuscriptorPacientesSeed
      );
      const response = await request
        .get(
          "/inter-mongo-pacientes/entrada/solicitudes-ids-suscriptor?codigoEstablecimiento=HRA"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);

      expect(response.body.respuesta.length).toBe(100);
    });
  });
  describe("DELETE /inter-mongo-pacientes/entrada/solicitudes-ids-Suscriptor", () => {
    it("Should not delete solicitudes actualizar paciente without token", async () => {
      const response = await request.delete(
        "/inter-mongo-pacientes/entrada/solicitudes-ids-Suscriptor?codigoEstablecimiento=HRA"
      );

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should not delete solicitudes actualizar paciente with invalid token", async () => {
      const response = await request
        .delete(
          "/inter-mongo-pacientes/entrada/solicitudes-ids-Suscriptor?codigoEstablecimiento=HRA"
        )
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should not delete solicitudes actualizar paciente without codigo establecimiento", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/entrada/solicitudes-ids-Suscriptor")
        .set("Authorization", token);

      expect(response.status).toBe(400);

      expect(response.body.error).toBe(
        "Se debe enviar el codigo del establecimiento."
      );
    });
    it("Should delete solicitudes", async () => {
      const response = await request
        .delete(
          "/inter-mongo-pacientes/entrada/solicitudes-ids-Suscriptor?codigoEstablecimiento=HRA"
        )
        .set("Authorization", token)
        .send([
          {
            rutPaciente: "11111111-1",
            idSuscriptor: "1239784534",
            accion: "INSERTAR",
          },
          {
            rutPaciente: "44444444-4",
            idSuscriptor: "46983485796",
            accion: "INSERTAR",
          },
          {
            rutPaciente: "11111111-1",
            idSuscriptor: "0864764563",
            accion: "ELIMINAR",
          },
          {
            rutPaciente: "55555555-5",
            idSuscriptor: "8827543247",
            accion: "ELIMINAR",
          },
        ]);

      expect(response.status).toBe(200);

      const solicitudesBD =
        await SolicitudesIdsSuscriptorPacientes.find().exec();

      expect(solicitudesBD.length).toBe(3);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      expect(respuesta).toEqual([
        {
          afectado: "11111111-1|1239784534|INSERTAR",
          realizado: true,
          error: "",
        },
        {
          afectado: "44444444-4|46983485796|INSERTAR",
          realizado: true,
          error: "La solicitud no existe.",
        },
        {
          afectado: "11111111-1|0864764563|ELIMINAR",
          realizado: true,
          error: "",
        },
        {
          afectado: "55555555-5|8827543247|ELIMINAR",
          realizado: true,
          error: "La solicitud no existe.",
        },
      ]);
    });
  });
});
