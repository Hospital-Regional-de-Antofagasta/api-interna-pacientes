const express = require("express");
const pacientesEntradaController = require("../controllers/pacientesEntradaController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/solicitudes-actualizacion",
  isAuthenticated,
  pacientesEntradaController.getSolicitudesActualizacion
);

router.delete(
  "/solicitudes-actualizacion",
  isAuthenticated,
  pacientesEntradaController.deleteSolicitudesActualizacion
);

module.exports = router;
