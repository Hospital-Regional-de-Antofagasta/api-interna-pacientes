const express = require("express");
const pacientesController = require("../controllers/pacientesController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/ultimo", isAuthenticated, pacientesController.getLast);

router.post("/", isAuthenticated, pacientesController.create);

router.put("/:numeroPaciente", isAuthenticated, pacientesController.update);

router.get(
  "/datos_contacto_actualizados",
  isAuthenticated,
  pacientesController.getPacientesActualizados
);

router.get(
  "/actualizar_datos_contacto_y_eliminar_solicitud/:numeroPaciente",
  isAuthenticated,
  pacientesController.updateAndDeleteSolicitud
);

module.exports = router;
