const roteador = require('express').Router({ mergeParams:true })
const Tabela = require('./TabelaProdutos')
const Produto = require('./Produto')
const SerializadorProduto = require('../../../Serializador').SerializadorProduto


roteador.options('/', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'GET, POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()
})

roteador.get('/', async (requisicao, resposta) => {
    const produtos = await Tabela.listar(requisicao.fornecedor.id)
    const serializador = new SerializadorProduto(resposta.getHeader('Content-Type'))
    resposta.status(200).send(serializador.serializar(produtos))
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try{    
        const idFornecedor = requisicao.fornecedor.id
        const dadosRecebidos = requisicao.body
        console.log(dadosRecebidos)
        const dados = Object.assign({}, dadosRecebidos, { fornecedor: idFornecedor})
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new SerializadorProduto(resposta.getHeader('Content-Type'))
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Etag', produto.versao).set('Last-Modified', timestamp).set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}/`)
        resposta.status(201).send(serializador.serializar(produto))
    }catch(ex){
        proximo(ex)
    }
})

roteador.options('/idProduto', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'GET, DELETE, PUT, HEAD')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()
})

roteador.delete('/:idProduto', async (requisicao, resposta) => {
    const dados = {
        id:  requisicao.params.idProduto,
        fornecedor: requisicao.fornecedor.id
    }
    const produto = new Produto(dados)
    await produto.deletar()
    resposta.status(204).end()
})

roteador.get('/:idProduto', async(requisicao, resposta, proximo) => {
    try{
        const dados = {
            id:  requisicao.params.idProduto,
            fornecedor: requisicao.fornecedor.id
        } 
        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new SerializadorProduto(resposta.getHeader('Content-Type'),["preco", "estoque"])
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Etag', produto.versao).set('Last-Modified', timestamp)
        resposta.status(200).send(serializador.serializar(produto))
    }catch(ex){
        proximo(ex)
    }
})

roteador.head('/:idProduto',  async(requisicao, resposta, proximo) => {
    try{
        const dados = {
            id:  requisicao.params.idProduto,
            fornecedor: requisicao.fornecedor.id
        } 
        const produto = new Produto(dados)
        await produto.carregar()
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Etag', produto.versao).set('Last-Modified', timestamp)
        resposta.status(200).end()
    }catch(ex){
        proximo(ex)
    }
})

roteador.put('/:idProduto', async (requisicao, resposta, proximo) => {
    try{
        const dadosRequisicao = requisicao.body
        const dados = Object.assign({}, dadosRequisicao, { 
            id: requisicao.params.idProduto,
            fornecedor: requisicao.fornecedor.id
        })
        const produto = new Produto (dados)
        await produto.atualizar()
        await produto.carregar()
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Etag', produto.versao).set('Last-Modified', timestamp)
        resposta.status(204).end()
    }catch(ex){
        proximo(ex)
    }
} )

roteador.options('/idProduto/diminuir-estoque', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204).end()
})

roteador.post('/:idProduto/diminuir-estoque', async (requisicao, resposta, proximo) => {
    try{        
        const produto = new Produto ({
            id: requisicao.params.idProduto,
            fornecedor: requisicao.fornecedor.id
        })
        await produto.carregar()
        produto.estoque = produto.estoque - requisicao.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar()
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Etag', produto.versao).set('Last-Modified', timestamp)
        resposta.status(204).end()
    }catch(ex){
        proximo(ex)
    }
} )



module.exports = roteador   