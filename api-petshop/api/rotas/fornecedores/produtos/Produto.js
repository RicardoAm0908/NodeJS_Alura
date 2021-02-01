const Tabela = require('./TabelaProdutos')
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos')
const CampoInvalido = require('../../../erros/CampoInvalido')

class Produto {
    constructor({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao }){
        this.id = id,
        this.titulo = titulo,
        this.preco = preco,
        this.estoque = estoque,
        this.fornecedor = fornecedor,
        this.dataCriacao = dataCriacao,
        this.dataAtualizacao = dataAtualizacao,
        this.versao = versao
    }

    validar (){
        if(typeof this.titulo !== 'string' || this.titulo.length === 0){
            throw new CampoInvalido('título');
        }
        if(typeof this.preco !== 'number' || this.preco <= 0){
            throw new CampoInvalido('preço');
        }        
    }

    async criar() {
        this.validar()
        const resultado = await Tabela.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        })

        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    async deletar(){
        return await Tabela.remover(this.id, this.fornecedor)
    }

    async carregar(){
        const produto = await Tabela.buscarPorId(this.id, this.fornecedor)
        this.titulo = produto.titulo
        this.preco = produto.preco
        this.estoque = produto.estoque
        this.dataCriacao = produto.dataCriacao
        this.dataAtualizacao = produto.dataAtualizacao
        this.versao = produto.versao
    }

    async atualizar(){
        await Tabela.buscarPorId(this.id, this.fornecedor)
        const dadosAtualizar = {}

        if(typeof this.titulo === 'string' && this.titulo.length > 0){
            dadosAtualizar.titulo = this.titulo
        }

        if(typeof this.preco === 'number' && this.preco > 0){
            dadosAtualizar.preco = this.preco
        }

        if(typeof this.estoque === 'number' && this.estoque >= 0){
            dadosAtualizar.estoque = this.estoque
        }
        
        if(!Object.keys(dadosAtualizar).length > 0){
            throw new DadosNaoFornecidos();
        }
        await Tabela.atualizar({
                id: this.id, 
                fornecedor: this.fornecedor
            },
            dadosAtualizar
        )
    }

    async diminuirEstoque (){
        return Tabela.Subtrair(
            this.id,
            this.fornecedor,
            'estoque',
            this.estoque
        )
    }

}

module.exports = Produto