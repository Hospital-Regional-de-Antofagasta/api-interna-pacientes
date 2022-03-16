require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const pacientesSalida = require("./routes/pacientesSalida");
const pacientesEntrada = require("./routes/pacientesEntrada");
const pacientes = require("./routes/pacientesOld");

const app = express();

app.use(express.json());
app.use(cors());

const connection = process.env.MONGO_URI;
const port = process.env.PORT;
const localhost = process.env.HOSTNAME;

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/inter-mongo-pacientes/health", (req, res) => {
  res.status(200).send("ready");
});

// Desde el hospital a la nube
app.use("/inter-mongo-pacientes/salida", pacientesSalida);

// Desde la nube al hospital
app.use("/inter-mongo-pacientes/entrada", pacientesEntrada);

app.use("/hradb-a-mongodb/pacientes", pacientes);

if (require.main === module) {
  // true if file is executed
  process.on("SIGINT", function () {
    process.exit();
  });
  app.listen(port, () => {
    console.log(`App listening at http://${localhost}:${port}`);
  });
}

module.exports = app;
