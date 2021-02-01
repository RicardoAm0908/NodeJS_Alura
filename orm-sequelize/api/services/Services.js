const database = require('../models')

class Services {
    constructor(modelo){
        this.modelo = modelo
    }

    async BuscarTodos(){
        return database[this.modelo].findAll()
    }

    async BuscarPorId(id){
        return database[this.modelo].findOne({
            where: {
                id: id
            }
        })
    }

    async Inserir(dados){
        return database[this.modelo].create(dados)
    }

    async Excluir(id){
        await database[this.modelo].destroy({
            where:{
                id: id
            }
        })            
    }

    async Atualizar(dados, id, transacao = {}){
        await database[this.modelo].update(dados, {
            where:{
                id: id
            }
        }, transacao)
    }

    async AtualizarRegistros(where, dados, transacao = {}){
        await database[this.modelo].update(dados, {
            where:{ ...where }
        }, transacao)
    }
}

module.exports = Services