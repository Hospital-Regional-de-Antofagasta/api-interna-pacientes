const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const IdsSuscriptorPacientes = require("../api/models/IdsSuscriptorPacientes")
const idsSuscriptorPacientesSeed = require("../tests/testSeeds/idsSuscriptorPacientesSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/pacientes_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await IdsSuscriptorPacientes.create(idsSuscriptorPacientesSeed);
});

afterEach(async () => {
  await IdsSuscriptorPacientes.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints pacientes salida", () => {
  describe("GET /inter-mongo-pacientes/pacientes/ids-suscriptor", () => {
    it("Should not get ids suscriptor paciente without token", async () => {
      const response = await request
        .get("/inter-mongo-pacientes/pacientes/ids-suscriptor/11111111-1");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should not get ids suscriptor paciente with invalid token", async () => {
      const response = await request
        .get("/inter-mongo-pacientes/pacientes/ids-suscriptor/11111111-1")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Acceso no autorizado.");
    });
    it("Should get ids suscriptor del paciente", async () => {
      const response = await request
        .get("/inter-mongo-pacientes/pacientes/ids-suscriptor/11111111-1")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body[0]).toBe("74812312-3489");
      expect(response.body[1]).toBe("20398402-8340");
      expect(response.body[2]).toBe("23940-2394123");
    });
  });
});
