const express = require("express");
const pacientesController = require("../controllers/pacientesController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/ultimo/", isAuthenticated, pacientesController.getLast);

router.post("", isAuthenticated, pacientesController.create);

router.put("/:numeroPaciente", isAuthenticated, pacientesController.update);

router.delete("/:numeroPaciente", isAuthenticated, pacientesController.delete);

router.get(
  "/datos-contacto-actualizados/",
  isAuthenticated,
  pacientesController.getPacientesActualizados
);

router.delete(
  "/actualizar-datos-contacto-y-eliminar-solicitud/:numeroPaciente",
  isAuthenticated,
  pacientesController.updateAndDeleteSolicitud
);

module.exports = router;
