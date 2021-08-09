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
  "/:codigoEstablecimiento/:numeroPaciente",
  isAuthenticated,
  pacientesController.update
);

router.delete(
  "/:codigoEstablecimiento/:numeroPaciente",
  isAuthenticated,
  pacientesController.delete
);

router.get(
  "/datos-contacto-actualizados/:codigoEstablecimiento",
  isAuthenticated,
  pacientesController.getPacientesActualizados
);

router.put(
  "/actualizar-datos-contacto-y-eliminar-solicitud/:codigoEstablecimiento/:numeroPaciente",
  isAuthenticated,
  pacientesController.updateAndDeleteSolicitud
);

module.exports = router;
