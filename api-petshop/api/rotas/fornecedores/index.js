const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'GET, POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()
})

roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    const serializador = new SerializadorFornecedor(
        resposta.getHeader('Content-Type'),
        ['empresa', 'categoria']
        )
    resposta.status(200).send(
        serializador.serializar(resultados)
        )
    resposta.send('Ok')
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try{
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            ['empresa', 'categoria']
            )
        resposta.status(201).send(serializador.serializar(fornecedor))
    } catch(ex){
        proximo(ex)
    }
})

roteador.options('/:idFornecedor', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()
})

roteador.get('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id})
        await fornecedor.carregar()
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            ['empresa', 'categoria', 'email', 'dataCriacao', 'dataAtualizacao', 'versao']
            )
        resposta.status(200).send(serializador.serializar(fornecedor))
    } catch(ex){
        proximo(ex)
    }
})

roteador.put('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try{
        const id = requisicao.params.idFornecedor
        const dadosRequisicao = requisicao.body
        const dados = Object.assign({}, dadosRequisicao, { id: id})
        const fornecedor = new Fornecedor (dados)
        await fornecedor.atualizar()
        resposta.status(204).end()
    }catch(ex){
        proximo(ex)
    }
} )

roteador.delete('/:idFornecedor', async (requisicao, resposta, proxio) => {
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor( { id: id})
        await fornecedor.carregar(id)
        await fornecedor.remover()
        resposta.status(204).end()
    }catch(ex){
        proximo(ex)
    }

})

const roteadorProdutos = require("./produtos")
const verificarFornecedor = async (requisicao, resposta, proximo) => {
    try{
        const idFornecedor = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({ id: idFornecedor})
        await fornecedor.carregar()
        requisicao.fornecedor = fornecedor
        proximo()
    } catch(ex){
        proximo(ex)
    }

}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador