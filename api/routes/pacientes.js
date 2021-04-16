const express = require('express')
const pacientesController = require('../controllers/pacientesController')
const { isAuthenticated } = require('../middleware/auth')

const router = express.Router()

router.get('/ultimo', isAuthenticated, pacientesController.getLast)

router.post('/', isAuthenticated, pacientesController.create)

router.put('/:pacPacNumero', isAuthenticated, pacientesController.update)

module.exports = router