const express = require("express");
const pacientesEntradaController = require("../controllers/pacientesEntradaController");
const { isAuthenticated } = require("../middleware/auth");
const { requiredParameters } = require("../middleware/validarPaciente");

const router = express.Router();

router.get(
  "/solicitudes-actualizacion",
  isAuthenticated,
  requiredParameters,
  pacientesEntradaController.getSolicitudesActualizacion
);

router.delete(
  "/solicitudes-actualizacion",
  isAuthenticated,
  requiredParameters,
  pacientesEntradaController.deleteSolicitudesActualizacion
);

router.get(
  "/solicitudes-ids-suscriptor",
  isAuthenticated,
  requiredParameters,
  pacientesEntradaController.getSolicitudesIdSuscriptor
);

router.delete(
  "/solicitudes-ids-suscriptor",
  isAuthenticated,
  requiredParameters,
  pacientesEntradaController.deleteSolicitudesIdSuscriptor
);

module.exports = router;
