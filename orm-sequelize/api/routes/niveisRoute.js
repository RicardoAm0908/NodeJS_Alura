const { Router } = require('express')
const NivelController = require('../controllers/NivelController')

const router = Router()

router.get('/niveis', NivelController.BuscarNiveis)

router.get('/niveis/:idNivel', NivelController.BuscarPorId)

router.post('/niveis', NivelController.SalvarNivel)

router.put('/niveis/:idNivel', NivelController.Atualizar)

router.delete('/niveis/:idNivel', NivelController.Excluir)

module.exports = router