const Pacientes = require('../models/Pacientes')

// obtener el ultimo paciente ingresado a la bd
exports.getLast = async (req, res) => {
    try {
        const paciente = await Pacientes.findOne()
            .sort({ numeroPaciente: -1 }).exec()
        res.status(200).send(paciente)
    } catch (error) {
        res.status(500).send(`Pacientes: ${error.name} - ${error.message}`)
    }
}

// crear paciente recibido en la bd
exports.create = async (req, res) => {
    try {
        await Pacientes.create(req.body)
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(`Pacientes: ${error.name} - ${error.message}`)
    }
}

// actualizar paciente en la bd recibiendo el numero de paciente
exports.update = async (req, res) => {
    try {
        const filter = { numeroPaciente: req.params.pacPacNumero }
        const update = req.body
        await Pacientes.findOneAndUpdate(filter, update).exec()
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(`Pacientes: ${error.name} - ${error.message}`)
    }
}