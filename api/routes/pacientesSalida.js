const express = require("express");
const pacientesSalidaController = require("../controllers/pacientesSalidaController");
const { isAuthenticated } = require("../middleware/auth");
const { requiredParameters } = require("../middleware/validarPaciente");

const router = express.Router();

router.post(
  "",
  isAuthenticated,
  requiredParameters,
  pacientesSalidaController.create
);

router.put(
  "",
  isAuthenticated,
  requiredParameters,
  pacientesSalidaController.updateMany
);

router.delete(
  "",
  isAuthenticated,
  requiredParameters,
  pacientesSalidaController.deleteMany
);

module.exports = router;
