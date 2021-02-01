const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'GET')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()
})

roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    const serializador = new SerializadorFornecedor(
        resposta.getHeader('Content-Type'),
        ['categoria']
        )
    resposta.status(200).send(serializador.serializar(resultados))
    resposta.send('Ok')
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try{
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type')
            )
        resposta.status(201).send(serializador.serializar(fornecedor))
    } catch(ex){
        proximo(ex)
    }
})


module.exports = roteador