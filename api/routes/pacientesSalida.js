const express = require("express");
const pacientesSalidaController = require("../controllers/pacientesSalidaController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("", isAuthenticated, pacientesSalidaController.create);

router.put("", isAuthenticated, pacientesSalidaController.updateMany);

router.delete("", isAuthenticated, pacientesSalidaController.deleteMany);

module.exports = router;
