const { Router } = require('express')
const PessoaController = require('../controllers/PessoaController')

const router = Router()

router.get('/pessoas', PessoaController.BuscarPessoasAtivas)

router.get('/pessoas/todos', PessoaController.BuscarPessoas)

router.get('/pessoas/:idPessoa', PessoaController.BuscarPorId)

router.post('/pessoas', PessoaController.SalvarPessoa)

router.put('/pessoas/:idPessoa', PessoaController.Atualizar)

router.delete('/pessoas/:idPessoa', PessoaController.Excluir)

router.post('/pessoas/:idPessoa/restaura', PessoaController.RestauraPessoa)

router.get('/pessoas/:idPessoa/matriculas', PessoaController.BuscarMatriculasPessoa)

router.get('/pessoas/:idPessoa/matriculas/:idMatricula', PessoaController.BuscarMatriculaPorId)

router.post('/pessoas/:idPessoa/matriculas', PessoaController.SalvarMatricula)

router.put('/pessoas/:idPessoa/matriculas/:idMatricula', PessoaController.AtualizarMatricula)

router.delete('/pessoas/:idPessoa/matriculas/:idMatricula', PessoaController.ExcluirMatricula)

router.get('/pessoas/matriculas/:idTurma/confirmadas', PessoaController.BuscarMatriculasPorTurma)

router.get('/pessoas/matriculas/lotada', PessoaController.BuscarTurmasLotadas)

router.post('/pessoas/:idPessoa/cancela', PessoaController.CancelaPessoa)

module.exports = router