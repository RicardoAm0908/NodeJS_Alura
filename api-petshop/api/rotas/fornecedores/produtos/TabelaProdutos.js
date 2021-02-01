const Modelo = require('./ModeloTabelaProduto')
const instancia = require('../../../banco-de-dados')
const NaoEncontrado = require('../../../erros/NaoEncontrado')

module.exports = {
    async listar(idFornecedor) {
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw: true
        })
    },
    inserir(dados){
        return Modelo.create(dados)
    },
    remover(idProduto, idFornecedor){
        return Modelo.destroy({
            where:{
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true
        })
    },
    async buscarPorId(idProduto, idFornecedor){
        const retorno = await Modelo.findOne({
            where:{
                id: idProduto,
                fornecedor: idFornecedor
            }
        })        
        if(!retorno){
            throw new NaoEncontrado('Produto')
        }
        return retorno
    },
    async atualizar(dadosProduto, dadosParaAtualizar){
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: { 
                    id: dadosProduto.id,
                    fornecedor: dadosProduto.fornecedor
                }
            }
        )
    },
    Subtrair(idProduto, idFornecedor, campo, valor){
        return instancia.transaction(async transacao => {
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })
            produto[campo] = valor
            await produto.save()
            return produto
        })
    }
}