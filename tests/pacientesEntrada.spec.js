const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const Pacientes = require("../api/models/Pacientes");
const PacientesActualizados = require("../api/models/PacientesActualizados");
const pacientesSeed = require("../tests/testSeeds/pacientesSeed.json");
const pacientesActualizadosSeed = require("../tests/testSeeds/pacientesActualizadosSeed.json");

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
});

afterEach(async () => {
  await Pacientes.deleteMany();
  await PacientesActualizados.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints pacientes entrada", () => {
  describe("GET /inter-mongo-pacientes/entrada/solicitudes-actualizacion", () => {
    it("Should not get updated datos contacto paciente", async () => {
      const response = await request
        .get("/inter-mongo-pacientes/entrada/solicitudes-actualizacion/")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should get updated datos contacto paciente from empty database", async () => {
      await PacientesActualizados.deleteMany();
      const response = await request
        .get("/inter-mongo-pacientes/entrada/solicitudes-actualizacion/")
        .set("Authorization", token);

      expect(response.status).toBe(200);

      expect(response.body.respuesta).toEqual([]);
    });
    it("Should get updated datos contacto paciente", async () => {
      const response = await request
        .get("/inter-mongo-pacientes/entrada/solicitudes-actualizacion/")
        .set("Authorization", token);

      expect(response.status).toBe(200);

      expect(response.body.respuesta.length).toBe(3);
    });
  });
  describe("DELETE /inter-mongo-pacientes/entrada/solicitudes-actualizacion", () => {
    it("Should not delete solicitudes actualizar paciente", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/entrada/solicitudes-actualizacion")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should delete solicitudes", async () => {
      const response = await request
        .delete("/inter-mongo-pacientes/entrada/solicitudes-actualizacion")
        .set("Authorization", token)
        .send([1, 4, 2, 5]);

      expect(response.status).toBe(200);

      const solicitudesBD = await PacientesActualizados.find().exec();

      expect(solicitudesBD.length).toBe(1);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      expect(respuesta).toEqual([
        {
          afectado: 1,
          realizado: true,
          error: "",
        },
        {
          afectado: 4,
          realizado: true,
          error: "La solicitud no existe.",
        },
        {
          afectado: 2,
          realizado: true,
          error: "",
        },
        {
          afectado: 5,
          realizado: true,
          error: "La solicitud no existe.",
        },
      ]);
    });
  });
});
