const e = require("express")
const CampoInvalido = require("../../erros/CampoInvalido")
const DadosNaoFornecidos = require("../../erros/DadosNaoFornecidos")
const TabelaFornecedor = require('./TabelaFornecedor')

class Fornecedor {
    constructor ({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.empresa = empresa
        this.email = email
        this.categoria = categoria
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    async criar() {
        this.validar()
        const resultado = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })

        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    async carregar() {
        const fornecedor = await TabelaFornecedor.buscarPorId(this.id)
        this.empresa = fornecedor.empresa
        this.email = fornecedor.email
        this.categoria = fornecedor.categoria
        this.dataCriacao = fornecedor.dataCriacao
        this.dataAtualizacao = fornecedor.dataAtualizacao
        this.versao = fornecedor.versao
    }

    async atualizar() {
        await TabelaFornecedor.buscarPorId(this.id)
        const campos = ["empresa", "email", "categoria"]
        const dadosAtualizar = {}
        campos.forEach((campo) => {
            const valor = this[campo]
            if(typeof(valor) === 'string'){
                if(valor.length > 0){
                    dadosAtualizar[campo] = valor
                }
            }        
        })
        if(!Object.keys(dadosAtualizar).length > 0){
            throw new DadosNaoFornecidos();
        }
        await TabelaFornecedor.atualizar(this.id, dadosAtualizar)
    }

    async remover (){
        return await TabelaFornecedor.remover(this.id)
    }

    validar() {
        const campos = ["empresa", "email", "categoria"]
        campos.forEach((campo) => {
            const valor = this[campo]
            if(typeof(valor) !== 'string' || !valor.length > 0){
                throw new CampoInvalido(campo);
            }    
        })
    }
}
 
module.exports = Fornecedor