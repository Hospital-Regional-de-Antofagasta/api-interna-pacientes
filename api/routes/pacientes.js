const express = require("express");
const pacientesController = require("../controllers/pacientesController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/ids-suscriptor/:rutPaciente",
  isAuthenticated,
  pacientesController.getIdsSuscriptor
);

module.exports = router;
