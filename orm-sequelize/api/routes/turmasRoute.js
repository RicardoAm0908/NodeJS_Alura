const { Router } = require('express')
const TurmaController = require('../controllers/TurmaController')

const router = Router()

router.get('/turmas', TurmaController.BuscarTurmas)

router.get('/turmas/:idTurma', TurmaController.BuscarPorId)

router.post('/turmas', TurmaController.SalvarTurma)

router.put('/turmas/:idTurma', TurmaController.Atualizar)

router.delete('/turmas/:idTurma', TurmaController.Excluir)

module.exports = router