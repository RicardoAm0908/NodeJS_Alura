const Modelo = require('./ModeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')


module.exports = {
    listar() {
        return Modelo.findAll({
            raw: true
        })
    },

    inserir(fornecedor) {
        return Modelo.create(fornecedor)
    },

    async buscarPorId(id){
        const retorno = await Modelo.findOne({
            where:{
                id: id
            }
        })
        if(!retorno){
            throw new NaoEncontrado("Fornecedor")
        }
        return retorno
    },

    async atualizar(id, dadosParaAtualizar){
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: { 
                    id: id
                }
            }
        )
    },

    async remover(id){
        return Modelo.destroy({
            where: { id:id }
        })
    }


}