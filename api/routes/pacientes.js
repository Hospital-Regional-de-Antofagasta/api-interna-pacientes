const express = require("express");
const pacientesController = require("../controllers/pacientesController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/ultimo/:codigoEstablecimiento",
  isAuthenticated,
  pacientesController.getLast
);

router.post("", isAuthenticated, pacientesController.create);

router.put(
  "/:numeroPaciente/:codigoEstablecimiento",
  isAuthenticated,
  pacientesController.update
);

router.get(
  "/datos-contacto-actualizados/:codigoEstablecimiento",
  isAuthenticated,
  pacientesController.getPacientesActualizados
);

router.put(
  "/actualizar-datos-contacto-y-eliminar-solicitud/:numeroPaciente/:codigoEstablecimiento",
  isAuthenticated,
  pacientesController.updateAndDeleteSolicitud
);

module.exports = router;
