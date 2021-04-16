const supertest = require('supertest')
const app = require('../index')
const mongoose = require('mongoose')
const Pacientes = require('../models/Pacientes')
const pacientesSeed = require('../testSeeds/pacientesSeed.json')

const request = supertest(app)

const token = process.env.HRADB_A_MONGODB_SECRET

beforeEach(async () => {
    await mongoose.disconnect()
    // conectarse a la bd de testing
    await mongoose.connect(`${process.env.MONGO_URI_TEST}pacientes_test`, { useNewUrlParser: true, useUnifiedTopology: true })
    // cargar los seeds a la bd
    for (const pacienteSeed of pacientesSeed) {
      await Pacientes.create(pacienteSeed)
    }
})

afterEach(async () => {
    // borrar el contenido de la colleccion en la bd
    await Pacientes.deleteMany()
    // cerrar la coneccion a la bd
    await mongoose.disconnect()
})

// paciente para realizar las pruebas
const pacienteGuardar = {
    PAC_PAC_Numero: 100,
    PAC_PAC_Rut: '1-1',
    PAC_PAC_ApellPater: 'Apellido Paterno Paciente',
    PAC_PAC_ApellMater: 'Apellido Materno Paciente',
    PAC_PAC_Nombre: 'Nombre Paciente',
    PAC_PAC_CalleHabit: 'Calle',
    PAC_PAC_NumerHabit: '1234',
    PAC_PAC_DeparHabit: 'Departamento',
    PAC_PAC_PoblaHabit: 'Poblacion',
    PAC_PAC_ComunHabit: 'Comuna',
    PAC_PAC_CiudaHabit: 'Ciudad',
    PAC_PAC_RegioHabit: 'Region',
    PAC_PAC_Fono: '123412',
    PAC_PAC_TelefonoMovil: '12341234',
    PAC_PAC_CorreoCuerpo: 'correo',
    PAC_PAC_CorreoExtension: '@correo.com',
}

const pacienteActualizar = {
    PAC_PAC_Numero:16,
    PAC_PAC_Rut:"10771131-7",
    PAC_PAC_ApellPater:"LAZO",
    PAC_PAC_ApellMater:"ZAMBRA",
    PAC_PAC_Nombre:"JACQUELINE CLOTILDE",
    PAC_PAC_CalleHabit:"calle",
    PAC_PAC_NumerHabit:"123",
    PAC_PAC_DeparHabit:"21",
    PAC_PAC_PoblaHabit:"poblacion",
    PAC_PAC_ComunHabit:"comuna",
    PAC_PAC_CiudaHabit:"ciudad",
    PAC_PAC_RegioHabit:"region",
    PAC_PAC_Fono:"123123",
    PAC_PAC_TelefonoMovil:"12341234",
    PAC_PAC_CorreoCuerpo:"correo",
    PAC_PAC_CorreoExtension: '@correo.com',
}

describe('Endpoints pacientes', () => {
    describe('Get last paciente', () => {
        // test autorizacion
        it('Should not get last paciente from database', async (done) => {
            // ejecutar endpoint
            const response = await request.get('/hra/hradb_a_mongodb/pacientes/ultimo')
                .set('Authorization', 'no-token')
            // verificar que retorno el status code correcto
            expect(response.status).toBe(403)

            done()
        })
        // test bd vacia
        it('Should get last receta from empty database', async (done) => {
            // borrar el contenido de la colleccion en la bd
            await Pacientes.deleteMany()
            // ejecutar endpoint
            const response = await request.get('/hra/hradb_a_mongodb/pacientes/ultimo')
                .set('Authorization', token)
            // verificar que retorno el status code correcto
            expect(response.status).toBe(200)
            expect(response.body).toEqual({})

            done()
        })
        // test ultimo paciente
        it('Should get last paciente from database', async (done) => {
            // guardar paciente que sera el ultimo
            await Pacientes.create(pacienteGuardar)
            // ejecutar endpoint
            const response = await request.get('/hra/hradb_a_mongodb/pacientes/ultimo')
                .set('Authorization', token)
            // verificar que retorno el status code correcto
            expect(response.status).toBe(200)
            // verificar que el paciente obtenido es igual al que se guardo
            expect(response.body.PAC_PAC_Numero).toBe(pacienteGuardar.PAC_PAC_Numero)
            expect(response.body.PAC_PAC_Rut).toBe(pacienteGuardar.PAC_PAC_Rut)
            expect(response.body.PAC_PAC_ApellPater).toBe(pacienteGuardar.PAC_PAC_ApellPater)
            expect(response.body.PAC_PAC_ApellMater).toBe(pacienteGuardar.PAC_PAC_ApellMater)
            expect(response.body.PAC_PAC_Nombre).toBe(pacienteGuardar.PAC_PAC_Nombre)
            expect(response.body.PAC_PAC_CalleHabit).toBe(pacienteGuardar.PAC_PAC_CalleHabit)
            expect(response.body.PAC_PAC_NumerHabit).toBe(pacienteGuardar.PAC_PAC_NumerHabit)
            expect(response.body.PAC_PAC_DeparHabit).toBe(pacienteGuardar.PAC_PAC_DeparHabit)
            expect(response.body.PAC_PAC_PoblaHabit).toBe(pacienteGuardar.PAC_PAC_PoblaHabit)
            expect(response.body.PAC_PAC_ComunHabit).toBe(pacienteGuardar.PAC_PAC_ComunHabit)
            expect(response.body.PAC_PAC_CiudaHabit).toBe(pacienteGuardar.PAC_PAC_CiudaHabit)
            expect(response.body.PAC_PAC_RegioHabit).toBe(pacienteGuardar.PAC_PAC_RegioHabit)
            expect(response.body.PAC_PAC_Fono).toBe(pacienteGuardar.PAC_PAC_Fono)
            expect(response.body.PAC_PAC_TelefonoMovil).toBe(pacienteGuardar.PAC_PAC_TelefonoMovil)
            expect(response.body.PAC_PAC_CorreoCuerpo).toBe(pacienteGuardar.PAC_PAC_CorreoCuerpo)
            expect(response.body.PAC_PAC_CorreoExtension).toBe(pacienteGuardar.PAC_PAC_CorreoExtension)

            done()
        })
    })
    describe('Save paciente', () => {
        // test autorizacion
        it('Should not save paciente to database', async (done) => {
            // ejecutar endpoint
            const response = await request.post('/hra/hradb_a_mongodb/pacientes/')
                .set('Authorization', 'no-token')
                .send(pacienteGuardar)
            // obtener el paciente que no se guardo
            const pacienteObtenido = await Pacientes.findOne({ PAC_PAC_Numero: pacienteGuardar.PAC_PAC_Numero })
            // verificar que retorno el status code correcto
            expect(response.status).toBe(403)
            // no se debe haber encontrado el paciente
            expect(pacienteObtenido).toBeFalsy()

            done()
        })
        // test crear paciente
        it('Should save paciente to database', async (done) => {
            // ejecutar endpoint
            const response = await request.post('/hra/hradb_a_mongodb/pacientes/')
                .set('Authorization', token)
                .send(pacienteGuardar)
            // obtener el paciente que se guardo
            const pacienteObtenido = await Pacientes.findOne({ PAC_PAC_Numero: pacienteGuardar.PAC_PAC_Numero })
            // verificar que retorno el status code correcto
            expect(response.status).toBe(201)
            // verificar que el paciente obtenido de la bd es igual al que se guardo
            expect(pacienteObtenido.PAC_PAC_Numero).toBe(pacienteGuardar.PAC_PAC_Numero)
            expect(pacienteObtenido.PAC_PAC_Rut).toBe(pacienteGuardar.PAC_PAC_Rut)
            expect(pacienteObtenido.PAC_PAC_ApellPater).toBe(pacienteGuardar.PAC_PAC_ApellPater)
            expect(pacienteObtenido.PAC_PAC_ApellMater).toBe(pacienteGuardar.PAC_PAC_ApellMater)
            expect(pacienteObtenido.PAC_PAC_Nombre).toBe(pacienteGuardar.PAC_PAC_Nombre)
            expect(pacienteObtenido.PAC_PAC_CalleHabit).toBe(pacienteGuardar.PAC_PAC_CalleHabit)
            expect(pacienteObtenido.PAC_PAC_NumerHabit).toBe(pacienteGuardar.PAC_PAC_NumerHabit)
            expect(pacienteObtenido.PAC_PAC_DeparHabit).toBe(pacienteGuardar.PAC_PAC_DeparHabit)
            expect(pacienteObtenido.PAC_PAC_PoblaHabit).toBe(pacienteGuardar.PAC_PAC_PoblaHabit)
            expect(pacienteObtenido.PAC_PAC_ComunHabit).toBe(pacienteGuardar.PAC_PAC_ComunHabit)
            expect(pacienteObtenido.PAC_PAC_CiudaHabit).toBe(pacienteGuardar.PAC_PAC_CiudaHabit)
            expect(pacienteObtenido.PAC_PAC_RegioHabit).toBe(pacienteGuardar.PAC_PAC_RegioHabit)
            expect(pacienteObtenido.PAC_PAC_Fono).toBe(pacienteGuardar.PAC_PAC_Fono)
            expect(pacienteObtenido.PAC_PAC_TelefonoMovil).toBe(pacienteGuardar.PAC_PAC_TelefonoMovil)
            expect(pacienteObtenido.PAC_PAC_CorreoCuerpo).toBe(pacienteGuardar.PAC_PAC_CorreoCuerpo)
            expect(pacienteObtenido.PAC_PAC_CorreoExtension).toBe(pacienteGuardar.PAC_PAC_CorreoExtension)

            done()
        })
    })
    describe('Update paciente', () => {
        // test autorizacion
        it('Should not update paciente to database', async (done) => {
            // ejecutar endpoint
            const response = await request.put(`/hra/hradb_a_mongodb/pacientes/${pacienteActualizar.PAC_PAC_Numero}`)
                .set('Authorization', 'no-token')
                .send(pacienteActualizar)
            // verificar que retorno el status code correcto
            expect(response.status).toBe(403)

            done()
        })
        // test actualizar paciente
        it('Should update paciente to database', async (done) => {
            // ejecutar endpoint
            const response = await request.put(`/hra/hradb_a_mongodb/pacientes/${pacienteActualizar.PAC_PAC_Numero}`)
                .set('Authorization', token)
                .send(pacienteActualizar)
            // obtener el paciente que se acualizo
            const pacienteObtenido = await Pacientes.findOne({ PAC_PAC_Numero: pacienteActualizar.PAC_PAC_Numero })
            // verificar que retorno el status code correcto
            expect(response.status).toBe(204)
            // verificar que el paciente obtenido es igual al que se guardo
            expect(pacienteObtenido.PAC_PAC_Numero).toBe(pacienteActualizar.PAC_PAC_Numero)
            expect(pacienteObtenido.PAC_PAC_Rut).toBe(pacienteActualizar.PAC_PAC_Rut)
            expect(pacienteObtenido.PAC_PAC_ApellPater).toBe(pacienteActualizar.PAC_PAC_ApellPater)
            expect(pacienteObtenido.PAC_PAC_ApellMater).toBe(pacienteActualizar.PAC_PAC_ApellMater)
            expect(pacienteObtenido.PAC_PAC_Nombre).toBe(pacienteActualizar.PAC_PAC_Nombre)
            expect(pacienteObtenido.PAC_PAC_CalleHabit).toBe(pacienteActualizar.PAC_PAC_CalleHabit)
            expect(pacienteObtenido.PAC_PAC_NumerHabit).toBe(pacienteActualizar.PAC_PAC_NumerHabit)
            expect(pacienteObtenido.PAC_PAC_DeparHabit).toBe(pacienteActualizar.PAC_PAC_DeparHabit)
            expect(pacienteObtenido.PAC_PAC_PoblaHabit).toBe(pacienteActualizar.PAC_PAC_PoblaHabit)
            expect(pacienteObtenido.PAC_PAC_ComunHabit).toBe(pacienteActualizar.PAC_PAC_ComunHabit)
            expect(pacienteObtenido.PAC_PAC_CiudaHabit).toBe(pacienteActualizar.PAC_PAC_CiudaHabit)
            expect(pacienteObtenido.PAC_PAC_RegioHabit).toBe(pacienteActualizar.PAC_PAC_RegioHabit)
            expect(pacienteObtenido.PAC_PAC_Fono).toBe(pacienteActualizar.PAC_PAC_Fono)
            expect(pacienteObtenido.PAC_PAC_TelefonoMovil).toBe(pacienteActualizar.PAC_PAC_TelefonoMovil)
            expect(pacienteObtenido.PAC_PAC_CorreoCuerpo).toBe(pacienteActualizar.PAC_PAC_CorreoCuerpo)
            expect(pacienteObtenido.PAC_PAC_CorreoExtension).toBe(pacienteActualizar.PAC_PAC_CorreoExtension)

            done()
        })
    })
})
