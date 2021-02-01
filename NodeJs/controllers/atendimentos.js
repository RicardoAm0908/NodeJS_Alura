const Atendimento = require('../models/atendimentos')

module.exports = app => {
    app.get('/atendimentos', (req, res) => {
        Atendimento.lista()        
        .then(atendimentos => { res.status(201).json(atendimentos.resultados.rows) })
        .catch(erros => res.status(400).json(erros))
    })

    app.get('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Atendimento.buscarPorId(id, res).then(retorno => { 
            const atendimento = retorno.resultados.rows[0]
            const cpf = atendimento.cliente
            //const { data } = axios.get(`http://localhost:8082/${cpf}`)
            //atendimento.cliente = data   
            res.status(201).json(atendimento)         
        })
        .catch(erros => res.status(400).json(erros))    
    })

    app.post('/atendimentos', (req, res) => {
        const atendimento = req.body
        Atendimento.adiciona(atendimento)
            .then(atendimentoCadastrado => res.status(201).json(atendimentoCadastrado))
            .catch(erros => res.status(400).json(erros))
    })

    app.patch('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const valores = req.body
        Atendimento.altera(id, valores, res)
    })

    app.delete('/atendimentos/:id', (req, res) => { 
        const id = parseInt(req.params.id)
        Atendimento.deleta(id, res)
    })
}
